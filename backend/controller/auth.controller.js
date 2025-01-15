const authSchema = require("../schema/auth.schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../libraries/redis");
require("dotenv").config();
// CREATING TOKENS

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_KEY, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_KEY, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 * 1000
  );
};

// COOKIE FUNCTIONS

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_SECURE === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_SECURE === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// REGISTER

const register = async (req, res, next) => {
  try {
    const { password, email, username } = req.body;

    const foundedUser = await authSchema.findOne({ email });
    if (foundedUser) {
      return res.json({
        message: "This user already exist",
      });
    }
    const hash = await bcrypt.hash(password, 12);

    const user = await authSchema.create({ email, username, password: hash });

    // Authenticate

    const { refreshToken, accessToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.json({ user: user, message: "Successfully registered" });
  } catch (error) {
    console.log(error);
    res.json({ message: "internal server error" });
  }
};

// LOGOUT

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const deleted = await redis.del(`refresh_token:${decoded.userId}`);

    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_SECURE === "production",
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_SECURE === "production",
      sameSite: "strict",
    });

    res.json({ message: "Successfully logged out" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// LOGIN

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundedUser = await authSchema.findOne({ email });

    if (!foundedUser) {
      return res.json({
        message: "This user not found",
      });
    }

    const checkerPassword = await bcrypt.compare(
      password,
      foundedUser.password
    );
    console.log(checkerPassword);

    if (!checkerPassword) {
      return res.json({
        message: "Your password is wrong",
      });
    }

    const { accessToken, refreshToken } = generateTokens(foundedUser._id);

    await storeRefreshToken(foundedUser._id, refreshToken);
    setCookies(res, accessToken, refreshToken);

    res.json({ user: foundedUser, message: "Successfully logged in" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

// CREATING TOKENS AGAIN

const refresh_token = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.json({ message: "this refresh token not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);

    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (refreshToken !== storedToken) {
      return res.json({ message: "Invalid token" });
    }

    const accessToken = await jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_KEY,
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_SECURE === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      message: "Successfully refreshed access token",
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

// GET PROFILE

const profile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

// EXPORT

module.exports = {
  register,
  logout,
  login,
  refresh_token,
  profile,
};
