const authSchema = require("../schema/auth.schema");
const orderSchema = require("../schema/order.schema");
const productSchema = require("../schema/product.schema");

async function getAnalyticData() {
  const totalUsers = await authSchema.countDocuments();
  const totalProducts = await productSchema.countDocuments();
  const salesData = await orderSchema.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
}

const getDailySalesData = async (startDate, endDate) => {
  const dailySalesData = await orderSchema.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const dateArray = getDatesInRange(startDate, endDate);

  return dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date);

    return {
      date,
      sales: foundData?.sales || 0,
      revenue: foundData?.revenue || 0,
    };
  });
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

const analytics = async (req, res) => {
  try {
    const analyticData = await getAnalyticData();

    const startDate = new Date();
    const endDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.json({
      analyticData,
      dailySalesData,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAnalyticData,
  getDailySalesData,
};
