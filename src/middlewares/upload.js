import multer from "multer";
import cloudinary from "../config/couldnary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    //startWith error s
    cb(null, true);
  } else {
    cb(new Error("you can use images only", false));
  }
};
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Bashar-eCommerce",
    allowed_formats: ["jpg", "png", "jepg", "webp"],
    transformation: [{ width: 800, hight: 800, crop: "limit" }],
  },
});
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
export const uploadSignale = upload.single("image");
export const uploadMultiple = upload.array("images", 5); // هون انا شاكك يا ب s يا بلا
