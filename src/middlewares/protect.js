import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer")) {
    return res.status(401).json({ error: "Authorization is required!" });
  }

  const token = header.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.id) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }

  req.user = user;
  next();
};
export const restrictTo = (...roles) => {
  const roleSet = new Set(roles);
  return (req, res, next) => {
    if (!roleSet.has(req.user.role)) {
      return res.status(403).json({ error: "Permission denied" });
    }
    next();
  };
};
