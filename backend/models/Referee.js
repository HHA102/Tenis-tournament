const mongoose = require("mongoose");

const RefereeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: String,
    experienceYears: Number,
    assignedMatches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
    isChief: Boolean,
    chiefRefereeId: { type: mongoose.Schema.Types.ObjectId, ref: "Referee" }
});

module.exports = mongoose.model("Referee", RefereeSchema);
