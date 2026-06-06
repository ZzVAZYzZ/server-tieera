const mongoose = require("mongoose");

const usedQRSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    used_at: {
      type: Date,
      default: Date.now,
    },
    user_id: {
      type: String, // lưu UUID từ MySQL user
      required: true,
    },
  },
  {
    collection: "used_qr",
  }
);

module.exports = mongoose.model("UsedQR", usedQRSchema);
