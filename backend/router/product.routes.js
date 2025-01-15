const { Router } = require("express");
const {
  getAllProducts,
  featuredProducts,
  createProduct,
  deleteProduct,
  getRecommendetProducts,
  getProductByCategory,
  toggleFeaturedProduct,
} = require("../controller/product.controller");
const { protectRoute, adminRoute } = require("../middleware/auth.middleware");

const productRouter = Router();

productRouter.get("/", getAllProducts);
productRouter.get("/featured", featuredProducts);
productRouter.get("/category/:category", getProductByCategory);
productRouter.get("/recommendations", getRecommendetProducts);
productRouter.post("/", protectRoute, adminRoute, createProduct);
productRouter.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
productRouter.delete("/:id", protectRoute, adminRoute, deleteProduct);

module.exports = productRouter;
