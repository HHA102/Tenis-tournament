const mongoose = require("mongoose");
const { INCIDENT_STATUS, INCIDENT_TYPE } = require("../constants");

const IncidentSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reportedAt: { type: Date, default: Date.now },
    match: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
    type: { type: String, enum: INCIDENT_TYPE },
    description: String,
    status: { type: String, enum: INCIDENT_STATUS, default: INCIDENT_STATUS.PENDING },
    resolutionNote: String,
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
});

module.exports = mongoose.model("Incident", IncidentSchema);
