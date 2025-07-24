import { User } from "../models/index.js";

export const getUser = async (req, res) => {
  const user = await User.find({ name: req.user.name }).select("-password"); //{}, "name role email password "

  if (!user) {
    return res.status(403).json({
      success: false,
      message: "Oops,The user is not found!",
      user: null,
    });
  }
  res.status(200).json({
    success: true,
    message: "Completed get data user successfully!",
    user,
  });
};
