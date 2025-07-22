import { AuditLog } from "../models/index.js";

export const getAuditLog = async (req, res) => {
  const auditlog = await AuditLog.find();
  if (!auditlog || auditlog.length === 0) {
    return res.status(403).json({
      success: false,
      message: "Oops,There are any auditlog to show it!",
      auditlog: [],
    });
  }
  res.status(200).json({
    success: true,
    message: "Completed get auditlog successfully!",
    auditlog,
  });
};
