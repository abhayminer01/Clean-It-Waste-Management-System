const bcrypt = require("bcrypt");
const User = require("../models/user.model");

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.user_id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const { full_name, mobile_number, address, district } = req.body;
    const user = await User.findByIdAndUpdate(
      req.session.user.user_id,
      { full_name, mobile_number, address, district },
      { new: true }
    ).select("-password");

    res.json({ success: true, message: "Profile updated", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.session.user.user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// LOGOUT
const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: "Logged out successfully" });
  });
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  logoutUser,
};
