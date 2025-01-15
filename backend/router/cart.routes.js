const { Router } = require("express");
const { protectRoute, adminRoute } = require("../middleware/auth.middleware");
const {
  addToCart,
  deleteToCart,
  updateQuantity,
  getCartProducts,
} = require("../controller/cart.controller");

const cartRouter = Router();

cartRouter.get("/", protectRoute, getCartProducts);
cartRouter.post("/", protectRoute, addToCart);
cartRouter.delete("/", protectRoute, deleteToCart);
cartRouter.put("/:id", protectRoute, updateQuantity);
module.exports = cartRouter;
