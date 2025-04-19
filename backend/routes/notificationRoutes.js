const Notification = require('../models/Notification');
const notificationController = require('../controllers/notificationController');
const middlewareController = require('../controllers/middlewareController');
const router = require('express').Router();

router.post('/', notificationController.createNotification);
router.put('/:id', notificationController.updateNotification);
router.delete('/:id', notificationController.deleteNotification);
router.post('/push', middlewareController.verifyToken, notificationController.pushNotification);
module.exports = router;