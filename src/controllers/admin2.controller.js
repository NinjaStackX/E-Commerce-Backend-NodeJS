import { Order, User } from "../models/index.js";

export const getUsers = async (req, res) => {
  const users = await User.find().select("-password"); //{}, "name role email password "
  if (!users || users.length === 0) {
    return res.status(403).json({
      success: false,
      message: "Oops,There are any users to show it!",
      users: [],
    });
  }
  res.status(200).json({
    success: true,
    message: "Completed get Users successfully!",
    users,
  });
};
export const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  if (!orders || orders.length === 0) {
    return res.status(403).json({
      success: false,
      message: "Oops,There are any orders to show it!",
      orders: [],
    });
  }
  res.status(200).json({
    success: true,
    message: "Completed get orders successfully!",
    orders,
  });
};
export const getAdminStats = async (req, res) => {};
export const deleteOrderAdmin = async (req, res) => {};
export const getAdminDetails = async (req, res) => {};
export const getSalesTrend = async (req, res) => {};
export const getAdminOverview = async (req, res) => {};
export const updateOrderStatus = async (req, res) => {};
export const getOrderByIdAdmin = async (req, res) => {};
