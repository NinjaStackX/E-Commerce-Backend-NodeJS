import { mongoose } from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    target: String,
    meta: Object,
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);
