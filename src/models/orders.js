const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderDetailSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    order_date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["created", "paid", "shipping", "completed", "cancelled"],
      default: "created",
    },
    payment_method: {
      type: String,
      enum: ["COD", "QRCode", "CreditCard"],
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping_address: {
      type: String,
      required: true,
    },
    orderDetails: {
      type: [orderDetailSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    isPaid: {
      type: Boolean,
      default: false
    }
  },
  {
    // _id: false,
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
);

// orderSchema.virtual("order_id").get(function () {
//   return this.order_id;
// });

module.exports = mongoose.model("Order", orderSchema);
