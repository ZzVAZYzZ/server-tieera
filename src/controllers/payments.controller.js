require("dotenv").config();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/payment");
const Order = require("../models/orders");
const asyncHandler = require("express-async-handler");
const { sendPaymentSuccessEmail } = require("../utils/sendMail");
const User = require("../models/users");

//@param { amount, name, email, addressLine1, city, order_id }
//@result { clientSecret }
const createPaymentIntent = asyncHandler(async (req, res) => {
  try {
    // NHẬN THÊM CÁC THÔNG TIN KHÁCH HÀNG TỪ FRONTEND
    const { amount, name, email, addressLine1, city, order_id } = req.body;

    if (!amount || !name || !email || !addressLine1 || !city || !order_id) {
      return res
        .status(400)
        .json({
          message:
            "Missing required customer details (amount, name, email, address, or city)",
        });
    }

    // Tạo Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "vnd",
      description: "Thanh toán sản phẩm demo",
      automatic_payment_methods: { enabled: true },

      // 💡 CẬP NHẬT: THÊM DỮ LIỆU TÙY CHỈNH VÀO METADATA
      metadata: {
        customer_name: name,
        customer_email: email,
        customer_address_line1: addressLine1,
        customer_city: city,
        // Bạn cũng có thể thêm ID đơn hàng ở đây nếu có
        order_id: order_id,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Lỗi tạo PaymentIntent:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Hàm này không cần thay đổi logic, nhưng chúng ta có thể in ra metadata
//@param { paymentIntent }
//@result { message, status, paymentId }
const paymentResult = asyncHandler(async (req, res) => {
  // Frontend chỉ gửi về một phần của paymentIntent (thường chỉ có id và status)
  const { paymentIntent } = req.body;

  if (!paymentIntent || !paymentIntent.id) {
    return res.status(400).json({ message: "Missing PaymentIntent ID" });
  }

  try {
    // 1. DÙNG STRIPE API ĐỂ LẤY THÔNG TIN CHI TIẾT CỦA PAYMENT INTENT
    const fullPaymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntent.id
    );

    // 2. TRUY CẬP METADATA ĐÃ ĐƯỢC LƯU TRONG HÀM createPaymentIntent
    const customerInfo = fullPaymentIntent.metadata;
    // console.log(fullPaymentIntent);

    console.log("💳 Payment completed:", fullPaymentIntent.id);
    console.log("   Trạng thái:", fullPaymentIntent.status);

    // KIỂM TRA ĐẢM BẢO THANH TOÁN THÀNH CÔNG TRƯỚC KHI XỬ LÝ
    if (fullPaymentIntent.status === "succeeded") {
      const newPayment = new Payment({
        payment_id: fullPaymentIntent.id,
        order_id: customerInfo.order_id,
        amount: fullPaymentIntent.amount,
        currency: fullPaymentIntent.currency,
        status: fullPaymentIntent.status,
        paymentType: "CreditCard", // hoặc "QRCode" tùy bạn set ở FE
        payment_method: fullPaymentIntent.payment_method,
        description: fullPaymentIntent.description,
        customer_name: customerInfo.customer_name,
        customer_email: customerInfo.customer_email,
        customer_address: `${customerInfo.customer_address_line1}, ${customerInfo.customer_city}`,
      });

      await newPayment.save();

      console.log("✅ Payment saved successfully to MongoDB");

      const updatedOrder = await Order.findOneAndUpdate(
        { order_id: customerInfo.order_id },
        {
          status: "paid",
          isPaid: true,
        },
        { new: true }
      );

      if (updatedOrder) {
        console.log(
          `✅ Order ${updatedOrder.order_id} updated to status: ${updatedOrder.status}`
        );

        // ✅ Gửi email xác nhận thanh toán
        // try {
        //   await sendPaymentSuccessEmail(
        //     customerInfo.customer_email,
        //     customerInfo.order_id,
        //     fullPaymentIntent.amount,
        //     fullPaymentIntent.currency
        //   );
        //   console.log(
        //     `📧 Email xác nhận đã gửi tới ${customerInfo.customer_email}`
        //   );
        // } catch (mailError) {
        //   console.error("⚠️ Lỗi khi gửi email:", mailError.message);
        // }
      }
    } else {
      console.log("⚠️ Thanh toán chưa thành công:", fullPaymentIntent.status);
    }

    res.status(200).send({
      message: "Server successfully processed payment result",
      status: fullPaymentIntent.status,
      paymentId: fullPaymentIntent.id,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lưu Payment:", error.message);
    res.status(500).json({ message: "Failed to process payment result." });
  }
});

//@param null
//@result { orderId }
const QRScan = asyncHandler(async (req, res) => {
  try {
    const orderData = req.query.data ? JSON.parse(req.query.data) : null;
    const io = req.app.get("io");

    // Validate dữ liệu
    if (!orderData || !orderData.order_id) {
      io.emit("paymentStatus", {
        success: false,
        error: "Thiếu order_id trong dữ liệu QR",
      });
      return res.status(400).render("missingOrderId");
    }

    console.log("📲 Order confirmed for:", orderData.order_id);
    console.log("📲 User confirmed for:", orderData.user_id);
    // Truy vấn order từ DB
    const user = await User.findOne({
      where: { user_id: orderData.user_id },
    });
    const userEmail = user?.email || "N/A";
    console.log(userEmail);

    // Tạo Payment
    const newPayment = new Payment({
      order_id: orderData.order_id,
      amount: orderData.total_amount,
      currency: "vnd",
      status: "succeeded",
      paymentType: "QRCode",
      payment_method: "QR",
      description: "Thanh toán bằng mã QR",
      customer_name: orderData.user_id?.name || "Khách hàng",
      customer_email: userEmail,
      customer_address: orderData.shipping_address,
    });

    // Thêm try-catch riêng cho save Payment
    let savedPayment;
    try {
      savedPayment = await newPayment.save();
      console.log(`✅ Payment saved for order ${orderData.order_id}`);
    } catch (paymentErr) {
      console.error("❌ Lỗi khi lưu Payment:", paymentErr.message);
      io.to(orderData.order_id).emit("paymentStatus", {
        success: false,
        orderId: orderData.order_id,
        error: "Payment lưu thất bại",
      });
      return res
        .status(500)
        .render("failed", { error: "Payment lưu thất bại" });
    }

    // Chỉ khi save Payment thành công mới update Order
    const updatedOrder = await Order.findOneAndUpdate(
      { order_id: orderData.order_id },
      {
        status: "paid",
        isPaid: true,
      },
      { new: true }
    );

    if (updatedOrder)
      console.log(`✅ Order ${updatedOrder.order_id} updated to "paid"`);

    // Chỉ khi có userEmail mới gửi mail
    // if (userEmail !== "N/A") {
    //   try {
    //     await sendPaymentSuccessEmail(
    //       userEmail,
    //       orderData.order_id,
    //       orderData.total_amount,
    //       "VND"
    //     );
    //   } catch (mailErr) {
    //     console.error("⚠️ Lỗi khi gửi mail:", mailErr.message);
    //   }
    // }

    // Emit socket và render view thành công
    io.to(orderData.order_id).emit("paymentStatus", {
      success: true,
      orderId: orderData.order_id,
    });
    res.status(200).render("success", { orderId: orderData.order_id });
  } catch (err) {
    console.error("❌ Error during QR scan:", err.message);
    const io = req.app.get("io");
    let orderData = null;
    try {
      orderData = req.query.data ? JSON.parse(req.query.data) : null;
    } catch {}
    if (orderData?.order_id) {
      io.to(orderData.order_id).emit("paymentStatus", {
        success: false,
        orderId: orderData.order_id,
        error: err.message,
      });
    } else {
      io.emit("paymentStatus", { success: false, error: err.message });
    }
    res.status(400).render("failed", { error: err.message });
  }
});

module.exports = { createPaymentIntent, paymentResult, QRScan };
