import express from "express";

import { User } from "../models/index.js";
import { restrictTo } from "../middlewares/protect.js";

const router = express.Router();

router.get("/users", restrictTo("admin user"), async (req, res) => {
  const users = await User.find({}, "name role email password ");

  res.json(users);
});

export default router;
