export const restrictTo1 = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Permission denied" });
    }
    next();
  };
};
export const restrictTo2 = (...roles) => {
  const map = {};
  let end = false;
  for (const element of roles) {
    if (!map[element.trim().toLowerCase()[0]]) {
      map[element.trim().toLowerCase()[0]] = [element];
    }

    map[element.trim().toLowerCase()[0]].push(element.trim().toLowerCase());
  }
  return (req, res, next) => {
    for (const element of map[req.user.role[0]]) {
      if (element === req.user.role) {
        end = true;

        break;
      }
    }
    if (!end) return res.status(403).json({ error: "Permission denied" });
    next();
  };
};
import cloudinary from "../config/couldnary.js";
import { Category, Product } from "../models/index.js";
import { productValidation } from "../validations/productValidation.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createProduct = async (req, res) => {
  const parsed = productValidation.safeParse(req.body);
  if (!parsed.success) return res.json({ error: parsed.error.format() });
  //============================test upload 1=====================
  // console.log("start-- Upload Success");

  // cloudinary.uploader
  //   .upload("../../public/shoes.webp", { folder: "product" })
  //   .then((result) => {
  //     console.log("Upload successful:", result.secure_url);
  //   })
  //   .catch((error) => {
  //     console.error("Error uploading:", error);
  //   });
  // console.log("end-- Upload Success");
  //============================test upload 2.0=====================
  // const imagePath = path.join(__dirname, "..", "..", "public", "shoes.webp");

  // console.log("start-- Upload Success");

  // cloudinary.uploader
  //   .upload(imagePath, { folder: "product" })
  //   .then((result) => {
  //     console.log("✅ Upload successful:", result.secure_url);
  //   })
  //   .catch((error) => {
  //     console.error("❌ Error uploading:", error);
  //   });

  // console.log("end-- Upload Success");
  //====================need Couldary Confing======================
  const uploadedImages = req.files.map((file) => ({
    url: file.path,
    public_id: file.filename,
  }));
  const mainImage = {
    url: uploadedImages[0].url,
    public_id: uploadedImages[0].public_id,
  };
  const images = uploadedImages.slice(1);

  const { title, category } = req.body;

  const checkCate = await Category.findOne({ name: category });
  if (!checkCate) {
    await Category.create({ name: category });
  }

  const categoryId = (await Category.findOne({ name: category }))._id;
  const newproduct = {
    ...parsed.data,
    category: categoryId,
    //==============need Coundary Confing=======================
    // mainImage,
    // images,
  };

  await Product.create(newproduct);
  res.status(200).json({
    success: true,
    message: `create product ( ${title} ) Successfully`,
  });
};
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
    allowed_formats: ["jpg", "jpeg", "png", "webp"], //not jepg
    transformation: [{ width: 800, height: 800, crop: "limit" }], //not hight
  },
});
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});
export const uploadSignale = upload.single("image");
export const uploadMultiple = upload.array("images", 5); // هون انا شاكك يا ب s يا بلا
//=====================================================================
export const createProduct1 = async (req, res) => {
  const parsed = productValidation.safeParse(req.body);
  if (!parsed.success) return res.json({ error: parsed.error.format() });

  const isMultiple = Array.isArray(req.files) && req.files.length > 0;
  const hasSingle = req.file;

  let mainImage, images;

  if (isMultiple) {
    const uploadedImages = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));
    mainImage = uploadedImages[0];
    images = uploadedImages.slice(1);
  } else if (hasSingle) {
    mainImage = {
      url: req.file.path,
      public_id: req.file.filename,
    };
    images = [];
  } else {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const { title, category } = req.body;
  const existingCategory =
    (await Category.findOne({ name: category })) ||
    (await Category.create({ name: category }));

  const newproduct = {
    ...parsed.data,
    category: existingCategory._id,
    mainImage,
    images,
  };

  await Product.create(newproduct);

  res.status(201).json({
    success: true,
    message: `✅ Product (${title}) created successfully`,
    data: newproduct,
  });
};
let products;
if (!products || products.length === 0) {
  return res.status(403).json({
    success: false,
    message: "Oops,There are any Products to show it!",
    products: [],
  });
}

const getMyProduct = async (req, res) => {
  let queryObj = {};

  if (req.query.keyword) {
    queryObj.$or = [
      {
        title: { $regex: req.query.keyword, $option: "i" },
        description: { $regex: req.query.keyword, $option: "i" },
      },
    ];
  }

  if (req.query.category) {
    queryObj.category = req.query.category;
  }

  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
  }
  if (req.query.minRating) {
    queryObj.rating = {
      $gte: Number(req.query.minRating),
    };
  }

  const query = await Product.find(queryObj);

  if (req.query.sortBy) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sortB === "desc" ? -1 : 1;
    query = query.sort({ [sortField]: sortOrder });
  }

  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  //query = query; //.limit(limit).skip(skip);

  const products = await query; //.lean();
  const total = await Product.countDocuments(queryObj);

  res.status(200).json({
    success: true,
    message: "Completed get Products successfully!",
    total,
    page,
    limit,
    products,
  });
};
