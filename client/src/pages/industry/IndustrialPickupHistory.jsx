import React, { useEffect, useState } from "react";
import { getUserPickups, updatePickup, deletePickup } from "../../services/industry-api";
import { Truck, Calendar, Clock, Edit3, Trash2, CheckCircle, AlertCircle, Loader2, CreditCard, FileText } from 'lucide-react';

export default function IndustrialPickupHistory() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    waste_type: "",
    sheduled_date: "",
    scheduled_time: "",
  });
  const [error, setError] = useState("");

  const fetchPickups = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await getUserPickups();
      if (res?.success) {
        setPickups(res.pickups);
      } else {
        setError(res?.message || "Failed to fetch pickups");
      }
    } catch (err) {
      setError("An error occurred while loading pickup history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleEdit = (pickup) => {
    setEditingId(pickup._id);
    setFormData({
      waste_type: pickup.waste_type,
      sheduled_date: pickup.sheduled_date.split("T")[0],
      scheduled_time: pickup.scheduled_time,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await updatePickup(id, formData);
      if (res?.success) {
        setEditingId(null);
        fetchPickups();
      } else {
        setError(res?.message || "Update failed");
      }
    } catch (err) {
      setError("An error occurred while updating pickup");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pickup? This action cannot be undone.")) {
      try {
        const res = await deletePickup(id);
        if (res?.success) {
          fetchPickups();
        } else {
          setError(res?.message || "Delete failed");
        }
      } catch (err) {
        setError("An error occurred while deleting pickup");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusColor = (status) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your pickup history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Industrial Pickup History</h1>
          <p className="text-gray-600">Manage and track all your scheduled industrial waste pickups</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {pickups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Pickups Scheduled</h3>
            <p className="text-gray-600 mb-6">You haven't scheduled any industrial waste pickups yet.</p>
            <button 
              onClick={() => window.location.href = '/industry/schedule'}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Schedule Your First Pickup
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pickups.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-emerald-100 group"
              >
                {editingId === p._id ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-blue-700 mb-3">Edit Pickup</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Waste Type</label>
                      <input
                        type="text"
                        value={formData.waste_type}
                        onChange={(e) => setFormData({ ...formData, waste_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="Waste Type"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                      <input
                        type="date"
                        value={formData.sheduled_date}
                        onChange={(e) => setFormData({ ...formData, sheduled_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                      <input
                        type="text"
                        value={formData.scheduled_time}
                        onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="Time Slot (e.g., Morning 8AM-10AM)"
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <button
                        onClick={() => handleUpdate(p._id)}
                        className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Pickup Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Pickup #{p._id.slice(-6).toUpperCase()}
                      </h2>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium flex items-center space-x-1 ${getStatusColor(p.status)}`}>
                        {p.status === "accepted" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span className="capitalize">{p.status}</span>
                      </span>
                    </div>

                    {/* Pickup Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-3 text-sm">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span className="text-gray-600 font-medium">Waste Type:</span>
                          <span className="text-gray-900 ml-1">{p.waste_type}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="text-gray-600 font-medium">Date:</span>
                          <span className="text-gray-900 ml-1">
                            {new Date(p.sheduled_date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <div>
                          <span className="text-gray-600 font-medium">Time:</span>
                          <span className="text-gray-900 ml-1">{p.scheduled_time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    {p.payment ? (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 flex items-center space-x-1">
                            <CreditCard className="w-3 h-3" />
                            <span>Payment</span>
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${getPaymentStatusColor(p.payment.status)}`}>
                            {p.payment.status}
                          </span>
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="text-gray-900 font-semibold">₹{(p.payment.amount / 100).toFixed(2)}</p>
                          {p.payment.createdAt && (
                            <p className="text-gray-600">
                              {new Date(p.payment.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-xs text-red-700 flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>Payment not available</span>
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-1 text-sm font-medium"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-1 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {pickups.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Pickup Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-700">
                  {pickups.length}
                </div>
                <div className="text-sm text-emerald-600">Total Pickups</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {pickups.filter(p => p.status === 'accepted').length}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-700">
                  {pickups.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {pickups.reduce((sum, p) => sum + (p.payment?.amount / 100 || 0), 0).toFixed(2)}
                </div>
                <div className="text-sm text-blue-600">Total Spent (₹)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}