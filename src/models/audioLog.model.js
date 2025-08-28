import { model, Schema } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: String,
    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
    target: String,
    meta: Object,
  },
  { timestamps: true }
);

export default model("AuditLog", auditLogSchema);
