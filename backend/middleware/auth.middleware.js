const jwt = require("jsonwebtoken");
const authSchema = require("../schema/auth.schema");
const { idText } = require("typescript");

const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.json({ message: "Access token is required" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_KEY);
      const user = await authSchema
        .findById(decoded.userId)
        .select("-password");

      if (!user) {
        return res.json("User not found");
      }
      req.user = user;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.json("Your token is expired");
      } else {
        console.log("Internal server error");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const adminRoute = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    }

    return res.json({ message: "You are not an admin" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { protectRoute, adminRoute };
