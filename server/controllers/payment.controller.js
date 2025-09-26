require("dotenv").config();
const Payment = require("../models/payment.model");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE PAYMENT
exports.createPaymentIntent = async (req, res) => {
  try {
    const { pickupid } = req.body;

    if (!pickupid) {
      return res.status(400).json({ success: false, message: "pickupId is required" });
    }

    const amount = 10000;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      payment_method_types: ["card"],
    });

    const payment = await Payment.create({
      user: req.session.user.user_id,
      pickup: pickupid,
      amount,
      stripePaymentIntentId: paymentIntent.id,
    });

    res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create payment intent", err: error });
  }
};


// CONFIRM PAYMENT (OPTIONAL)
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    payment.status = "succeeded";
    await payment.save();

    res.status(200).json({ success: true, message: "Payment confirmed", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to confirm payment", err: error });
  }
};

// GET ALL PAYMENT OF LOGGED IN USER
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.session.user.user_id }).populate("pickup");
    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch payments", err: error });
  }
};

// GET PAYMENT BY ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id).populate("pickup");
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch payment", err: error });
  }
};
