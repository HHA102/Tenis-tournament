const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  description: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{
    player: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
  }],
  sponsors: [{
    name: String,
    logo: String,
    website: String
  }]
});

module.exports = mongoose.model("Tournament", TournamentSchema);

