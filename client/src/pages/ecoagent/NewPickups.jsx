import React, { useEffect, useState } from "react";
import { acceptPickup, getNewHouseholdPickups, getNewIndustrialPickups } from "../../services/ecoagent-api";
import {
  Truck,
  User,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Phone,
  X,
  Building2,
  Home
} from "lucide-react";

// Icon components
const Recycle = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.5 2 5.7 4.8 5.7 8.3c0 2.1 1.1 4 2.8 5.2l1.5 1c.4.3.9.3 1.3 0l1.5-1c1.7-1.2 2.8-3.1 2.8-5.2 0-3.5-2.8-6.3-6.3-6.3zm0 10.5c-1.3 0-2.4-1.1-2.4-2.4s1.1-2.4 2.4-2.4 2.4 1.1 2.4 2.4-1.1 2.4-2.4 2.4z"/>
  </svg>
);

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

const CreditCard = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

export default function NewPickups() {
  const [pickups, setPickups] = useState({ household: [], industrial: [] });
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    setLoading(true);
    setError("");
    try {
      const [householdRes, industrialRes] = await Promise.all([
        getNewHouseholdPickups(),
        getNewIndustrialPickups(),
      ]);

      setPickups({
        household: householdRes?.pickups || [],
        industrial: industrialRes?.pickups || [],
      });
    } catch (err) {
      console.error(err);
      setError("Error loading pickups");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPickup = async (pickupId) => {
    setAccepting(true);
    setError("");
    try {
      const res = await acceptPickup(pickupId);
      if (res?.success) {
        setSelectedPickup(null);
        fetchPickups();
      } else {
        setError(res?.message || "Failed to accept pickup");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while accepting pickup");
    } finally {
      setAccepting(false);
    }
  };

  const getWasteIcon = (wasteType) => {
    switch (wasteType) {
      case "Plastic": return <Recycle className="w-5 h-5 text-blue-600" />;
      case "Organic": return <Leaf className="w-5 h-5 text-green-600" />;
      case "E-Waste": return <Monitor className="w-5 h-5 text-purple-600" />;
      case "Scrap": return <Hammer className="w-5 h-5 text-orange-600" />;
      default: return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const isIndustrialPickup = (pickup) => pickup.pickup_type === "industrial";

  const getUserName = (user, pickup) => {
    if (!user) return pickup?.industry_name || "Unknown";
    return user.full_name || user.name || user.industry_name || "Unknown";
  };

  const getUserPhone = (user) => {
    if (!user) return "N/A";
    return user.mobile_number || user.contact || "N/A";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading new pickups...</p>
        </div>
      </div>
    );
  }

  const renderPickups = (pickupArray, type) => {
    if (!pickupArray || pickupArray.length === 0)
      return <p className="text-gray-600 mb-6">No {type} pickups available.</p>;

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pickupArray.map((p) => (
          <div
            key={p._id}
            onClick={() => setSelectedPickup(p)}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-emerald-100 cursor-pointer group hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Pickup #{p._id.slice(-6).toUpperCase()}
              </h2>
              <div className="flex items-center space-x-2">
                {isIndustrialPickup(p) ? (
                  <Building2 className="w-5 h-5 text-purple-600" />
                ) : (
                  <Home className="w-5 h-5 text-emerald-600" />
                )}
                {getWasteIcon(p.waste_type)}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">{getUserName(p.user, p)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600 truncate">{p.user?.address || "N/A"}</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">
                  {p.scheduled_date ? new Date(p.scheduled_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  }) : "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600">{p.scheduled_time || "N/A"}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                isIndustrialPickup(p) ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {isIndustrialPickup(p) ? "Industrial" : "Household"}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {p.waste_type}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">New Pickups</h1>
          <p className="text-gray-600">Review and accept new waste collection assignments</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* Household Pickups */}
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Home className="w-5 h-5 mr-2 text-emerald-600" />
          Household Pickups
        </h2>
        {renderPickups(pickups.household, "household")}

        {/* Industrial Pickups */}
        <h2 className="text-xl font-bold mt-8 mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-purple-600" />
          Industrial Pickups
        </h2>
        {renderPickups(pickups.industrial, "industrial")}

        {/* Modal */}
        {selectedPickup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setSelectedPickup(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Pickup Assignment
              </h2>

              <div className="space-y-4 mb-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Customer Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Name:</span>
                      <span className="text-gray-900">{getUserName(selectedPickup.user, selectedPickup)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-600" />
                        {getUserPhone(selectedPickup.user)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Address:</span>
                      <span className="text-gray-900 text-right max-w-[200px] truncate" title={selectedPickup.user?.address}>
                        <MapPin className="w-4 h-4 inline mr-1 text-gray-600" />
                        {selectedPickup.user?.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-green-600" />
                    Pickup Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Waste Type:</span>
                      <span className="text-gray-900">{selectedPickup.waste_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Scheduled Date:</span>
                      <span className="text-gray-900">{selectedPickup.scheduled_date ? new Date(selectedPickup.scheduled_date).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Time Slot:</span>
                      <span className="text-gray-900">{selectedPickup.scheduled_time || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setSelectedPickup(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAcceptPickup(selectedPickup._id)}
                  disabled={accepting}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-70 flex items-center justify-center"
                >
                  {accepting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Accept Pickup
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
