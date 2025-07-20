import { notifyUser } from "../utils/monitoring/notifyme.js";
import createAuditLog from "../utils/monitoring/auditLog.js";
export default function automate(
  userId = "68401ef601a3609b3e91836a",
  targetId = "685863aa92d28f900ee8c82a",
  massageForUser = "etc",
  actionForAdmin = "etc",
  type = "system"
) {
  notifyUser(userId, massageForUser, type);
  createAuditLog(actionForAdmin, userId, targetId, {});
}
