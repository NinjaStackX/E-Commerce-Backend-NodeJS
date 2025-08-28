import express from "express";

import { restrictTo } from "../middlewares/protect.js";
import { getUser } from "../controllers/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", restrictTo("user ".trim(), "admin"), asyncHandler(getUser));

export default router;
