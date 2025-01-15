const { Router } = require("express");
const { protectRoute, adminRoute } = require("../middleware/auth.middleware");
const {
  getAnalyticData,
  getDailySalesData,
} = require("../controller/analytic.controller");

const analyticRouter = Router();

analyticRouter.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = analyticRouter;
