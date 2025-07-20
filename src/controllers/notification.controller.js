import { Notification } from "../models/index.js";

export const getNotification = async (req, res) => {
  const notification = await Notification.find();
  res.json(notification);
};
