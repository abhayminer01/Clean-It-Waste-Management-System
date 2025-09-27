import React, { useEffect, useState } from "react";
import { getInvoiceData, getUserPayments } from "../../services/industry-api";
import { generateInvoice } from "../../utils/generateInvoice";
import { CreditCard, Download, CheckCircle, AlertCircle, Clock, Loader2, FileText } from 'lucide-react';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError("");
      
      try {
        const res = await getUserPayments();
        if (res?.success) {
          // Sort by newest first
          const sorted = [...res.payments].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setPayments(sorted);
        } else {
          setError(res?.message || "Failed to fetch payments");
        }
      } catch (err) {
        setError("An error occurred while loading payment history");
      } finally {
        setLoading(false);
      }
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
        setError(res.message || "Failed to generate invoice data");
      }
    } catch (error) {
      console.error(error);
      setError("Error generating invoice");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-600 rounded-2xl mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
          <p className="text-gray-600">View and manage all your industrial waste collection payments</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Payments Found</h3>
            <p className="text-gray-600 mb-6">You haven't made any payments for industrial waste pickups yet.</p>
            <button 
              onClick={() => window.location.href = '/industry/schedule'}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Schedule Your First Pickup
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {payments.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-emerald-100 group"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Invoice #{p._id.slice(-6).toUpperCase()}
                  </h2>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium flex items-center space-x-1 ${getStatusColor(p.status)}`}>
                    {getStatusIcon(p.status)}
                    <span className="capitalize">{p.status}</span>
                  </span>
                </div>

                {/* Amount */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{(p.amount / 100).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Total Amount</p>
                </div>

                {/* Created Timestamp */}
                {p.createdAt && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-medium">Payment Date</p>
                    <p className="text-sm text-gray-800">
                      {new Date(p.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                {/* Pickup Details */}
                {p.pickup ? (
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">Waste Type:</span>
                      <span className="text-gray-900">{p.pickup.waste_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">Pickup Date:</span>
                      <span className="text-gray-900">
                        {new Date(p.pickup.sheduled_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-medium">Time Slot:</span>
                      <span className="text-gray-900">{p.pickup.scheduled_time}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5">
                    <p className="text-xs text-red-700">Pickup details not available</p>
                  </div>
                )}

                {/* Invoice Button */}
                <button
                  onClick={() => handleInvoice(p._id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-emerald-600 text-white py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group-hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Invoice</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {payments.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-700">
                  {payments.length}
                </div>
                <div className="text-sm text-emerald-600">Total Payments</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  ₹{payments.reduce((sum, p) => sum + (p.amount / 100), 0).toFixed(2)}
                </div>
                <div className="text-sm text-blue-600">Total Amount</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {payments.filter(p => p.status === 'succeeded').length}
                </div>
                <div className="text-sm text-green-600">Successful Payments</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}