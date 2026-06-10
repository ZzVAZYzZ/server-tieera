const asyncHandler = require("express-async-handler");
const User = require("../models/users"); // Sequelize (MySQL)
const Product = require("../models/products");
const Favorite = require("../models/favorites");

// Lấy user_id từ req (tùy bạn đang dùng gì trong middleware)
const getUserIdFromRequest = (req) => {
  // nếu bạn set req.user = { user_id: '...' }
  if (req.user && req.user.user_id) return req.user.user_id;

  // nếu bạn set req.user = { id: '...' }
  if (req.user && req.user.id) return req.user.id;

  // fallback nếu bạn gửi user_id trong body
  if (req.body && req.body.user_id) return req.body.user_id;

  return null;
};

// POST /favorites
//@param {product_id}
//@result { message, favorite }
const favoriteProduct = asyncHandler(async (req, res) => {
  const user_id = getUserIdFromRequest(req);
  
  
  const { product_id } = req.body;

  if (!user_id || !product_id) {
    res.status(400);
    throw new Error("user_id and product_id are needed");
  }

  // kiểm tra user có tồn tại ở MySQL không (optional nhưng nên có)
  const user = await User.findByPk(user_id);
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  // lấy product từ MySQL
  const product = await Product.findByPk(product_id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // kiểm tra đã tim chưa
  const existed = await Favorite.findOne({ user_id, product_id });
  if (existed) {
    return res.status(200).json({
      message: "Already Favorite",
      favorite: existed,
    });
  }

  console.log(user_id);
  console.log(product_id);
  try {
    const favorite = await Favorite.create({
      user_id,
      product_id: product.product_id,

      name: product.name,
      material: product.material,
      description: product.description,
      color: product.color,
      stone_type: product.stone_type,
      stone_shape: product.stone_shape,
      weight: Number(product.weight),
      category_id: product.category_id,
      price: Number(product.price),
      discount_price: product.discount_price
        ? Number(product.discount_price)
        : null,
      stock_quantity: product.stock_quantity,
      status: product.status,
    });

    console.log("Favorite created >>>", favorite);

    return res.status(201).json({
      message: "added to favorite",
      favorite,
    });
  } catch (err) {
    console.error("Error when creating favorite >>>", err);

    return res.status(500).json({
      message: "cannot create favorite",
      error: err.message,
    });
  }
});

// DELETE /favorites/:product_id
//@param {product_id}
//@result { message }
const unFavoriteProduct = asyncHandler(async (req, res) => {
  const user_id = getUserIdFromRequest(req);
  const { product_id } = req.body; // hoặc req.body.product_id tùy bạn thiết kế

  if (!user_id || !product_id) {
    return res.status(400).json({
      message: "user_id and product_id are needed",
    });
  }

  const result = await Favorite.deleteOne({ user_id, product_id });

  if (result.deletedCount === 0) {
    return res.status(404).json({
      message: "Favorite not found!",
    });
  }

  return res.status(200).json({
    message: "unfavorite successfully!",
  });
});

// GET /favorites (lấy tất cả favorite của user)
//@param null
//@result { message, count, favorites }
const getUserFavorites = asyncHandler(async (req, res) => {
  const user_id = getUserIdFromRequest(req);

  if (!user_id) {
    return res.status(400).json({
      message: "user_id is needed",
    });
  }

  const favorites = await Favorite.find({ user_id }).sort({ createdAt: -1 });

  return res.status(200).json({
    message: "Your Favorite List!",
    count: favorites.length,
    favorites,
  });
});

module.exports = {
  favoriteProduct,
  unFavoriteProduct,
  getUserFavorites,
};
