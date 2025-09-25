import React, { useState } from "react";
import { createIndustryPickup } from "../../services/user-api";
import { createPaymentIntent } from "../../services/payment-api"; // ✅ use your API
import { useNavigate } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Replace with your Stripe test publishable key
const stripePromise = loadStripe("pk_test_51SBFxdJTRHwNE0gi29cxFK0OEjHvn40zQC1Rgtsb1WI9vnEQCqtxI7Uguas7CDmxGlMn582QqkaZFnbHGRhCxzH800sjqfxgsi");

function CheckoutForm({ amount, onPaymentSuccess, pickupid }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
        // send both amount and pickupId
        const res = await createPaymentIntent({ amount: 100, pickupid });
        if (!res?.clientSecret) {
        alert(res?.message || "Failed to create payment intent");
        return;
        }

        const result = await stripe.confirmCardPayment(res.clientSecret, {
        payment_method: {
            card: elements.getElement(CardElement),
        },
        });

        if (result.error) {
        alert(result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
        alert("Payment Successful!");
        onPaymentSuccess();
        }
    } catch (err) {
        console.error(err);
        alert("Payment failed!");
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <CardElement className="border p-2 rounded" />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : `Pay $${amount / 100}`}
      </button>
    </form>
  );
}

export default function ScheduleIndustryPickup() {
  const navigate = useNavigate();
  const [wasteType, setWasteType] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [pickupCreated, setPickupCreated] = useState(false);
  const [pickupAmount, setPickupAmount] = useState(500); // cents, e.g. $5
  const [pickupId, setPickupId] = useState(0);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = { wasteType, pickupDate, timeSlot };
  const res = await createIndustryPickup(payload);

  if (res?.success) {
    alert("Pickup Scheduled! Please proceed with payment.");

    // Save pickup ID for payment
    setPickupCreated(true);
    setPickupId(res.pickup._id);
  } else {
    alert(res?.message || "Schedule Failed !");
  }
};

  const handlePaymentSuccess = () => {
    navigate("/industry/pickup-history");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Schedule Waste Pickup</h1>

        <div>
          <label className="block mb-1">Waste Type:</label>
          <select
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          >
            <option value="">Select type</option>
            <option value="Plastic">Plastic</option>
            <option value="Organic">Organic</option>
            <option value="E-Waste">E-Waste</option>
            <option value="Scrap">Scrap</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Pickup Date:</label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Time Slot:</label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          >
            <option value="">Select time</option>
            <option value="Morning (8AM - 10AM)">Morning (8AM - 10AM)</option>
            <option value="Afternoon (11AM - 2PM)">Afternoon (11AM - 2PM)</option>
            <option value="Evening (3PM - 5PM)">Evening (3PM - 5PM)</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Schedule Pickup
        </button>
      </form>

      {pickupCreated && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Payment</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm amount={pickupAmount} onPaymentSuccess={handlePaymentSuccess} pickupid={pickupId} />
          </Elements>
        </div>
      )}
    </div>
  );
}
