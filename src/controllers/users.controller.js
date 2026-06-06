const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const Refresh = require("../models/refresh");
const { nowVN } = require("../utils/time");
const cloudinary = require("../databases/cloudinary/cloudinaryConnect");
const fs = require("fs");
const SupportConversation = require("../models/supportConversation");
const IsBlock = require("../models/isBlock");

//@desc Register User
//@route POST /api/users/register
//@access public
//@param { name, email, password, phone, address, role } 
//@result {message, user}
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, role } = req.body;

  // input validation
  if (!email || !password) {
    res.status(400);
    throw new Error("Email, and password are required.");
  }
  // exist validation
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    res.status(400);
    throw new Error("Email is already registered.");
  }

  // mã hóa mật khẩu bằng thuật toán SHA256
  const hashedPassword = await bcrypt.hash(password, 10);

  // lưu thông tin tài khoản vào MySQL
  const newUser = await User.create({
    name: name || "User",
    email,
    password: hashedPassword,
    phone: phone || "",
    address: address || "",
    role: role || "user",
  });
  // lấy thông tin người dùng trừ mật khẩu để phản hồi
  const { password: _, ...userData } = newUser.get({ plain: true });
  // phản hồi
  res.status(201).json({
    message: "User registered successfully.",
    user: userData,
  });
});

//@desc Login User
//@route POST /api/users/login
//@access Public
//@param { email, password }
//@result {accessToken, message, user}
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const ipAddress =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.useragent;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required.");
  }
  // truy vấn người dùng dưới MySQL dựa trên email
  const user = await User.findOne({ where: { email } });
  // kiểm tra xem người dùng có bị block không
  const blockInfo = await IsBlock.findOne({ user_id: user.user_id });
  if (blockInfo && blockInfo.isBlock) {
    res.status(403);
    throw new Error("Your account has been blocked.");
  }
  // kiểm tra người dùng nhập vào có đúng mật khẩu không
  // Nếu đúng thì sử dụng JWT đăng ký token cho mục đích xác thực
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      process.env.REFRESH_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    // lưu lại RefreshToken, thông tin người dùng, thông tin thiết bị và địa chỉ IP khi đăng nhập
    Refresh.create({
      email: user.email,
      name: user.name,
      deviceInfo: {
        ipAddress: ipAddress,
        userAgent: userAgent.browser,
      },
      token: refreshToken,
      time: nowVN(),
    });

    // 30 * 24 * 60 * 60 * 1000 = 30 days
    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      // sameSite: "None",
      // path: "/"
    });

    const info = {
      user_id: user.user_id,
      google_id: user.google_id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
    };

    return res.status(200).json({
      accessToken,
      message: "Login successful",
      user: info,
    });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid.");
  }
});

//@desc Current User
//@route GET /api/users/current
//@access private
//@result {user}
const current = (req, res) => {
  console.log(req.user);

  const info = {
    user_id: req.user.user_id,
    google_id: req.user.google_id,
    name: req.user.name,
    avatar: req.user.avatar,
    email: req.user.email,
    phone: req.user.phone,
    address: req.user.address,
    role: req.user.role,
  };
  res.status(200).json({ user: info });
};

//@param { name, email, phone, address }
//@result { message, user}
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.user_id;
  const { name, email, phone, address } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.user_id !== userId) {
      res.status(400);
      throw new Error("Email is already registered.");
    }
    user.email = email;
  }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (address !== undefined) user.address = address;

  await user.save();

  const { password: _, ...userData } = user.get({ plain: true });

  res.status(200).json({
    message: "Profile updated successfully.",
    user: userData,
  });
});


//@param { file }
//@result { message, user}
const uploadAvatar = asyncHandler(async (req, res) => {
  const userId = req.user?.user_id;
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error("Avatar file is required.");
  }

  const user = await User.findByPk(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const uploadResult = await cloudinary.uploader.upload(file.path, {
    folder: "tierra/avatars",
    transformation: [{ width: 600, height: 600, crop: "limit" }],
  });

  user.avatar = uploadResult.secure_url;
  await user.save();

  try {
    await fs.promises.unlink(file.path);
  } catch (err) {
    console.warn("Failed to remove temp file:", err.message);
  }

  const { password: _, ...userData } = user.get({ plain: true });

  res.status(200).json({
    message: "Avatar updated successfully.",
    user: userData,
  });
});

