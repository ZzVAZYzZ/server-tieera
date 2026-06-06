const express = require("express");
const router = express.Router();
const usersRoute = require('./usersRoute/usersRoute');
const productsRoute = require('./productsRoute/productsRoute');
const categoriresRoute = require('./categoriesRoute/categoriesRoute');
const ordersRoute = require('./ordersRoute/ordersRoute');
const paymentRoute = require('./paymentRoute/paymentRoute');
const reviewRoute = require('./reviewRoute/reviewRoute');
const statisticsRoute = require('./statisticsRoute/statisticsRoute');
const isBlockRoute = require("./isBlockRoute/isBlockRoute");
const favoritesRoute = require("./favoritesRoute/favoritesRoute");

router.use('/api',usersRoute);
router.use('/api',productsRoute);
router.use('/api',categoriresRoute);
router.use('/api',ordersRoute);
router.use('/api',paymentRoute);
router.use('/api',reviewRoute);
router.use('/api',statisticsRoute);
router.use("/api", isBlockRoute);
router.use("/api", favoritesRoute);

module.exports = router;