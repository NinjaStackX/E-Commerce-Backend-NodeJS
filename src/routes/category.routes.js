import express from "express";
import {
  createCategory,
  deleteAllCategories,
  deleteCategory,
  getAllCategory,
} from "../controllers/category.controller.js";
import asyncHandler from "../utils/tools/asyncHandler.js";

const router = express.Router();

router
  .route("/")
  .post(asyncHandler(createCategory))
  .get(asyncHandler(getAllCategory))
  .delete(asyncHandler(deleteAllCategories));
router.route(":id").delete(asyncHandler(deleteCategory));

export default router;
