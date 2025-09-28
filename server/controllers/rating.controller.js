const Pickup = require("../models/pickup.model");
const EcoCoin = require("../models/ecoCoin.model");
const Rating = require("../models/rating.model");
const calculateCoins = require("../utils/calculateCoins");

const submitRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { correctSegregation, cleanliness, timingCompliance, hazardousHandling, overallSatisfaction } = req.body;

    const pickup = await Pickup.findById(id).populate("user").populate("payment");
    if (!pickup) return res.status(404).json({ success: false, message: "Pickup not found" });

    const toNum = (val) => Number(val) || 0;

    const sumScores =
      toNum(correctSegregation) +
      toNum(cleanliness) +
      toNum(timingCompliance) +
      toNum(hazardousHandling) +
      toNum(overallSatisfaction);

    const totalScore = Math.round((sumScores / 25) * 100);

    // 👉 Calculate coins for this rating
    let coins = 0;
    if (pickup.pickup_type !== "industrial" && !pickup.payment) {
      coins = calculateCoins(totalScore);

      // Update or create EcoCoin wallet
      const ecoWallet = await EcoCoin.findOne({ user: pickup.user._id });
      if (ecoWallet) {
        ecoWallet.totalCoins += coins;
        ecoWallet.history.push({
          pickup: pickup._id,
          coins,
          date: new Date()
        });
        await ecoWallet.save();
      } else {
        await EcoCoin.create({
          user: pickup.user._id,
          totalCoins: coins,
          history: [{ pickup: pickup._id, coins, date: new Date() }]
        });
      }
    }

    // 👉 Save rating
    const rating = await Rating.create({
      pickup: pickup._id,
      scores: {
        correctSegregation: toNum(correctSegregation),
        cleanliness: toNum(cleanliness),
        timingCompliance: toNum(timingCompliance),
        hazardousHandling: toNum(hazardousHandling),
        overallSatisfaction: toNum(overallSatisfaction),
      },
      totalScore,
      coins_credited: coins,
    });

    res.status(200).json({
      success: true,
      message: "Rating submitted successfully",
      rating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error submitting rating", err });
  }
};

module.exports = { submitRating };
