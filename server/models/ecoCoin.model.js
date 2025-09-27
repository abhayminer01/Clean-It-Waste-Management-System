// models/ecoCoin.model.js
const mongoose = require("mongoose");

const ecoCoinSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pickup: { type: mongoose.Schema.Types.ObjectId, ref: "Pickup", required: true },
  coins: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EcoCoin", ecoCoinSchema);
