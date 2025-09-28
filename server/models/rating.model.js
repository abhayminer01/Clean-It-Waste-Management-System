const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  pickup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pickup",
    required: true,
  },
  scores: {
    correctSegregation: { type: Number, required: true },
    cleanliness: { type: Number, required: true },
    timingCompliance: { type: Number, required: true },
    hazardousHandling: { type: Number, required: true },
    overallSatisfaction: { type: Number, required: true },
  },
  totalScore: { type: Number, required: true },
  coins_credited: { type: Number, default: 0 },
}, { timestamps: true });

const Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;
