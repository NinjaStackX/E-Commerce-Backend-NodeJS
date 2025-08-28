import express from "express";

import { restrictTo } from "../middlewares/protect.js";

import { getNotification } from "../controllers/notification.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();
router.get("/", restrictTo("admin"), asyncHandler(getNotification));
export default router;
