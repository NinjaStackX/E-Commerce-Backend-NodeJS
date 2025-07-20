import { AuditLog } from "../../models/index.js";

export default function createAuditLog(action, userId, targetId, meta = {}) {
  return auditLogModel.create({
    action,
    performedBy: userId,
    target: targetId,
    meta,
  });
}
