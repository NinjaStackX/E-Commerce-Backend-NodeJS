import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router
  .post("/register", asyncHandler(register)) //
  .post("/login", asyncHandler(login));

export default router;
