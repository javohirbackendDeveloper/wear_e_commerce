const { Router } = require("express");
const { protectRoute, adminRoute } = require("../middleware/auth.middleware");
const {
  getCoupon,
  validateCoupon,
} = require("../controller/coupon.controller");

const couponRouter = Router();

couponRouter.get("/", protectRoute, getCoupon);
couponRouter.post("/validate", protectRoute, validateCoupon);

module.exports = couponRouter;
