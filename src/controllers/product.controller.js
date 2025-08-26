import { Category, Product } from "../models/index.js";
import { productValidation } from "../validations/productValidation.js";
export const createProduct = async (req, res) => {
  const parsed = productValidation.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.format() });
  }

  const mainImage = req.files?.mainImage?.[0]
    ? {
        url: req.files.mainImage[0].path,
        public_id: req.files.mainImage[0].filename,
      }
    : null;

  const images =
    req.files?.images?.map((file) => ({
      url: file.path,
      public_id: file.filename,
    })) || [];

  if (!mainImage) {
    return res
      .status(400)
      .json({ success: false, message: "Main image is required" });
  }

  const { title, category } = req.body;
  const existingCategory =
    (await Category.findOne({ name: category })) ||
    (await Category.create({ name: category }));

  const newProduct = {
    ...parsed.data,
    category: existingCategory._id,
    mainImage,
    images,
  };

  await Product.create(newProduct);

  res.status(201).json({
    success: true,
    message: `✅ Product (${title}) created successfully`,
    data: newProduct,
  });
};

export const getMyProduct = async (req, res) => {
  let queryObj = {};

  if (req.query.keyword) {
    queryObj.$or = [
      {
        title: { $regex: req.query.keyword, $option: "i" },
        description: { $regex: req.query.keyword, $option: "i" },
      },
    ];
  }

  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
  }
  if (req.query.minRating) {
    queryObj.rating = {
      $gte: Number(req.query.minRating),
    };
  }

  const query = await Product.find(queryObj);

  if (req.query.sortBy) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sortB === "desc" ? -1 : 1;
    query = query.sort({ [sortField]: sortOrder });
  }

  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  //query = query; //.limit(limit).skip(skip);

  const products = await query; //.lean();
  const total = await Product.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    message: "Completed get Products successfully!",
    total,
    page,
    limit,
    products,
  });
};
export const updateProduct = async (req, res) => {};
export const deleteProduct = async (req, res) => {};
export const rateProduct = async (req, res) => {};
export const createReview = async (req, res) => {};
export const removeProductImage = async (req, res) => {};
