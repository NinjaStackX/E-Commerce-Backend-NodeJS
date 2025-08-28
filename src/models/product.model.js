import mongoose, { model } from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);
const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String },
    brand: { type: String },
    comment: { type: String },
    price: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
    quantity: { type: Number, require: true },
    //
    //
    //
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    numberOfReviews: {
      type: Number,
      default: 0,
    },
    mainImage: {
      url: String,
      public_id: String,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true }
);
export default model("Product", productSchema);
