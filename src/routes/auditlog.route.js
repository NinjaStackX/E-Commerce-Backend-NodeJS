import { restrictTo } from "../middlewares/protect.js";

import express from "express";
import asyncHandler from "../utils/tools/asyncHandler.js";
import { getAuditLog } from "../controllers/auditlog.controller.js";

const router = express.Router();
router.get("/", restrictTo("admin "), asyncHandler(getAuditLog));
export default router;
