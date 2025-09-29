import React, { useEffect, useState } from "react";
import { getAllPickups, deletePickup } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Truck, Calendar, Clock, User, Trash2, Loader2, AlertCircle, CheckCircle, MapPin, Building2, Home } from 'lucide-react';

export default function ManagePickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchPickups = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllPickups();
      if (res?.success) {
        setPickups(res.data || []);
      } else {
        setError(res?.message || "Failed to fetch pickups");
        setPickups([]);
      }
    } catch (err) {
      setError("An error occurred while loading pickups");
      setPickups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pickup? This action cannot be undone.")) {
      return;
    }
    
    setDeletingId(id);
    try {
      const res = await deletePickup(id);
      if (res?.success) {
        setPickups(pickups.filter((p) => p._id !== id));
      } else {
        setError(res?.message || "Failed to delete pickup");
      }
    } catch (err) {
      setError("An error occurred during deletion");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "picked": return "bg-green-100 text-green-700";
      case "accepted": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const isIndustrialPickup = (pickup) => {
    return pickup.user?.industry_name || pickup.user?.licence;
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading pickup schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Pickup Schedules</h1>
          <p className="text-gray-400">View and manage all scheduled waste collection pickups</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {pickups.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto border border-gray-700">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Pickups Found</h3>
            <p className="text-gray-400 mb-6">There are no scheduled pickups in the system.</p>
            <button 
              onClick={fetchPickups}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Refresh List
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pickups.map((pickup) => (
              <div
                key={pickup._id}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-emerald-400" />
                    Pickup #{pickup._id.slice(-6).toUpperCase()}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                    {pickup.status}
                  </span>
                </div>

                <div className="mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    isIndustrialPickup(pickup) ? "bg-purple-900 text-purple-200" : "bg-emerald-900 text-emerald-200"
                  }`}>
                    {isIndustrialPickup(pickup) ? (
                      <><Building2 className="w-3 h-3 mr-1" /> Industrial</>
                    ) : (
                      <><Home className="w-3 h-3 mr-1" /> Household</>
                    )}
                  </span>
                </div>

                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-gray-500">Waste Type:</span>
                      <p className="text-white ml-1">{pickup.waste_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <p className="text-white ml-1">
                        {new Date(pickup.sheduled_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <div>
                      <span className="text-gray-500">Time:</span>
                      <p className="text-white ml-1">{pickup.scheduled_time}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">User:</span>
                  </div>
                  {pickup.user ? (
                    <button
                      onClick={() => navigate(`/users/${pickup.user._id}`)}
                      className="text-blue-400 hover:text-blue-300 hover:underline text-sm break-words"
                    >
                      {pickup.user.industry_name || pickup.user.full_name || "Unknown User"}
                    </button>
                  ) : (
                    <p className="text-gray-400 text-sm">Unknown User</p>
                  )}
                  
                  {pickup.user?.address && (
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-400 text-xs break-words">{pickup.user.address}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(pickup._id)}
                  disabled={deletingId === pickup._id}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-70 flex items-center justify-center space-x-2"
                >
                  {deletingId === pickup._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{deletingId === pickup._id ? "Deleting..." : "Delete Pickup"}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {pickups.length > 0 && (
          <div className="mt-8 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Total Pickups</h3>
              </div>
              <div className="text-2xl font-bold text-blue-400">{pickups.length}</div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
              <div className="text-center p-2 bg-green-900/30 rounded-lg">
                <div className="font-bold text-green-400">
                  {pickups.filter(p => p.status === 'picked').length}
                </div>
                <div className="text-gray-400">Completed</div>
              </div>
              <div className="text-center p-2 bg-blue-900/30 rounded-lg">
                <div className="font-bold text-blue-400">
                  {pickups.filter(p => p.status === 'accepted').length}
                </div>
                <div className="text-gray-400">Accepted</div>
              </div>
              <div className="text-center p-2 bg-yellow-900/30 rounded-lg">
                <div className="font-bold text-yellow-400">
                  {pickups.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-gray-400">Pending</div>
              </div>
              <div className="text-center p-2 bg-purple-900/30 rounded-lg">
                <div className="font-bold text-purple-400">
                  {pickups.filter(p => isIndustrialPickup(p)).length}
                </div>
                <div className="text-gray-400">Industrial</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}