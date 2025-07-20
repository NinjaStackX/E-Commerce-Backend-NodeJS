// import on library

import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";

//         <<<<<<<<<<<<<<<<------------------------------------<<<<<<<<<<<<<<<

// import  middlewares

import { limiter } from "./src/middlewares/limiter.js";

//         <<<<<<<<<<<<<<<<------------------------------------<<<<<<<<<<<<<<<

// Enable middlewares

dotenv.config();

const app = express();

app.use(express.json()); //Important
app.use(helmet());
app.use(hpp());
app.use(cors());

//         <<<<<<<<<<<<<<<<------------------------------------<<<<<<<<<<<<<<<

// import Routes

import authRoutes from "./src/routes/auth.route.js";
import adminRoutes from "./src/routes/admin.route.js";
import audiologRoutes from "./src/routes/auditlog.route.js";
import notificationRoutes from "./src/routes/notification.route.js";
import productRoutes from "./src/routes/product.route.js";
import categoryRoutes from "./src/routes/category.routes.js";
import { protect } from "./src/middlewares/protect.js";
import errorHandler from "./src/middlewares/errorHandler.js";

//         <<<<<<<<<<<<<<<<------------------------------------<<<<<<<<<<<<<<<

// Enable Routes
app.use("/api/auth", authRoutes);
app.use(protect);
app.use("/api/admin", adminRoutes);
app.use("/api/auditlog", audiologRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);

app.use(errorHandler);
//         <<<<<<<<<<<<<<<<------------------------------------<<<<<<<<<<<<<<<

// main

app.get("/", (req, res) => {
  res.send("Bashar E-Commerce Backend is running ✅");
});

export default app;
