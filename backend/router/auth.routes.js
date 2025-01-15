const { Router } = require("express");
const {
  register,
  logout,
  login,
  refresh_token,
  profile,
} = require("../controller/auth.controller");
const { protectRoute } = require("../middleware/auth.middleware");

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/logout", logout);
authRouter.post("/login", login);
authRouter.post("/refresh_token", refresh_token);
authRouter.get("/profile", protectRoute, profile);

module.exports = authRouter;
