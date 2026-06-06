const { Server } = require("socket.io");
const SupportConversation = require("../models/supportConversation");
const SupportMessage = require("../models/supportMessage");

const DEFAULT_ADMIN_ID = "399810b5-85e0-465d-9cd8-5dc79fc87bfa";

//@param userId
//@result conv
async function findOrCreateSupportConversation(userId) {
  const filter = {
    user: userId,
    admin: DEFAULT_ADMIN_ID,
  };

  const update = {
    $setOnInsert: {
      isClosed: false,
      unreadCountForAdmin: 0,
      unreadCountForUser: 0,
    },
  };

  const options = {
    new: true,
    upsert: true,
  };

  const conv = await SupportConversation.findOneAndUpdate(
    filter,
    update,
    options
  );

  return conv;
}

//@param server
//@result io
function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Khi FE join vào phòng đơn hàng (cũ)
    socket.on("joinOrderRoom", (orderId) => {
      socket.join(orderId);
      console.log(`📦 Client ${socket.id} joined room: ${orderId}`);
    });

    // lấy thông tin user khi FE join vào chat
    const { userId, role } = socket.handshake.auth || {};
    socket.data.userId = userId || null; // string _id user
    socket.data.role = role || "user"; // "user" | "admin"

    if (role === "admin" && userId) {
      socket.join("supportAdmins");
      console.log(`👨‍💻 Admin ${userId} joined supportAdmins room`);
    }

    /**
     * USER JOIN VÀO CHAT SUPPORT
     */
    socket.on("support:join", async () => {
      try {
        const uid = socket.data.userId;
        const r = socket.data.role;

        if (!uid || r !== "user") {
          console.log(
            "❌ support:join không hợp lệ (chưa có userId hoặc không phải user)"
          );
          return;
        }

        const room = `support:${uid}`;
        socket.join(room);
        console.log(`💬 User ${uid} joined support room ${room}`);

        const conv = await findOrCreateSupportConversation(uid);

        const history = await SupportMessage.find({ conversation: conv._id })
          .sort({ createdAt: 1 })
          .lean();

        socket.emit("support:history", history);
      } catch (err) {
        console.error("support:join error:", err);
        socket.emit("support:error", "Không vào được phòng hỗ trợ");
      }
    });

    /**
     * ADMIN JOIN VÀO PHÒNG CỦA 1 USER
     */
    socket.on("support:adminJoinUser", async ({ userId: targetUserId }) => {
      try {
        if (socket.data.role !== "admin") return;
        if (!targetUserId) return;

        // rời khỏi room cũ nếu có
        const prevRoom = socket.data.currentSupportRoom;
        if (prevRoom) {
          socket.leave(prevRoom);
          console.log(`👋 Admin ${socket.id} left room ${prevRoom}`);
        }

        const room = `support:${targetUserId}`;
        socket.join(room);
        socket.data.currentSupportRoom = room;

        console.log(
          `👨‍💻 Admin ${socket.data.userId} joined support room of user ${targetUserId}`
        );

        const conv = await findOrCreateSupportConversation(targetUserId);

        const history = await SupportMessage.find({ conversation: conv._id })
          .sort({ createdAt: 1 })
          .lean();

        socket.emit("support:history", history);
      } catch (err) {
        console.error("support:adminJoinUser error:", err);
        socket.emit("support:error", "Không vào được phòng chat của user");
      }
    });

    /**
     * USER GỬI TIN NHẮN
     * - FE user: socket.emit("support:userSend", { text })
     */
    socket.on("support:userSend", async ({ text }) => {
      try {
        const uid = socket.data.userId;
        const r = socket.data.role;

        if (!uid || r !== "user") return;
        if (!text || !text.trim()) return;

        const conv = await findOrCreateSupportConversation(uid);

        const msg = await SupportMessage.create({
          conversation: conv._id,
          sender: uid,
          senderRole: "user",
          text: text.trim(),
          isRead: false,
          readAt: null,
        });

        // 🔢 tăng bộ đếm chưa đọc cho admin
        await SupportConversation.findByIdAndUpdate(conv._id, {
          $inc: { unreadCountForAdmin: 1 },
        });

        const payload = {
          _id: msg._id,
          conversation: conv._id,
          sender: uid,
          senderRole: "user",
          text: msg.text,
          isRead: msg.isRead,
          readAt: msg.readAt,
          createdAt: msg.createdAt,
        };

        const room = `support:${uid}`;

        io.to(room).emit("support:newMessage", payload);

        io.to("supportAdmins").emit("support:newMessageAdmin", {
          ...payload,
          userId: uid,
        });
      } catch (err) {
        console.error("support:userSend error:", err);
        socket.emit("support:error", "Không gửi được tin nhắn");
      }
    });

    /**
     * ADMIN GỬI TIN NHẮN CHO 1 USER
     * - FE admin: socket.emit("support:adminSend", { userId, text })
     */
    socket.on("support:adminSend", async ({ userId: targetUserId, text }) => {
      try {
        if (socket.data.role !== "admin") return;
        if (!targetUserId || !text || !text.trim()) return;

        const adminId = socket.data.userId;
        const conv = await findOrCreateSupportConversation(targetUserId);

        const msg = await SupportMessage.create({
          conversation: conv._id,
          sender: adminId,
          senderRole: "admin",
          text: text.trim(),
          isRead: false,
          readAt: null,
        });

        // 🔢 TĂNG SỐ TIN CHƯA ĐỌC CHO USER (nếu sau này phía user muốn hiển thị badge)
        conv.unreadCountForUser = (conv.unreadCountForUser || 0) + 1;
        await conv.save();

        const payload = {
          _id: msg._id,
          conversation: conv._id,
          sender: adminId,
          senderRole: "admin",
          text: msg.text,
          isRead: msg.isRead,
          readAt: msg.readAt,
          createdAt: msg.createdAt,
          userId: targetUserId,
        };

        const room = `support:${targetUserId}`;

        // Gửi cho user + admin trong room user đó
        io.to(room).emit("support:newMessage", {
          ...payload,
          messageCountForUser: conv.unreadCountForUser, // user có thể dùng nếu muốn
        });

        // Gửi notify cho tất cả admin (nếu cần giữ list luôn realtime)
        io.to("supportAdmins").emit("support:newMessageAdmin", {
          ...payload,
          messageCountForAdmin: conv.unreadCountForAdmin, // không đổi khi admin gửi
        });
      } catch (err) {
        console.error("support:adminSend error:", err);
        socket.emit("support:error", "Không gửi được tin nhắn");
      }
    });

    /**
     * ĐÁNH DẤU ĐÃ ĐỌC (UNREAD -> READ)
     *
     * - User:  socket.emit("support:markAsRead")
     * - Admin: socket.emit("support:markAsRead", { userId })
     */
    socket.on("support:markAsRead", async ({ userId: targetUserId } = {}) => {
      try {
        const viewerRole = socket.data.role; // "user" | "admin"
        const viewerId = socket.data.userId;

        if (!viewerRole || !viewerId) return;

        let conv;

        if (viewerRole === "user") {
          conv = await findOrCreateSupportConversation(viewerId);
        } else if (viewerRole === "admin") {
          if (!targetUserId) return;
          conv = await findOrCreateSupportConversation(targetUserId);
        } else {
          return;
        }

        if (!conv) return;

        const oppositeRole = viewerRole === "user" ? "admin" : "user";

        await SupportMessage.updateMany(
          {
            conversation: conv._id,
            senderRole: oppositeRole,
            isRead: false,
          },
          {
            $set: {
              isRead: true,
              readAt: new Date(),
            },
          }
        );

        // 🔥 reset bộ đếm
        if (viewerRole === "admin") {
          await SupportConversation.findByIdAndUpdate(conv._id, {
            $set: { unreadCountForAdmin: 0 },
          });
        } else if (viewerRole === "user") {
          await SupportConversation.findByIdAndUpdate(conv._id, {
            $set: { unreadCountForUser: 0 },
          });
        }

        socket.emit("support:markAsRead:done", {
          conversationId: conv._id,
        });
      } catch (err) {
        console.error("support:markAsRead error:", err);
        socket.emit("support:error", "Không đánh dấu đã đọc được");
      }
    });

    socket.on("support:adminInitUnread", async () => {
      try {
        if (socket.data.role !== "admin" || !socket.data.userId) return;

        const adminId = socket.data.userId;

        const convs = await SupportConversation.find({
          admin: adminId,
        }).lean();

        const unreadMap = {};
        convs.forEach((c) => {
          unreadMap[c.user] = c.unreadCountForAdmin || 0;
        });

        socket.emit("support:initUnread", unreadMap);
      } catch (err) {
        console.error("support:adminInitUnread error:", err);
      }
    });

    socket.on("support:userInitUnread", async () => {
      try {
        if (socket.data.role !== "user" || !socket.data.userId) return;

        const uid = socket.data.userId;
        const conv = await SupportConversation.findOne({
          user: uid,
          admin: DEFAULT_ADMIN_ID,
        }).lean();

        const unreadCount = conv?.unreadCountForUser || 0;

        socket.emit("support:initUnreadForUser", { unreadCount });
      } catch (err) {
        console.error("support:userInitUnread error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = { initSocket };
