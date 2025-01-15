const { Router } = require("express");
const { protectRoute } = require("../middleware/auth.middleware");
const {
  checkoutSuccess,
  createCheckoutSession,
} = require("../controller/payment.controller");

const paymentRouter = Router();

paymentRouter.post(
  "/create-checkout-session",
  protectRoute,
  createCheckoutSession
);
paymentRouter.post("/checkout-success", protectRoute, checkoutSuccess);

module.exports = paymentRouter;
