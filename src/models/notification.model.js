import mongoose, { model, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
    type: { type: String, enum: ["order", "user", "system"], required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model("Notification", notificationSchema);
