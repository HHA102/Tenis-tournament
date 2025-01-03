const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      // create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
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
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30s" }
    );
  },
  //GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      if (!req?.body?.username || !req?.body?.password)
        return res.status(400).json("Bad request");
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json("Wrong username!");
      }
      const valiPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!valiPassword) {
        res.status(404).json("Wrong password!");
      }
      if (user && valiPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        // res.cookie("refreshToken", refreshToken, {
        //   httpOnly: true,
        //   secure: false,
        //   path: "/",
        //   sameSite: "strict",
        // });
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken, refreshToken });
      }
    } catch (err) {
      console.log(err);

      res.status(500).json(err);
    }
  },

  requestRefreshToken: async (req, res) => {
    //Take the refresh token from user
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) return res.status(401).json("You're not authentication");
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      //Create new access token, refresh token
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      // res.cookie("refreshToken", newRefreshToken, {
      //   httpOnly: true,
      //   secure: false,
      //   path: "/",
      //   sameSite: "strict",
      // });
      res
        .status(200)
        .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  },

  //LOGOUT
  userLogout: async (req, res) => {
    // res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Logged out!");
  },
};

module.exports = authController;
