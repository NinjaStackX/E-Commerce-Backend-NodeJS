import { Notification } from "../models/index.js";

export const getNotification = async (req, res) => {
  const notification = await Notification.find();
  if (!notification || notification.length === 0) {
    return res.status(403).json({
      success: false,
      message: "Oops,There are any notification to show it!",
      notification: [],
    });
  }
  res.status(200).json({
    success: true,
    message: "Completed get notification successfully!",
    notification,
  });
};
