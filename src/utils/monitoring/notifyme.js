import { getIO } from "../../config/socket.js";
import { Notification } from "../../models/index.js";

/** 
@param {string} userId - معرف المستخدم (ObjectId)
@param {string} message - محتوى الإشعار
@param {string} type - نوع الإشعار: "order" | "user" | "system"
*/

export const notifyUser = async (userId, message, type = "system") => {
  // 1. احفظ الإشعار في قاعدة البيانات
  const notification = await Notification.create({
    user: userId,
    message,
    type,
  });

  // 2. أرسل الإشعار لحظيًا عبر Socket.io
  const io = getIO();
  io.to(userId).emit("notification", {
    _id: notification._id,
    message: notification.message,
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  });
};
