const jwt = require("jsonwebtoken");

const middlewareController = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      console.log('accessToken', accessToken);
      
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          console.log({err});
          
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
      console.log('admin req', req);
      
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
    console.log('req', req);
    
    if (req.user.role && req.user.role.includes("organizer")) {
      console.log('asdasd');
      
      next();
    } else {
      res.status(403).json({ error: "Access denied. Only organizers can perform this action." });
    }
  });
}
};

module.exports = middlewareController;
