const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StatisticsSchema = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament' },
    type: {
        type: String,
        enum: ['tournament', 'player', 'financial'],
        required: true
    },
    data: Schema.Types.Mixed,
    generatedAt: { type: Date, default: Date.now },
    generatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Statistic", StatisticsSchema);
