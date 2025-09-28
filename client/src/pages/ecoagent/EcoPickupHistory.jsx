import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Truck, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Home, 
  Building2,
  FileText
} from 'lucide-react';

export default function EcoPickupHistory() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPickups = async () => {
      setLoading(true);
      setError("");
      
      try {
        const res = await axios.get('http://localhost:5000/api/industry/pickups', { withCredentials : true });
        console.log(res.data)
        if (res?.data?.success) {
          setPickups(res?.data?.pickups || []);
        } else {
          setError(res?.message || "Failed to load pickup history");
        }
      } catch (err) {
        setError("An error occurred while loading pickup history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPickups();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "picked":
        return "bg-green-100 text-green-700";
      case "accepted":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isIndustrialPickup = (pickup) => {
    return pickup.user?.industry_name || pickup.user?.licence;
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pickup History</h1>
          <p className="text-gray-600">Review all your assigned waste collection pickups</p>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Pickups Assigned</h3>
            <p className="text-gray-600 mb-6">You haven't been assigned any pickup tasks yet.</p>
            <button 
              onClick={() => window.location.href = '/ecoagent/pickups/new'}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              View New Pickups
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pickups.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100"
              >
                {/* Pickup Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Pickup #{p._id.slice(-6).toUpperCase()}
                  </h2>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium flex items-center space-x-1 ${getStatusColor(p.status)}`}>
                    {p.status === "picked" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    <span className="capitalize">{p.status}</span>
                  </span>
                </div>

                {/* Pickup Type Badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isIndustrialPickup(p) ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {isIndustrialPickup(p) ? "Industrial" : "Household"}
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
                        {new Date(p.scheduled_date).toLocaleDateString('en-US', {
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

                {/* User Information */}
                <div className="space-y-2 text-sm mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {p.user?.industry_name || p.user?.full_name || "Unknown User"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600 truncate">
                      {p.user?.address || "Address not available"}
                    </span>
                  </div>
                </div>

                {/* Rating Info (if applicable) */}
                {p.status === "picked" && p.rating && (
                  <div className="text-sm p-3 bg-green-50 rounded-lg">
                    <p className="text-green-700 font-medium">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Rated: {p.rating.totalScore}/100
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {pickups.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-700">
                  {pickups.length}
                </div>
                <div className="text-sm text-emerald-600">Total Pickups</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {pickups.filter(p => p.status === 'picked').length}
                </div>
                <div className="text-sm text-green-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {pickups.filter(p => p.status === 'accepted').length}
                </div>
                <div className="text-sm text-blue-600">Accepted</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">
                  {pickups.filter(p => isIndustrialPickup(p)).length}
                </div>
                <div className="text-sm text-purple-600">Industrial</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}