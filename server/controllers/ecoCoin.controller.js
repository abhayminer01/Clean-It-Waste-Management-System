const EcoCoin = require("../models/ecoCoin.model");

// GET Eco Coins for logged-in user
const getEcoCoins = async (req, res) => {
  try {
    const ecoCoin = await EcoCoin.findOne({ user: req.user._id }).populate({
      path: "history.pickup",
      select: "waste_type scheduled_date scheduled_time status"
    });

    if (!ecoCoin) return res.status(404).json({ success: false, message: "No Eco Coins found" });

    res.status(200).json({ 
      success: true, 
      totalCoins: ecoCoin.totalCoins, 
      history: ecoCoin.history 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching Eco Coins" });
  }
};

module.exports = { getEcoCoins }