require("dotenv").config();
const Payment = require("../models/payment.model");
const Stripe = require("stripe");
const User = require("../models/user.model");
const Pickup = require("../models/pickup.model");
const Industry = require("../models/industry.model");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE PAYMENT INTENT
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
      status: "pending",
    });

    updateStatus(payment._id);

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create payment intent", err: error });
  }
};

async function updateStatus(paymentId) {
  try {
    const payment = await Payment.findById(paymentId);
    await payment.updateOne({ status : 'succeeded' });
  } catch (error) {
    console.log(error);
  }
}



// UPDATE PAYMENT STATUS (after frontend confirms)
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ success: false, message: "paymentIntentId is required" });
    }

    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId }).populate("pickup");
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    payment.status = "succeeded";
    await payment.save();

    res.status(200).json({ success: true, message: "Payment marked as succeeded", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update payment", err: error });
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

// GET ALL PAYMENTS OF LOGGED IN USER WITH SEPARATE USER DATA
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.session.user.user_id })
      .populate("pickup").populate('user');

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch payments", err: error });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find payment and populate pickup and user references
    const payment = await Payment.findById(id)
      .populate("pickup")
      .populate("user");

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch payment", err: error });
  }
};

// CONTROLLER FOR PAYMENT INVOICE DATA
exports.generateInvoiceData = async (req, res) => {
  try {
    const { paymentId } = req.body;
    if(!paymentId) {
      return res.status(400).json({ success : false, message : "Payment Id Required to generate invoice" });
    }

    const payment = await Payment.findById(paymentId);
    const user = await Industry.findById(payment.user._id);
    const pickup = await Pickup.findById(payment.pickup._id);

    res.status(200).json({ success : true, message : "Data generated", payment : payment, user : user, pickup : pickup });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success : false, message : "error Occured", err : error });
  }
}