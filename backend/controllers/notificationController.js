const Notification = require('../models/Notification');

const notificationController = {
    createNotification: async (req, res) => {
        const { title, message, userId } = req.body;
        try {
            const notification = new Notification({ title, message, userId });
            await notification.save();
            res.status(201).json(notification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getNotifications: async (req, res) => {
        try {
            const notifications = await Notification.find();
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getNotificationById: async (req, res) => {
        try {
            const notification = await Notification.findById(req.params.id);
            res.status(200).json(notification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateNotification: async (req, res) => {
        try {
            const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json(notification);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteNotification: async (req, res) => {
        try {
            await Notification.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'Notification deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = notificationController;

