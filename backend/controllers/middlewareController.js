const jwt = require("jsonwebtoken");

const middlewareController = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("Token is invalid");
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json("You're not authenticated");
    }
  },

  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        return res.status(403).json("You're not allowed to delete other");
      }
    });
  },

  verifyRoles: (req, res, next) => {
    const userRoles = req.user.roles;
    if (!requiredRoles.some((role) => userRoles.includes(role))) {
      return res.status(403).json({ message: "Access Denied" });
    }
    next();
  },
};

module.exports = middlewareController;
