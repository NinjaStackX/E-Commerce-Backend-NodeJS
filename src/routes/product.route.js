import express from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/product.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadImages } from "../middlewares/upload.js";

const router = express.Router();
router
  .route("/")
  .post(uploadImages, asyncHandler(createProduct))
  .get(asyncHandler(getProducts));

export default router;
