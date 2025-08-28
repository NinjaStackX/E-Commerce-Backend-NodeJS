import express from "express";

import { restrictTo } from "../middlewares/protect.js";
//import { getUsers } from "../controllers/admin.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

//router.get("/", restrictTo("admin user"), asyncHandler(getUsers));

export default router;