//@desc Logout User
//@route POST /api/users/logout
//@access public
//@param { cookie }
//@result { message}
const logout = asyncHandler(async (req, res) => {
  // const { email, token } = req.body;
  const cookie = req.cookies.refreshToken;

  if (!cookie) {
    return res.status(204).json({ message: "No content - already logged out" });
  }

  const deletedToken = await Refresh.findOneAndDelete({ token: cookie });

  if (!deletedToken) {
    console.warn("⚠️ Refresh token không tồn tại trong DB");
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  res.status(200).json({ message: "Log out successful" });
});

//@desc Refresh User
//@route POST /api/users/refresh
//@access private
//@result { accessToken}
const refresh = asyncHandler((req, res) => {
  // generate access token

  const accessToken = jwt.sign(
    {
      user: {
        id: req.user.user_id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({
    accessToken,
  });
});

//@desc Oauth 2.0
//@route POST /api/users/google/callback
//@access private
//@param { google email }
//@result { message, token}
const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;
    const ipAddress =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = req.useragent;
    if (!user) {
      return res.status(400).json({ message: "User not found in request" });
    }

    const token = jwt.sign(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
        },
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      process.env.REFRESH_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    Refresh.create({
      email: user.email,
      name: user.name,
      deviceInfo: {
        ipAddress: ipAddress,
        userAgent: userAgent.browser,
      },
      token: refreshToken,
      time: nowVN(),
    });

    // 30 * 24 * 60 * 60 * 1000 = 30 days
    res.cookie("refreshToken", refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "None",
      // path: "/"
    });
    res.redirect("http://localhost:3000/login");
    return res.status(200).json({
      message: "Login with Google successful",
      token,
    });
  } catch (error) {
    console.error("Error in Google OAuth callback:", error);
    return res.status(500).json({
      message: "Internal Server Error during Google OAuth",
      error: error.message,
    });
  }
};


//@param { newPassword }
//@result { message}
const updatePassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user?.user_id; // lấy từ JWT middleware

  if (!newPassword) {
    res.status(400);
    throw new Error("New password is required");
  }

  // Lấy user từ DB
  const user = await User.findByPk(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Nếu user đã có password thì không cho đổi kiểu này (chỉ cho OAuth user)
  if (user.password) {
    res.status(400);
    throw new Error("This account already has a password.");
  }

  // Mã hoá và lưu lại password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    message: "Password has been successfully set.",
  });
});


//@param null
//@result { usersWithLastChat}
const getAllUsersForChatting = async (req, res) => {
  try {
    // 1. Lấy tất cả user từ MySQL
    const users = await User.findAll({
      // nếu chỉ muốn user thường:
      // where: { role: "user" },
      raw: true, // trả về plain object thay vì instance
    });

    if (!users.length) {
      return res.status(200).json([]);
    }

    const userIds = users.map((u) => u.user_id); // chú ý field đúng với DB của bạn

    // 2. Lấy các conversation tương ứng bên Mongo
    const convs = await SupportConversation.find({
      user: { $in: userIds }, // field "user" bên schema Mongo đang dùng UUID string
    })
      .select("user updatedAt") // chỉ cần 2 field này
      .lean();

    // 3. Build map userId -> lastChatAt (lần cập nhật conv gần nhất)
    const lastChatMap = {};
    convs.forEach((c) => {
      const userId = c.user;
      const convUpdatedAt = c.updatedAt;

      if (!lastChatMap[userId]) {
        lastChatMap[userId] = convUpdatedAt;
      } else {
        // lấy thời gian mới nhất
        if (convUpdatedAt > lastChatMap[userId]) {
          lastChatMap[userId] = convUpdatedAt;
        }
      }
    });

    // 4. Gắn lastChatAt vào từng user
    const usersWithLastChat = users.map((u) => ({
      ...u,
      lastChatAt: lastChatMap[u.user_id] || null,
    }));

    // 5. Sort trong Node:
    // - user nào có lastChatAt != null sẽ đứng trên, sort DESC theo lastChatAt
    // - user chưa từng chat (lastChatAt = null) thì cho xuống cuối
    usersWithLastChat.sort((a, b) => {
      const aTime = a.lastChatAt ? new Date(a.lastChatAt).getTime() : 0;
      const bTime = b.lastChatAt ? new Date(b.lastChatAt).getTime() : 0;

      if (aTime === bTime) {
        // nếu 2 thằng chưa chat giống nhau -> fallback theo updatedAt của user
        const aUserUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const bUserUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return bUserUpdated - aUserUpdated;
      }

      return bTime - aTime; // DESC
    });

    return res.status(200).json(usersWithLastChat);
  } catch (error) {
    console.error("getAllUsersForChatting error:", error);
    return res
      .status(500)
      .json({ message: "Không lấy được danh sách user cho chat" });
  }
};



module.exports = {
  register,
  login,
  current,
  logout,
  refresh,
  googleAuthCallback,
  updatePassword,
  updateProfile,
  uploadAvatar,
  getAllUsersForChatting,
};
