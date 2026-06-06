const express = require("express");
const {
  createOrder,
  getOrdersByStatus,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
} = require("../../controllers/orders.controller");
const {
  validateAccessToken,
} = require("../../middlewares/validateAccesstoken");
const { auth } = require("../../middlewares/auth");
const router = express.Router();
// cho role user  
router
  .route("/orders/makeOrder")
  .post(validateAccessToken, auth(["user"]), createOrder);
// ủy quyền cho role admin
router
  .route("/orders/status/:status")
  .get(validateAccessToken, auth(["admin"]), getOrdersByStatus);
// cho role user  
router
  .route("/orders/user/:user_id")
  .get(validateAccessToken, auth(["user"]), getOrdersByUserId);
// cho role user  
router
  .route("/orders/:order_id")
  .get(validateAccessToken, auth(["user"]), getOrderById);
// ủy quyền cho role admin
router
  .route("/orders/:order_id")
  .patch(validateAccessToken, auth(["admin"]), updateOrderStatus);

module.exports = router;
