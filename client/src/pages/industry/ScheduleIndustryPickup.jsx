import React, { useState } from "react";
import { createIndustryPickup } from "../../services/user-api";
import { createPaymentIntent, updatePaymentStatus } from "../../services/payment-api";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Calendar, Clock, Truck, Recycle, CreditCard, AlertCircle, CheckCircle, Loader2, Building2 } from 'lucide-react';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51SBFxdJTRHwNE0gi29cxFK0OEjHvn40zQC1Rgtsb1WI9vnEQCqtxI7Uguas7CDmxGlMn582QqkaZFnbHGRhCxzH800sjqfxgsi");

function CheckoutForm({ amount, onPaymentSuccess, pickupId }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const res = await createPaymentIntent({ pickupid: pickupId });
      if (!res?.clientSecret) {
        setError(res?.message || "Failed to create payment intent");
        setLoading(false);
        return;
      }

      const result = await stripe.confirmCardPayment(res.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
      } else if (result.paymentIntent.status === "succeeded") {
        // ✅ Update backend payment status
        await updatePaymentStatus({ paymentIntentId: result.paymentIntent.id });
        onPaymentSuccess();
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed! Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
        Payment Details
      </h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-gray-300 rounded-xl p-4">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
            className="p-2"
          />
        </div>
        
        <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl">
          <span className="font-semibold text-gray-700">Total Amount:</span>
          <span className="text-2xl font-bold text-emerald-600">₹{amount / 100}</span>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          disabled={!stripe || loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay Now
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ScheduleIndustryPickup() {
  const navigate = useNavigate();
  const [wasteType, setWasteType] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [pickupCreated, setPickupCreated] = useState(false);
  const [pickupAmount] = useState(10000); // paise (₹100)
  const [pickupId, setPickupId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = { wasteType, pickupDate, timeSlot };
    
    try {
      const res = await createIndustryPickup(payload);
      setLoading(false);
      
      if (res?.success) {
        setPickupCreated(true);
        setPickupId(res.pickup._id);
      } else {
        setError(res?.message || "Schedule Failed!");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred while scheduling pickup.");
    }
  };

  const handlePaymentSuccess = () => {
    navigate("/industry/payment-history");
  };

  const wasteTypes = [
    { value: "Plastic", label: "Plastic Waste", icon: <Recycle className="w-5 h-5" /> },
    { value: "Organic", label: "Organic Waste", icon: <Leaf className="w-5 h-5" /> },
    { value: "E-Waste", label: "Electronic Waste", icon: <Monitor className="w-5 h-5" /> },
    { value: "Scrap", label: "Metal Scrap", icon: <Hammer className="w-5 h-5" /> },
    { value: "Other", label: "Other Waste", icon: <Package className="w-5 h-5" /> }
  ];

  const timeSlots = [
    { value: "Morning (8AM - 10AM)", label: "Morning", time: "8AM - 10AM" },
    { value: "Afternoon (11AM - 2PM)", label: "Afternoon", time: "11AM - 2PM" },
    { value: "Evening (3PM - 5PM)", label: "Evening", time: "3PM - 5PM" }
  ];

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Industrial Pickup</h1>
          <p className="text-gray-600">Book your industrial waste collection with secure payment</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* Schedule Form */}
        {!pickupCreated && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
            <div className="space-y-6">
              {/* Waste Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Waste Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {wasteTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setWasteType(type.value)}
                      className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        wasteType === type.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                        {type.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{type.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup Date */}
              <div>
                <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="pickupDate"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={minDate}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Pickups available from tomorrow onwards</p>
              </div>

              {/* Time Slot Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Time Slot
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setTimeSlot(slot.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                        timeSlot === slot.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{slot.label}</div>
                      <div className="text-sm text-gray-600">{slot.time}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !wasteType || !pickupDate || !timeSlot}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Scheduling Pickup...
                  </>
                ) : (
                  <>
                    <Truck className="w-5 h-5 mr-2" />
                    Schedule Pickup
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Payment Section */}
        {pickupCreated && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">Pickup Scheduled Successfully!</h2>
              <p className="text-green-700">Please complete the payment to confirm your industrial waste pickup.</p>
            </div>
            
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                amount={pickupAmount} 
                onPaymentSuccess={handlePaymentSuccess} 
                pickupId={pickupId} 
              />
            </Elements>
            
            <div className="text-center text-sm text-gray-500">
              <p>Secure payment processing powered by Stripe</p>
              <div className="flex justify-center space-x-2 mt-2">
                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                <div className="w-8 h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper components for icons
const Leaf = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.5 2 5.7 4.8 5.7 8.3c0 2.1 1.1 4 2.8 5.2l1.5 1c.4.3.9.3 1.3 0l1.5-1c1.7-1.2 2.8-3.1 2.8-5.2 0-3.5-2.8-6.3-6.3-6.3zm0 10.5c-1.3 0-2.4-1.1-2.4-2.4s1.1-2.4 2.4-2.4 2.4 1.1 2.4 2.4-1.1 2.4-2.4 2.4z"/>
  </svg>
);

const Monitor = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6l-2 3v1h8v-1l-2-3h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H4V5h16v10z"/>
  </svg>
);

const Hammer = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 18h2v2H5v-2zm0-4h2v2H5v-2zm0-4h2v2H5V10zm0-4h2v2H5V6zm4 12h2v2H9v-2zm0-4h2v2H9v-2zm0-4h2v2H9V10zm0-4h2v2H9V6zm4 12h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V10zm0-4h2v2h-2V6z"/>
  </svg>
);

const Package = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 13v10h-6v-6h-6v6H3V13l9-9 9 9zm-9-2l-7 7v2h5v-4h4v4h5v-2l-7-7z"/>
  </svg>
);