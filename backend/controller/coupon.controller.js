const couponSchema = require("../schema/coupon.schema");

// GET ALL ACTIVE COUPONS

const getCoupon = async (req, res) => {
  try {
    const coupon = await couponSchema.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.log(error);
  }
};

// CHECK COUPON

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await couponSchema.findOne({
      code,
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.json({ message: "coupon expired" });
    }

    res.json({
      message: "coupon is valid",
      code: coupon.code,
      discounPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCoupon,
  validateCoupon,
};
