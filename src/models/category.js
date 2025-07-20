import { model, Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Category is required"],
      minlength: [2, "Category name must be at least 2 characters long"],
    },
  },
  { timestamps: true }
);
const Category = model("Category", CategorySchema);
export default Category;
