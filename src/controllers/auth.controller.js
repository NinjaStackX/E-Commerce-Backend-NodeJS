import userModel from "../models/user.model.js";

import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import {
  authValidationLog,
  authValidationReg,
} from "../validations/authValidation.js";

export const register = async (req, res) => {
  const parsed = authValidationReg.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invaild Inputs" });
  }

  const { name, email, password } = req.body;
  const hashed = await hash(password, 12);

  const user = await userModel.create({
    name,
    email,
    password: hashed,
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: `create user : ${name} successfully`,
  });
};

export const login = async (req, res) => {
  const parsed = authValidationLog.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ success: false, error: parsed.error.format() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }); //.lean();
  if (!user)
    return res
      .status(404)
      .json({ success: false, error: "can not find user! " });

  const checked = await compare(password, user.password);
  if (!checked)
    return res.status(401).json({ success: false, error: "wrong password! " });
  const payload = {
    id: user._id,
    role: user.role,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  }); // why user!=payload is not object it is mongooseDoc

  res.status(200).json({
    success: "login is successful!",
    message: `Welcome ${user.name}!`,
    token: token,
  });
};
