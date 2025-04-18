const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
        type: String,
        enum: ['tournament', 'match', 'system', 'other'],
        required: true
    },
    recipients: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        read: { type: Boolean, default: false },
        readAt: Date
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);