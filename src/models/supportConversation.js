const mongoose = require("mongoose");

const supportConversationSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },  // UUID string
    admin: { type: String, required: true }, // UUID string
    isClosed: { type: Boolean, default: false },

    // 🔢 tổng số tin chưa đọc cho từng phía
    unreadCountForAdmin: {
      type: Number,
      default: 0,
    },
    unreadCountForUser: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


// 🔐 đảm bảo mỗi (user, admin) chỉ có 1 conversation
supportConversationSchema.index(
  { user: 1, admin: 1 },
  { unique: true }
);


module.exports = mongoose.model("SupportConversation", supportConversationSchema);
