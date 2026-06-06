// models/isBlock.js
const mongoose = require('mongoose');

const isBlockSchema = new mongoose.Schema(
  {
    // lấy từ MySQL User
    user_id: {
      type: String, // vì user_id bên MySQL là UUID => lưu dạng String
      required: true,
      index: true,
      unique: true, // mỗi user chỉ có 1 record block
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    avatar: {
      type: String,
      default: null,
    },

    // field isBlock
    isBlock: {
      type: Boolean,
      default: false, // mặc định là không bị block
      required: true,
    },
  },
  {
    collection: 'user_blocks', // tên collection trong MongoDB
    timestamps: true,          // tự tạo createdAt, updatedAt
  }
);

const IsBlock = mongoose.model('IsBlock', isBlockSchema);

module.exports = IsBlock;
