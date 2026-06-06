// models/SupportMessage.js
const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId, // cái này vẫn là ObjectId của Conversation
      ref: "SupportConversation",
      required: true,
    },
    sender: {
      type: String, // UUID string
      required: true,
    },
    senderRole: { type: String, enum: ["user", "admin"], required: true },
    text: { type: String, required: true },

    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportMessage", supportMessageSchema);
