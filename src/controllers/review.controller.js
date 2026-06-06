const Order = require("../models/orders");
const Review = require("../models/review");
const asyncHandler = require('express-async-handler');

// ✅ Check if user can review
//@param { productId }
//@result { success, message }
const checkCanReview = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { productId } = req.params;

    // Check if user has a completed order containing this product
    const order = await Order.findOne({
      user_id: userId,
      status: "paid",
      "orderDetails.product_id": productId,
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You have not purchased this product, so you cannot review it.",
      });
    }

    // Check if already reviewed
    const reviewed = await Review.findOne({ user_id: userId, product_id: productId });
    if (reviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    return res.status(200).json({ success: true, message: "You can review this product." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Create a new review
//@param { product_id, rating, comment }
//@result { success, review }
const createReview = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.user_id;
    const userName = req.user.name;
    const { product_id, rating, comment } = req.body;

    // Check if user purchased the product
    const order = await Order.findOne({
      user_id: userId,
      status: "paid",
      "orderDetails.product_id": product_id,
    });
    

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You have not purchased this product, so you cannot review it.",
      });
    }

    const exist = await Review.findOne({ user_id: userId, product_id });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    const review = await Review.create({
      user_id: userId,
      user_name: userName,
      product_id,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Get all reviews for a product
//@param { productId }
//@result { success, total, reviews }
const getReviewsByProduct = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product_id: productId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: reviews.length,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = { checkCanReview, createReview, getReviewsByProduct };
