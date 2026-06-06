const express = require("express");
const { validateAccessToken } = require("../../middlewares/validateAccesstoken");
const router = express.Router();
const {auth} = require('../../middlewares/auth');
const { getRevenueStatistics, getUnitSoldStatistics } = require("../../controllers/statistics.controller");


// GET /api/statistics/revenue?mode=monthly&dateString=2025-11
router.route('/statistics/revenue').get(getRevenueStatistics);


// GET /api/statistics/unit-sold?mode=monthly&dateString=2025-11
// GET /api/statistics/unit-sold?mode=daily&dateString=2025-11-27
// GET /api/statistics/unit-sold?mode=yearly&dateString=2025
router.get("/statistics/unit-sold", getUnitSoldStatistics);

module.exports = router