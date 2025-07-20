// import jwt from "jsonwebtoken";
// import { User } from "../models/index.js";

// export const protect = async (req, res, next) => {
//   const header = req.headers.authorization;
//   if (!header || !header.startsWith("Bearer")) {
//     return res.json({ error: "auth is required!" });
//   }
//   const token = header.split(" ")[1];

//   const userId = jwt.verify(token, process.env.JWT_SECRET).id;
//   const user = await User.findById(userId).select("-password");
//   req.user = user;
//   next();
// };

// export const restrictTo = (...roles) => {
//   //  not async (...roles)
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.json({ error: "Premission access is denied" });
//     }
//     next();
//   };
// };
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer")) {
      return res.status(401).json({ error: "Authorization is required!" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Permission denied" });
    }
    next();
  };
};
