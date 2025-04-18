const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    round: { type: Number, required: true },
    player1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    player2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referee: { type: Schema.Types.ObjectId, ref: 'User' },
    court: { type: Schema.Types.ObjectId, ref: 'Court' },
    scheduledTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    score: {
        sets: [{
            player1Score: Number,
            player2Score: Number
        }],
        winner: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    liveScore: {
        currentSet: Number,
        currentGame: {
            player1Score: Number,
            player2Score: Number
        },
        isLive: { type: Boolean, default: false }
    }
})

module.exports = mongoose.model("Match", MatchSchema);
