import express from "express";
import { restrictTo } from "../middlewares/protect.js";
import {
  createProduct,
  getMyProduct,
} from "../controllers/product.controller.js";
import asyncHandler from "../utils/tools/asyncHandler.js";

const router = express.Router();
router
  .route("/")
  .post(asyncHandler(createProduct))
  .get(asyncHandler(getMyProduct));

export default router;
