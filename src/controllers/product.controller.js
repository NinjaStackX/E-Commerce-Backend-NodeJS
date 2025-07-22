import cloudinary from "../config/couldnary.js";
import { Category, Product } from "../models/index.js";
import { productValidation } from "../validations/productValidation.js";

export const createProduct = async (req, res) => {
  const parsed = productValidation.safeParse(req.body);
  if (!parsed.success) return res.json({ error: parsed.error.format() });
  //============================test upload=====================
  // console.log();

  // cloudinary.uploader
  //   .upload("../../public/shoes.webp", { folder: "product" })
  //   .then((result) => {
  //     console.log("Upload successful:", result.secure_url);
  //   })
  //   .catch((error) => {
  //     console.error("Error uploading:", error);
  //   });

  //====================need Couldary Confing======================
  // const uploadedImages = req.files.map((file) => ({
  //   url: file.path,
  //   public_id: file.filename,
  // }));
  // const mainImage = {
  //   url: uploadedImages[0].url,
  //   public_id: uploadedImages[0].public_id,
  // };
  // const images = uploadedImages.slice(1);

  const { title, category } = req.body;

  const checkCate = await Category.findOne({ name: category });
  if (!checkCate) {
    await Category.create({ name: category });
  }

  const categoryId = (await Category.findOne({ name: category }))._id;
  const newproduct = {
    ...parsed.data,
    category: categoryId,
    //==============need Coundary Confing=======================
    // mainImage,
    // images,
  };

  await Product.create(newproduct);
  res.status(200).json({
    success: true,
    message: `create product ( ${title} ) Successfully`,
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
