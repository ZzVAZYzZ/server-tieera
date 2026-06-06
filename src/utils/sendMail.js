// utils/sendMail.js
const nodemailer = require("nodemailer");

//@param (to, orderId, amount, currency)
//@result mailOptions
const sendPaymentSuccessEmail = async (to, orderId, amount, currency) => {
  // ⚙️ Thiết lập transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // hoặc SMTP riêng nếu bạn có domain email
    auth: {
      user: process.env.EMAIL_USER, // ví dụ: 'yourshop@gmail.com'
      pass: process.env.EMAIL_PASS, // app password hoặc token
    },
  });

  // 💌 Nội dung email
  const mailOptions = {
    from: `"Doana shop" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Xác nhận thanh toán thành công",
    html: `
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f7fa; padding: 40px 0;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #4f46e5; color: white; padding: 24px 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">Cảm ơn bạn đã mua hàng tại Tieera!</h1>
      </div>
      
      <!-- Content -->
      <div style="padding: 32px; color: #333;">
        <p style="font-size: 16px;">Xin chào,</p>
        <p style="font-size: 16px; line-height: 1.6;">
          Đơn hàng của bạn đã được <strong>thanh toán thành công</strong>.  
          Cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm của chúng tôi 💜
        </p>

        <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0; font-size: 15px;"><strong>Mã đơn hàng:</strong> #${orderId}</p>
          <p style="margin: 4px 0 0 0; font-size: 15px;">
            <strong>Số tiền:</strong> ${(amount / 100).toFixed(
              2
            )} ${currency.toUpperCase()}
          </p>
          <p style="margin: 4px 0 0 0; font-size: 15px;">
            <strong>Trạng thái:</strong> Đã thanh toán ✅
          </p>
        </div>

        <p style="font-size: 15px; line-height: 1.6;">
          Bạn có thể <strong>theo dõi trạng thái đơn hàng</strong> tại trang web của chúng tôi thông qua tính năng “Theo dõi đơn hàng”.
        </p>

        <!-- Button -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="http://localhost:3000/home" 
             style="background-color: #4f46e5; color: white; text-decoration: none; 
                    padding: 12px 28px; border-radius: 8px; font-size: 16px; 
                    display: inline-block; font-weight: 500;">
            🏠 Quay lại Trang chủ
          </a>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;"/>

        <p style="font-size: 14px; color: #6b7280; text-align: center;">
          Cảm ơn bạn một lần nữa vì đã chọn Tieera 💜<br/>
          Mọi thắc mắc xin vui lòng liên hệ đội ngũ hỗ trợ tại 
          <a href="mailto:support@tieera.com" style="color: #4f46e5; text-decoration: none;">support@tieera.com</a>.
        </p>
      </div>
    </div>
  </div>
  `,
  };

  // 🚀 Gửi mail
  await transporter.sendMail(mailOptions);
};

module.exports = { sendPaymentSuccessEmail };
