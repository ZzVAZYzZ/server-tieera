const express = require("express");
const router = express.Router();
const { createPaymentIntent, paymentResult, QRScan } = require("../../controllers/payments.controller");
const { validateAccessToken } = require("../../middlewares/validateAccesstoken");
const { QRValidateAccessToken } = require('../../middlewares/QRValidateAccessToken');
router.route('/create-payment-intent').post(validateAccessToken, createPaymentIntent);

router.route("/payment-result").post(validateAccessToken, paymentResult);



router.route('/test-qr-scan').get(QRValidateAccessToken, QRScan);



module.exports = router;