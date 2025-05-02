const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");
const express = require("express");

const router = express.Router();

//GET ALL USERS
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

//GET USER DETAIL BY TOKEN
router.get(
  "/me",
  middlewareController.verifyToken,
  userController.getUserByToken
);

//GET USER BY ID
router.get(
  "/:id",
  middlewareController.verifyToken,
  userController.getUserById
);

//DELETE USER
router.delete(
  "/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.deleteUser
);

//UPDATE USER INFO
router.put(
  "/update",
  middlewareController.verifyToken,
  userController.updatePersonalInfo
);

//UPDATE USER INFO BY ADMIN
router.put(
  "/admin-update/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.updateProfileByAdmin
);

//DEACTIVATE USER
router.put(
  "/deactivate/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.deactivateUser
);

//ACTIVATE USER
router.put(
  "/activate/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.activateUser
);

//UPDATE USER EMAIL
router.put(
  "/update/email",
  middlewareController.verifyToken,
  userController.updateEmail
);

//UPDATE USER PHONE
router.put(
  "/update/phone",
  middlewareController.verifyToken,
  userController.updatePhone
);

//UPDATE USER FCM TOKEN
router.put(
  "/update/fcmToken",
  middlewareController.verifyToken,
  userController.updateFCMToken
);

//UPDATE USER PROFILE PICTURE
router.put(
  "/update/profilePicture",
  middlewareController.verifyToken,
  userController.updateProfilePicture
);

//UPDATE USER PROFILE PICTURE BY ADMIN
router.put(
  "/admin-update/profilePicture/:id",
  middlewareController.verifyTokenAndAdminAuth,
  userController.updateProfilePictureByAdmin
);

router.get(
  "/role/:role",
  middlewareController.verifyToken,
  userController.getAllUserByRole
);

module.exports = router;
