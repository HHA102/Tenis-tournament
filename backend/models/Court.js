const mongoose = require("mongoose");
const { COURT_SURFACE, COURT_STATUS } = require("../constants");
const CourtSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    surface: {
        type: String,
        enum: COURT_SURFACE,
        required: true
    },
    status: {
        type: String,
        enum: COURT_STATUS,
        default: COURT_STATUS.AVAILABLE
    },
    features: [String]
});

module.exports = mongoose.model("Court", CourtSchema);