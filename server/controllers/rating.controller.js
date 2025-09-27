// controllers/rating.controller.js
const Rating = require("../models/rating.model");
const Pickup = require("../models/pickup.model");

const submitRating = async (req, res) => {
  try {
    const { pickupId } = req.params;
    const {
      correctSegregation,
      cleanliness,
      timingCompliance,
      hazardousHandling,
      overallSatisfaction
    } = req.body;

    // Ensure all fields are present
    if ([correctSegregation, cleanliness, timingCompliance, hazardousHandling, overallSatisfaction].some(v => v == null))
      return res.status(400).json({ success: false, message: "All ratings are required" });

    // Calculate total score out of 100
    const totalScore = Math.round(
      (correctSegregation + cleanliness + timingCompliance + hazardousHandling + overallSatisfaction) * 4
    );

    const rating = await Rating.create({
      pickup: pickupId,
      scores: { correctSegregation, cleanliness, timingCompliance, hazardousHandling, overallSatisfaction },
      totalScore
    });

    res.status(200).json({ success: true, message: "Rating submitted successfully", rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error submitting rating", err });
  }
};

module.exports = { submitRating };
