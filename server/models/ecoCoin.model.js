const mongoose = require("mongoose");

const ecoCoinSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    unique: true 
  },
  totalCoins: { type: Number, default: 0 },

  history: [
    {
      pickup: { type: mongoose.Schema.Types.ObjectId, ref: "Pickup" },
      coins: { type: Number, required: true },
      date: { type: Date, default: Date.now }
    }
  ],

  createdAt: { type: Date, default: Date.now }
});
const EcoCoin = mongoose.model("EcoCoin", ecoCoinSchema);
module.exports = EcoCoin;
