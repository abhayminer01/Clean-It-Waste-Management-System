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
      if (res?.success) {
        // Sort by newest first
        const sorted = [...res.payments].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPayments(sorted);
      } else {
        alert(res?.message || "Failed to fetch payments");
      }
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const handleInvoice = async (paymentId) => {
    try {
      const res = await getInvoiceData(paymentId);
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Payment History
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-500">No payments found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {payments.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">
                  #{p._id.slice(-6)}
                </h2>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    p.status === "succeeded"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {/* Amount */}
              <p className="text-xl font-bold text-gray-900">
                ₹{(p.amount / 100).toFixed(2)}
              </p>

              {/* ✅ Created Timestamp */}
              {p.createdAt && (
                <p className="text-xs text-gray-500 mb-3">
                  {new Date(p.createdAt).toLocaleString()}
                </p>
              )}

              {/* Pickup Details */}
              {p.pickup ? (
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>
                    <span className="font-medium">Waste Type:</span>{" "}
                    {p.pickup.waste_type}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(p.pickup.sheduled_date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Time Slot:</span>{" "}
                    {p.pickup.scheduled_time}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-red-500 mb-4">
                  Pickup details not available
                </p>
              )}

              {/* Invoice Button */}
              <button
                onClick={() => handleInvoice(p._id)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Download Invoice
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
