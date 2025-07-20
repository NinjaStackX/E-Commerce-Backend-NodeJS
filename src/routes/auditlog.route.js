import { restrictTo } from "../middlewares/protect.js";
import { AuditLog } from "../models/index.js";

import express from "express";

const router = express.Router();
router.get("/", restrictTo("admin "), async (req, res) => {
  const auditlog = await AuditLog.find();
  res.json(auditlog);
});
export default router;
