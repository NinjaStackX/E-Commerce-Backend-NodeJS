import express from "express";
import {
  createCategory,
  deleteAllCategories,
  deleteCategory,
  getAllCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router
  .route("/")
  .post(createCategory)
  .get(getAllCategory)
  .delete(deleteAllCategories);
router.route(":id").delete(deleteCategory);

export default router;
