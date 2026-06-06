// controllers/isBlock.controller.js
const asyncHandler = require("express-async-handler");
const User = require("../models/users");       // Sequelize (MySQL)
const IsBlock = require("../models/isBlock");  // Mongoose (Mongo)

// @desc    Block a user
// @route   POST /api/users/:userId/block
// @access  private (admin)
//@param { userId }
//@result { message, userBlock }
const blockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params; // UUID từ MySQL

  // 1. kiểm tra user có tồn tại trong MySQL không
  const user = await User.findByPk(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // 2. tạo/cập nhật document trong Mongo
  const doc = await IsBlock.findOneAndUpdate(
    { user_id: user.user_id },
    {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      isBlock: true,
    },
    { upsert: true, new: true }
  );

  return res.status(200).json({
    message: "User has been blocked.",
    userBlock: doc,
  });
});

// @desc    Unblock a user
// @route   POST /api/users/:userId/unblock
// @access  private (admin)
//@param { userId }
//@result { message, userBlock }
const unblockUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const doc = await IsBlock.findOneAndUpdate(
    { user_id: userId },
    { isBlock: false },
    { new: true }
  );

  if (!doc) {
    return res.status(200).json({
      message:
        "User is not blocked or no block record exists. Nothing changed.",
    });
  }

  return res.status(200).json({
    message: "User has been unblocked.",
    userBlock: doc,
  });
});

// @desc    Get block status of a user
// @route   GET /api/users/:userId/block-status
// @access  private (admin)
//@param { userId }
//@result { user_id, isBlock, userBlock }
const getBlockStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const doc = await IsBlock.findOne({ user_id: userId }).lean();

  const isBlock = doc ? !!doc.isBlock : false;

  return res.status(200).json({
    user_id: userId,
    isBlock,
    userBlock: doc || null,
  });
});

// @desc    Get all blocked users
// @route   GET /api/users/blocked
// @access  private (admin)
//@param null
//@result { blockedUsers }
const getAllBlockedUsers = asyncHandler(async (req, res) => {
  const blockedUsers = await IsBlock.find({ isBlock: true }).lean();

  return res.status(200).json(blockedUsers);
});

module.exports = {
  blockUser,
  unblockUser,
  getBlockStatus,
  getAllBlockedUsers,
};
