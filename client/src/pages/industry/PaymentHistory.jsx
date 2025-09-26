import React, { useEffect, useState } from "react";
import { getInvoiceData, getUserPayments } from "../../services/industry-api";
import { generateInvoice } from "../../utils/generateInvoice";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const res = await getUserPayments();
      if (res?.success) setPayments(res.payments);
      else alert(res?.message || "Failed to fetch payments");
      setLoading(false);
    };
    fetchPayments();
  }, []);

 const handleInvoice = async (paymentId) => {
  try {
    const res = await getInvoiceData(paymentId); // fetch payment + user + pickup
    if (res?.success) {
      generateInvoice({
        payment: res.payment,
        user: res.user,
        pickup: res.pickup,
      });
    } else {
      alert(res.message || "Failed to generate invoice data");
    }
  } catch (error) {
    console.error(error);
    alert("Error generating invoice");
  }
};


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Payments</h1>

      {loading ? (
        <p>Loading...</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {payments.map((p) => (
            <div key={p._id} className="border rounded-xl shadow p-4 bg-white">
              <h2 className="text-lg font-semibold mb-2">
                Payment ID: {p._id.slice(-6)}
              </h2>

              <p className="text-sm text-gray-600 mb-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${
                    p.status === "succeeded" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {p.status}
                </span>
              </p>

              <p className="mb-1">
                <strong>Amount:</strong> ₹{(p.amount / 100).toFixed(2)}
              </p>
              <p className="mb-1">
                <strong>Stripe Intent:</strong> {p.stripePaymentIntentId}
              </p>

              {/* Download Invoice Button */}
                  <button
                    onClick={() => handleInvoice(p._id)}
                    className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Download Invoice
                  </button>

              {/* Related Pickup Details */}
              {p.pickup ? (
                <div className="mt-3 border-t pt-2">
                  <h3 className="font-medium mb-1">Pickup Details</h3>
                  <p className="text-sm">
                    <strong>Waste Type:</strong> {p.pickup.waste_type}
                  </p>
                  <p className="text-sm">
                    <strong>Date:</strong>{" "}
                    {new Date(p.pickup.sheduled_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <strong>Time Slot:</strong> {p.pickup.scheduled_time}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-red-500 mt-2">
                  Pickup details not available
                </p>
              )}

              {/* User Details */}
              {p.user ? (
                <div className="mt-3 border-t pt-2">
                  <h3 className="font-medium mb-1">User Details</h3>
                  <p className="text-sm">
                    <strong>Name:</strong> {p.user.full_name}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {p.user.email}
                  </p>
                  {p.user.phone && (
                    <p className="text-sm">
                      <strong>Phone:</strong> {p.user.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-500 mt-2">
                  User details not available
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
