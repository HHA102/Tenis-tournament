const middlewareController = require('../controllers/middlewareController');
const userController = require('../controllers/userController');
const upload = require('../config/multer');
const express = require('express');

const router = express.Router();

//GET ALL USERS
router.get('/', middlewareController.verifyToken, userController.getAllUsers);

//DELETE USER
router.delete('/:id', middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);

//UPDATE USER INFO
router.put('/update', middlewareController.verifyToken, userController.updatePersonalInfo);

//UPDATE USER EMAIL
router.put('/update/email', middlewareController.verifyToken, userController.updateEmail);

//UPDATE USER PHONE
router.put('/update/phone', middlewareController.verifyToken, userController.updatePhone);

//UPDATE USER FCM TOKEN
router.put('/update/fcmToken', middlewareController.verifyToken, userController.updateFCMToken);

//GET USER DETAIL BY TOKEN
router.get('/me', middlewareController.verifyToken, userController.getUserByToken);

//UPDATE USER PROFILE PICTURE
router.put(
    '/update/profilePicture',
    middlewareController.verifyToken,
    upload.single('file'),
    userController.updateProfilePicture
);

module.exports = router;