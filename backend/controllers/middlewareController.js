const jwt = require("jsonwebtoken");

const middlewareController = {
  //verifyToken
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"] || req.headers["Authorization"];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "You're not authenticated" });
      }

      const token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          console.error("JWT Verification Error:", err.message);

          if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired. Please log in again." });
          }

          return res.status(403).json({ message: "Token is invalid" });
        }

        req.user = {
          ...user,
          _id: user.id.toString()
        }; // Attach user data to request
        next();
      });
    } catch (error) {
      console.error("Token processing error:", error);
      res.status(500).json({ message: "Internal server error" });
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

  verifyTokenAndOrganizerAuth: async (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.role && req.user.role.includes("organizer")) {
        next();
      } else {
        res.status(403).json({ error: "Access denied. Only organizers can perform this action." });
      }
    });
  },
  verifyTokenWithCustomRoles: (requiredRoles) => (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.role && requiredRoles.some((role) => req.user.role.includes(role))) {
        next();
      } else {
        res.status(403).json({ error: "Access denied. You do not have the required roles." });
      }
    })
  },
};

module.exports = middlewareController;
