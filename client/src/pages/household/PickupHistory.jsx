import React, { useEffect, useState } from "react";
import { getUserPickups, deletePickup, updatePickup } from "../../services/user-api";
import { Calendar, Clock, Truck, Recycle, Edit3, Trash2, CheckCircle, AlertCircle, Loader2, Package } from 'lucide-react';

export default function PickupHistory() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ wasteType: "", pickupDate: "", timeSlot: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUserPickups();
        if (res?.success) {
          setPickups(res.data);
        } else {
          setError("Failed to load pickup history");
        }
      } catch (err) {
        setError("An error occurred while loading data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pickup? This action cannot be undone.")) return;
    
    try {
      const res = await deletePickup(id);
      if (res?.success) {
        setPickups(pickups.filter((p) => p._id !== id));
      } else {
        setError(res?.message || "Failed to delete pickup");
      }
    } catch (err) {
      setError("An error occurred while deleting pickup");
    }
  };

  const handleEditClick = (pickup) => {
    setEditing(pickup._id);
    setFormData({
      wasteType: pickup.waste_type,
      pickupDate: pickup.sheduled_date,
      timeSlot: pickup.scheduled_time,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await updatePickup(id, formData);
      if (res?.success) {
        setPickups(pickups.map((p) => (p._id === id ? res.data : p)));
        setEditing(null);
      } else {
        setError(res?.message || "Failed to update pickup");
      }
    } catch (err) {
      setError("An error occurred while updating pickup");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'picked': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWasteIcon = (wasteType) => {
    switch (wasteType) {
      case 'Plastic': return <Recycle className="w-5 h-5" />;
      case 'Organic': return <Leaf className="w-5 h-5" />;
      case 'E-Waste': return <Monitor className="w-5 h-5" />;
      case 'Scrap': return <Hammer className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (pickups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Pickups Found</h3>
          <p className="text-gray-600 mb-6">You haven't scheduled any waste pickups yet.</p>
          <button 
            onClick={() => window.location.href = '/schedule'}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Schedule Your First Pickup
          </button>
        </div>
      </div>
    );
  }

  const pickedPickups = pickups.filter((p) => p.status === "picked");
  const activePickups = pickups.filter((p) => p.status !== "picked");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pickup History</h1>
          <p className="text-gray-600">Manage and track all your scheduled waste pickups</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* Active Pickups */}
        {activePickups.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-600" />
              Active Pickups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePickups.map((pickup) => (
                <div key={pickup._id} className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-shadow">
                  {editing === pickup._id ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-blue-700 mb-2">Edit Pickup</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Waste Type</label>
                        <select
                          value={formData.wasteType}
                          onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                          <option value="Plastic">Plastic</option>
                          <option value="Organic">Organic</option>
                          <option value="E-Waste">E-Waste</option>
                          <option value="Scrap">Scrap</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
                        <input
                          type="date"
                          value={formData.pickupDate}
                          onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                        <select
                          value={formData.timeSlot}
                          onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                          <option value="Morning (8AM - 10AM)">Morning (8AM - 10AM)</option>
                          <option value="Afternoon (11AM - 2PM)">Afternoon (11AM - 2PM)</option>
                          <option value="Evening (3PM - 5PM)">Evening (3PM - 5PM)</option>
                        </select>
                      </div>
                      
                      <div className="flex space-x-3 pt-2">
                        <button
                          onClick={() => handleUpdate(pickup._id)}
                          className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                          {getWasteIcon(pickup.waste_type)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{pickup.waste_type}</h3>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{pickup.sheduled_date}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{pickup.scheduled_time}</span>
                        </div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                          <span className="capitalize">{pickup.status}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => handleEditClick(pickup)}
                          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(pickup._id)}
                          className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Picked Pickups */}
        {pickedPickups.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
              Completed Pickups
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pickedPickups.map((pickup) => (
                <div key={pickup._id} className="bg-gray-50 rounded-2xl shadow-lg p-6 border border-gray-200 opacity-90">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                      {getWasteIcon(pickup.waste_type)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{pickup.waste_type}</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{pickup.sheduled_date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{pickup.scheduled_time}</span>
                    </div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                      <span className="capitalize">{pickup.status}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <span className="text-sm text-gray-500">Completed pickup - cannot be edited</span>
                  </div>
                </div>
              ))}
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