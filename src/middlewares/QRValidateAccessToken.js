const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const util = require("util");
const User = require("../models/users"); // Sequelize model
// const UsedQR = require("../models/usedQR"); // Mongoose model (nếu dùng)

const verifyJwt = util.promisify(jwt.verify);

// ⏱️ Giới hạn thời gian hiệu lực QR (15 phút)

const QR_VALID_DURATION_MS = 15 * 60 * 1000; // 15 phút = 900,000 ms

//@param (req, res, next)
//@result next()
const QRValidateAccessToken = asyncHandler(async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      res.status(400);
      throw new Error("QR token not found");
    }

    // 1️⃣ Giải mã token (chưa cần xác thực thời gian hết hạn của JWT)
    const decoded = await verifyJwt(token, process.env.JWT_SECRET_KEY);

    // Kiểm tra payload hợp lệ
    if (!decoded?.user?.email) {
      res.status(401);
      throw new Error("Invalid QR token payload");
    }

    // 2️⃣ Kiểm tra thời gian tạo token (iat) để giới hạn 15 phút
    const now = Date.now(); // milliseconds
    const issuedAtMs = decoded.iat * 1000; // iat (issued at) từ JWT (đơn vị: giây)
    const age = now - issuedAtMs;

    if (age > QR_VALID_DURATION_MS) {
      res.status(403);
      throw new Error("QR code has expired (over 15 minutes)");
    }

    // 3️⃣ Tìm user bằng Sequelize
    const user = await User.findOne({ where: { email: decoded.user.email } });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // 4️⃣ (Tuỳ chọn) Kiểm tra token đã dùng chưa
    // const existed = await UsedQR.findOne({ token });
    // if (existed) {
    //   res.status(403);
    //   throw new Error("This QR code has already been scanned and used.");
    // }

    // 5️⃣ (Tuỳ chọn) Lưu token vào MongoDB để chống quét lại
    // await UsedQR.create({
    //   token,
    //   used_at: new Date(),
    //   user_id: user.user_id,
    // });

    // 6️⃣ Gán user vào req
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ QR validation error:", error.message);
    res.status(401).json({ message: error.message });
  }
});

module.exports = { QRValidateAccessToken };
