const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Refresh = require("../models/refresh");

//@param (req, res, next)
//@result next()
const validateRefreshToken = asyncHandler(async (req, res, next) => {
  // lấy refreshToken trong cookie
  const cookie = req.cookies.refreshToken;
  let checkRefreshToken = false;
  // lấy địa chỉ ipAddress của người dùng 
  const ipAddress =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let decodedData;
  try {
    // xác thực refreshToken
    decodedData = jwt.verify(cookie, process.env.REFRESH_SECRET_KEY);
  } catch (err) {
    // nếu xác thực không thành công sẽ phản hôi lỗi
    res.status(401);
    throw new Error("User is not authorized - invalid token");
  }
  // lấy ra email từ thông tin sau khi xác thực
  const email = decodedData.user.email;
  // kiểm tra trong white list lấy hết tất cả các token của email đó 
  const allRefreshTokens = await Refresh.find({ email });
  // kiểm tra trong các token đó, nếu token nào giống token đang sử dụng kèm theo địa chỉ IP đang sử dụng trang 
  allRefreshTokens.forEach((refreshItem) => {
    if (
      refreshItem.token === cookie &&
      refreshItem.deviceInfo.ipAddress === ipAddress
    ) {
      checkRefreshToken = true;
    }
  });
  // nếu kiểm tra giống thì cho phép người dùng đi vào controller
  if (checkRefreshToken) {
    req.user = decodedData.user;
    next();
  } else {
    // nếu kiểm tra không giống sẽ phản hồi lỗi 
    res.status(401);
    throw new Error("User is not authorized");
  }
});

module.exports = { validateRefreshToken };
