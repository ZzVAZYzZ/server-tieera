const express = require("express");
const { validateAccessToken } = require("../../middlewares/validateAccessToken");
const router = express.Router();
const {auth} = require('../../middlewares/auth');
const {checkCanReview, createReview, getReviewsByProduct} = require('../../controllers/review.controller');

router.route('/review/check/:productId').get(validateAccessToken,auth(['user']),checkCanReview);
router.route('/review').post(validateAccessToken,auth(['user']),createReview);
// router.route('/review/:productId').get(validateAccessToken,auth(['admin']),getReviewsByProduct);
router.route('/review/:productId').get(getReviewsByProduct);

module.exports = router