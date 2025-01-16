const express = require("express");
const cors = require("cors");
const connect_DB = require("./libraries/config");
const authRouter = require("./router/auth.routes");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const productRouter = require("./router/product.routes");
const cartRouter = require("./router/cart.routes");
const couponRouter = require("./router/coupon.routes");
const paymentRouter = require("./router/payment.routes");
const analyticRouter = require("./router/analytic.routes");
const PORT = process.env.PORT || 4001;
const app = express();
const path = require("path");
// ////////
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use(cookieParser());

const __dirname = path.resolve();
// Routers
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/analytics", analyticRouter);

if (process.env.NODE_SECURE === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// mongodb
connect_DB();
app.listen(PORT, () => {
  console.log("Server is running on the " + PORT);
});
