const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      // create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        role: req.body.role ?? "user",
      });
      //save to database
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    if (!process.env.JWT_ACCESS_KEY) {
      throw new Error("JWT keys are missing in environment variables");
    }
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30m" }
    );
  },
  //GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    if (!process.env.JWT_REFRESH_KEY) {
      throw new Error("JWT keys are missing in environment variables");
    }
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "30d" }
    );
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      if (!req?.body?.username || !req?.body?.password) {
        return res.status(400).json("Bad request");
      }

      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("Wrong username!");
      }

      const valiPassword = await bcrypt.compare(req.body.password, user.password);
      if (!valiPassword) {
        return res.status(404).json("Wrong password!");
      }

      const accessToken = authController.generateAccessToken(user);
      const refreshToken = authController.generateRefreshToken(user);

      user.refreshTokens = user.refreshTokens.filter(token => token.expiresAt > new Date());

      user.refreshTokens.push({ token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
      await user.save();

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "lax",
      });

      const userData = user.toObject();
      delete userData?.password;
      delete userData?.refreshTokens
      res.status(200).json({ ...userData, accessToken });

    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json(err);
    }
  },

  requestRefreshToken: async (req, res) => {
    try {
      // Get refresh token from cookies
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: "You are not authenticated." });
      }

      const user = await User.findOne({ "refreshTokens.token": refreshToken });
      if (!user) {
        return res.status(403).json({ message: "Refresh token is not valid." });
      }

      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired refresh token." });
        }
        user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);

        // Generate new access and refresh tokens
        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);

        // Add new refresh token
        user.refreshTokens.push({ token: newRefreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
        await user.save();

        // Set new refresh token in cookies
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "lax",
        });

        res.status(200).json({ accessToken: newAccessToken });
      });

    } catch (error) {
      console.error("Refresh Token Error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  },

  //LOGOUT
  userLogout: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(400).json({ message: "No refresh token provided." });

      const user = await User.findOne({ "refreshTokens.token": refreshToken });
      if (!user) {
        return res.status(403).json({ message: "Invalid refresh token." });
      }

      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
      await user.save();

      // Clear refresh token cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "lax",
      });

      res.status(200).json({ message: "Logged out successfully!" });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
}

module.exports = authController;
