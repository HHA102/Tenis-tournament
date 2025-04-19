const mongoose = require("mongoose");

const MonitorSchema = new mongoose.Schema({
    action: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    timestamp: { type: Date, default: Date.now },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

module.exports = mongoose.model("Monitor", MonitorSchema);
