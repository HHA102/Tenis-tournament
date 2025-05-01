const mongoose = require("mongoose");
const { MATCH_STATUS } = require("../constants");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  tournament: {
    type: Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  },
  round: { type: Number, required: true },
  player1: { type: Schema.Types.ObjectId, ref: "User", required: true },
  player2: { type: Schema.Types.ObjectId, ref: "User", required: true },
  referee: { type: Schema.Types.ObjectId, ref: "User", default: null },
  court: { type: Schema.Types.ObjectId, ref: "Court", required: true },
  scheduledTime: { type: Date, required: true },
  status: {
    type: String,
    enum: MATCH_STATUS,
    default: MATCH_STATUS.SCHEDULED,
  },
  result: {
    sets: [
      {
        player1Score: Number,
        player2Score: Number,
      },
    ],
    winner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  liveScore: {
    currentSet: Number,
    currentGame: {
      player1: {
        score: Number,
        isAdvantage: { type: Boolean, default: false },
      },
      player2: {
        score: Number,
        isAdvantage: { type: Boolean, default: false },
      },
    },
    isLive: { type: Boolean, default: false },
  },
  liveStreamId: { type: String, default: null },
  isFeatured: { type: Boolean, default: false },
});

module.exports = mongoose.model("Match", MatchSchema);
