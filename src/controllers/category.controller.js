import { Category } from "../models/index.js";

export const createCategory = async (req, res) => {
  const { name } = req.body;
  const nameCate = name.toLowerCase();
  const category = await Category.create({
    name: nameCate,
  });
  res.status(200).json({
    success: true,
    message: `create category : ${category.name} successfully!`,
  });
};

export const getAllCategory = async (req, res) => {
  const Categories = await Category.find().sort("name");
  if (Categories.length === 0)
    return res.status(200).json({
      success: true,
      message: "Oops,There are any Category to show it!",
      Categories: [],
    });
  res.status(200).json({
    success: true,
    message: "complete get Categories successfully!",
    Categories,
  });
};
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("the category is not found");
  const nameCateDel = await Category.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: `The Categoty ${nameCateDel} deleted successfully!`,
  });
};
export const deleteAllCategories = async (req, res) => {
  const result = await Category.deleteMany({});
  res.status(200).json({
    success: true,
    message: `Completed delete Categories Successfully ,
    count: ${result.deletedCount} `,
  });
};
