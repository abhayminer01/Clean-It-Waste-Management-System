// controllers/rating.controller.js
const Pickup = require("../models/pickup.model");
const EcoCoin = require("../models/ecoCoin.model");
const calculateCoins = require("../utils/calculateCoins");

const submitRating = async (req, res) => {
  try {
    const { id } = req.params; // pickup id
    const { correctSegregation, cleanliness, timingCompliance, hazardousHandling, overallSatisfaction } = req.body;

    // Fetch pickup
    const pickup = await Pickup.findById(id).populate("user").populate("payment");
    if (!pickup) return res.status(404).json({ success: false, message: "Pickup not found" });

    // Total score out of 100
    const totalScore = Math.floor(
      (correctSegregation + cleanliness + timingCompliance + hazardousHandling + overallSatisfaction) * 20
    );

    // Credit Eco Coins only for household user and unpaid pickup
    if (pickup.pickup_type !== "industrial" && !pickup.payment) {
      const coins = calculateCoins(totalScore);

      // Save eco coin record
      await EcoCoin.create({
        user: pickup.user._id,
        pickup: pickup._id,
        coins
      });
    }

    res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      rating: { totalScore }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error submitting rating", err });
  }
};

module.exports = { submitRating };
