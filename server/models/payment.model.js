const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pickup: { type: mongoose.Schema.Types.ObjectId, ref: "Pickup", required: true },
  amount: { type: Number, required: true }, // in cents
  currency: { type: String, default: "usd" },
  status: { type: String, enum: ["pending", "succeeded", "failed"], default: "pending" },
  stripePaymentIntentId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
