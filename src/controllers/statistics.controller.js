const Order = require("../models/orders");
const moment = require("moment");


const TZ = "Asia/Ho_Chi_Minh";

//@param { mode, dateString }
//@result { message, data }
const getRevenueStatistics = async (req, res) => {
  const { mode, dateString } = req.query;

  if (!mode || !dateString) {
    return res
      .status(400)
      .json({ message: "Missing required parameters: mode or dateString" });
  }

  const unitMap = {
    daily: "day",
    monthly: "month",
    yearly: "year",
  };

  const formatMap = {
    daily: "YYYY-MM-DD", // ví dụ: 2025-11-26
    monthly: "YYYY-MM", // ví dụ: 2025-11
    yearly: "YYYY", // ví dụ: 2025
  };

  const unit = unitMap[mode];
  const format = formatMap[mode];

  if (!unit || !format) {
    return res
      .status(400)
      .json({ message: "Invalid mode, must be daily | monthly | yearly" });
  }

  const m = moment(dateString, format, true);
  if (!m.isValid()) {
    return res
      .status(400)
      .json({ message: `Invalid dateString for mode ${mode}` });
  }

  const startOfPeriod = m.clone().startOf(unit);
  const endOfPeriod = m.clone().endOf(unit);

  console.log("startOfPeriod:", startOfPeriod.toISOString());
  console.log("endOfPeriod:", endOfPeriod.toISOString());

  

  try {
    let revenueData = [];

    const baseQuery = [
      {
        $match: {
          status: "paid",
          order_date: {
            $gte: startOfPeriod.toDate(),
            $lte: endOfPeriod.toDate(),
          },
        },
      },
      {
        $project: {
          order_date: 1,
          total_amount: 1,
        },
      },
    ];

    // DAILY: tách theo TỪNG GIỜ trong ngày
    if (mode === "daily") {
      const dailyData = await Order.aggregate([
        ...baseQuery,
        {
          $group: {
            _id: {
              year: { $year: { date: "$order_date", timezone: TZ } },
              month: { $month: { date: "$order_date", timezone: TZ } },
              day: { $dayOfMonth: { date: "$order_date", timezone: TZ } },
              hour: { $hour: { date: "$order_date", timezone: TZ } },
            },
            totalAmount: { $sum: "$total_amount" },
            orderCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            hour: "$_id.hour",
            totalAmount: 1,
            orderCount: 1,
          },
        },
        { $sort: { year: 1, month: 1, day: 1, hour: 1 } },
      ]);

      revenueData = dailyData;
    }

    // MONTHLY: tách theo TỪNG NGÀY trong tháng (cái này gần giống code cũ của bạn)
    if (mode === "monthly") {
      const monthlyData = await Order.aggregate([
        ...baseQuery,
        {
          $group: {
            _id: {
              year: { $year: { date: "$order_date", timezone: TZ } },
              month: { $month: { date: "$order_date", timezone: TZ } },
              day: { $dayOfMonth: { date: "$order_date", timezone: TZ } },
            },
            totalAmount: { $sum: "$total_amount" },
            orderCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            totalAmount: 1,
            orderCount: 1,
          },
        },
        { $sort: { year: 1, month: 1, day: 1 } },
      ]);

      revenueData = monthlyData;
    }

    // YEARLY: tách theo TỪNG THÁNG trong năm
    if (mode === "yearly") {
      const yearlyData = await Order.aggregate([
        ...baseQuery,
        {
          $group: {
            _id: {
              year: { $year: { date: "$order_date", timezone: TZ } },
              month: { $month: { date: "$order_date", timezone: TZ } },
            },
            totalAmount: { $sum: "$total_amount" },
            orderCount: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            totalAmount: 1,
            orderCount: 1,
          },
        },
        { $sort: { year: 1, month: 1 } },
      ]);

      revenueData = yearlyData;
    }

    return res.status(200).json({
      message: `Revenue statistics for ${mode} mode on ${dateString}`,
      data: revenueData,
    });
  } catch (error) {
    console.error("Error fetching revenue statistics:", error);
    return res
      .status(500)
      .json({ message: "Server error, could not fetch revenue statistics." });
  }
};

