const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stadium: { type: String, required: true },
  location: { type: String, required: true }, // BẮT BUỘC
  startDate: { type: Date, required: true }, // BẮT BUỘC
  endDate: { type: Date, required: true }, // BẮT BUỘC
});

module.exports = mongoose.model("Tournament", TournamentSchema);

