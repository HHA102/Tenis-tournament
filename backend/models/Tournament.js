const mongoose = require("mongoose");
const { REGISTRATION_STATUS, TOURNAMENT_STATUS } = require("../constants");

const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: TOURNAMENT_STATUS,
    default: TOURNAMENT_STATUS.UPCOMING,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  description: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      registrationDate: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: REGISTRATION_STATUS,
        default: REGISTRATION_STATUS.PENDING,
      },
    },
  ],
  registrationDeadline: { type: Date, required: true },
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }],
  sponsors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sponsor" }],
});

module.exports = mongoose.model("Tournament", TournamentSchema);