// mode: daily | monthly | yearly
// dateString:
//   - daily:   "YYYY-MM-DD" (vd: "2025-11-27")
//   - monthly: "YYYY-MM"    (vd: "2025-11")
//   - yearly:  "YYYY"       (vd: "2025")
//@param { mode, dateString }
//@result { message, data }
const getUnitSoldStatistics = async (req, res) => {
  const { mode, dateString } = req.query;

  if (!mode || !dateString) {
    return res
      .status(400)
      .json({ message: "Missing required parameters: mode or dateString" });
  }

  const unitMap = {
    daily: "day",
    monthly: "month",
    yearly: "year",
  };

  const formatMap = {
    daily: "YYYY-MM-DD",
    monthly: "YYYY-MM",
    yearly: "YYYY",
  };

  const unit = unitMap[mode];
  const format = formatMap[mode];

  if (!unit || !format) {
    return res
      .status(400)
      .json({ message: "Invalid mode, must be daily | monthly | yearly" });
  }

  const m = moment(dateString, format, true);
  if (!m.isValid()) {
    return res
      .status(400)
      .json({ message: `Invalid dateString for mode ${mode}` });
  }

  const startOfPeriod = m.clone().startOf(unit);
  const endOfPeriod = m.clone().endOf(unit);

  console.log("Unit sold startOfPeriod:", startOfPeriod.toISOString());
  console.log("Unit sold endOfPeriod:", endOfPeriod.toISOString());

  try {
    let unitSoldData = [];

    // 1. Lọc order isPaid = true + theo khoảng thời gian
    // 2. Unwind orderDetails để lấy từng dòng sản phẩm trong mỗi đơn
    const baseQuery = [
      {
        $match: {
          isPaid: true,
          order_date: {
            $gte: startOfPeriod.toDate(),
            $lte: endOfPeriod.toDate(),
          },
        },
      },
      {
        $unwind: "$orderDetails",
      },
      {
        $project: {
          order_date: 1,
          productId: "$orderDetails.product_id",
          productName: "$orderDetails.product_name",
          quantity: "$orderDetails.quantity",
        },
      },
    ];

    // ===== DAILY: thống kê theo từng GIỜ trong ngày, mỗi sản phẩm 1 record =====
    // output:
    // { year, month (0-based), day, hour, productId, productName, quantity }
    if (mode === "daily") {
      const dailyData = await Order.aggregate([
        ...baseQuery,
        {
          $group: {
            _id: {
              year:  { $year:       { date: "$order_date", timezone: TZ } },
              month: { $month:      { date: "$order_date", timezone: TZ } },
              day:   { $dayOfMonth: { date: "$order_date", timezone: TZ } },
              hour:  { $hour:       { date: "$order_date", timezone: TZ } },
              productId: "$productId",
              productName: "$productName",
            },
            quantity: { $sum: "$quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            // 0-based month như UNIT_SOLD_DATA
            month: { $subtract: ["$_id.month", 1] },
            day: "$_id.day",
            hour: "$_id.hour",
            productId: "$_id.productId",
            productName: "$_id.productName",
            quantity: 1,
          },
        },
        {
          $sort: {
            year: 1,
            month: 1,
            day: 1,
            hour: 1,
            productName: 1,
          },
        },
      ]);

      unitSoldData = dailyData;
    }

    // ===== MONTHLY: thống kê theo từng NGÀY trong tháng, mỗi sản phẩm 1 record =====
    // format giống UNIT_SOLD_DATA bạn đưa:
    // { year, month (0-based), day, productId, productName, quantity }
    if (mode === "monthly") {
      const monthlyData = await Order.aggregate([
        ...baseQuery,
        {
          $group: {
            _id: {
              year:  { $year:       { date: "$order_date", timezone: TZ } },
              month: { $month:      { date: "$order_date", timezone: TZ } },
              day:   { $dayOfMonth: { date: "$order_date", timezone: TZ } },
              productId: "$productId",
              productName: "$productName",
            },
            quantity: { $sum: "$quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: { $subtract: ["$_id.month", 1] }, // 0-based
            day: "$_id.day",
            productId: "$_id.productId",
            productName: "$_id.productName",
            quantity: 1,
          },
        },
        {
          $sort: {
            year: 1,
            month: 1,
            day: 1,
            productName: 1,
          },
        },
      ]);

      unitSoldData = monthlyData;
    }

    // ===== YEARLY: thống kê theo từng THÁNG trong năm, mỗi sản phẩm 1 record =====
    // { year, month (0-based), productId, productName, quantity }
    if (mode === "yearly") {
      const yearlyData = await Order.aggregate([
        ...baseQuery,
        {
          $group: {
            _id: {
              year:  { $year:  { date: "$order_date", timezone: TZ } },
              month: { $month: { date: "$order_date", timezone: TZ } },
              productId: "$productId",
              productName: "$productName",
            },
            quantity: { $sum: "$quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: { $subtract: ["$_id.month", 1] }, // 0-based
            productId: "$_id.productId",
            productName: "$_id.productName",
            quantity: 1,
          },
        },
        {
          $sort: {
            year: 1,
            month: 1,
            productName: 1,
          },
        },
      ]);

      unitSoldData = yearlyData;
    }

    return res.status(200).json({
      message: `Unit sold statistics for ${mode} mode on ${dateString}`,
      data: unitSoldData,
    });
  } catch (error) {
    console.error("Error fetching unit sold statistics:", error);
    return res.status(500).json({
      message: "Server error, could not fetch unit sold statistics.",
    });
  }
};


module.exports = { getRevenueStatistics, getUnitSoldStatistics };
