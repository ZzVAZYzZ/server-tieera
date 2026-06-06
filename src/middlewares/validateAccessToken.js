const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const util = require("util");

const verifyJwt = util.promisify(jwt.verify);

//@param (req, res, next)
//@result next()
const validateAccessToken = asyncHandler(async (req, res, next) => {
  try {
    // lấy header từ request 
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(400);
      throw new Error("Access Token not found");
    }
    // lấy token từ trong header
    let token = authHeader.split(" ")[1];
    // nếu không có token thì trả về lỗi
    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing!");
    }
    // kiểm tra token coi có hiệu lực không
    const decoded = await verifyJwt(token, process.env.JWT_SECRET_KEY);
    // lấy ra userId và email
    const userId = decoded.user.id;
    const email = decoded.user.email;
    // tìm kiếm user dựa trên userId hoặc email
    const user =
      (await User.findByPk(userId)) ||
      (email ? await User.findOne({ where: { email } }) : null);
    // nếu không tìm thấy user thì phản hồi lỗi
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    // đưa thông tin user vào req để có thể sử dụng trong controller
    req.user = user.get();
    // đi tiếp
    next();
  } catch (error) {
    // phản hồi lỗi nếu try lỗi 
    res.status(401);
    next(error); 
  }
});

module.exports = { validateAccessToken };
