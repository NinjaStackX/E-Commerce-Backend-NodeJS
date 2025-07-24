import express from "express";
import {
  createProduct,
  getMyProduct,
} from "../controllers/product.controller.js";
import asyncHandler from "../utils/tools/asyncHandler.js";
import { uploadImages } from "../middlewares/upload.js";

const router = express.Router();
router
  .route("/")
  .post(uploadImages, asyncHandler(createProduct))
  .get(asyncHandler(getMyProduct));

export default router;
