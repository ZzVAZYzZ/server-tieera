// models/favoriteProduct.js
const mongoose = require('mongoose');

const favoriteProductSchema = new mongoose.Schema(
  {
    // user từ MySQL
    user_id: {
      type: String, // UUID bên MySQL => lưu String
      required: true,
      index: true,
    },

    // product từ MySQL
    product_id: {
      type: String, // UUID
      required: true,
    },

    // ====== snapshot thông tin product tại thời điểm tim ======
    name: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
      required: true,
    },
    stone_type: {
      type: String,
      required: false,
    },
    stone_shape: {
      type: String,
      required: false,
    },
    weight: {
      type: Number, // DECIMAL(10,0) -> Number
      required: false,
    },
    category_id: {
      type: String, // UUID category
      required: true,
    },
    price: {
      type: Number, // DECIMAL -> Number
      required: true,
    },
    discount_price: {
      type: Number,
    },
    stock_quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
      required: true,
    },

    // (optional) thêm thumbnail / image nếu bạn có
    thumbnail: {
      type: String,
    },
  },
  {
    collection: 'user_favorites',
    timestamps: true, // tự tạo createdAt, updatedAt
  }
);

// 1 user chỉ được tim 1 lần 1 product
favoriteProductSchema.index(
  { user_id: 1, product_id: 1 },
  { unique: true }
);

const FavoriteProduct = mongoose.model('FavoriteProduct', favoriteProductSchema);

module.exports = FavoriteProduct;
