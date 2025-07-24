import { Category, Product } from "../models/index.js";
import { productValidation } from "../validations/productValidation.js";
export const createProduct = async (req, res) => {
  const parsed = productValidation.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, errors: parsed.error.format() });
  }

  // ✅ استخراج الصور من req.files
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
  const products = await Product.find();
  if (!products || products.length === 0) {
    return res.status(403).json({
      success: false,
      message: "Oops,There are any Products to show it!",
      products: [],
    });
  }
  res.status(200).json({
    success: true,
    message: "Completed get Products successfully!",
    products,
  });
};
