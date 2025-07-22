import express from "express";

import { restrictTo } from "../middlewares/protect.js";
import { getUsers } from "../controllers/user.controller.js";
import asyncHandler from "../utils/tools/asyncHandler.js";

const router = express.Router();

router.get("/users", restrictTo("admin user"), asyncHandler(getUsers));

export default router;
