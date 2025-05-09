const authController = require('../controllers/authControllers');
const middlewareController = require('../controllers/middlewareController');

const router = require('express').Router();

//REGISTER
router.post("/register", authController.registerUser);

//LOGIN
router.post("/login", authController.loginUser);

//REFRESH
router.post("/refresh", authController.requestRefreshToken);

//LOGOUT
router.post("/logout", authController.userLogout);

//UPDATE PASSWORD
router.put("/update-password", middlewareController.verifyToken, authController.updatePassword);

module.exports = router;