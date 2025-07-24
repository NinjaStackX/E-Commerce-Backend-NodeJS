import multer from "multer";
import cloudinary from "../config/couldnary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("you can use images only", false));
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Bashar-eCommerce",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadImages = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
