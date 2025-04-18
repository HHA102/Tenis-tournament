const mongoose = require("mongoose");

const CourtSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: String,
    surface: {
        type: String,
        enum: ['hard', 'clay', 'grass', 'artificial'],
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available'
    },
    features: [String]
});

module.exports = mongoose.model("Court", CourtSchema);