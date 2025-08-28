import { Category, Product } from "../models/index.js";
import { queryBuilder } from "../utils/queryBuilder.js";
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
export const getProducts = async (req, res) => {
  const { total, page, limit, results } = await queryBuilder(
    Product,
    req.query
  );

  res
    .status(200)
    .json({ success: true, total, page, limit, products: results });
};
export const updateProduct = async (req, res) => {};
export const deleteProduct = async (req, res) => {};
export const rateProduct = async (req, res) => {};
export const createReview = async (req, res) => {};
export const removeProductImage = async (req, res) => {};
