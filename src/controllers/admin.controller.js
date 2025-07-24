import { User } from "../models/index.js";

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
