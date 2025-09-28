import React, { useEffect, useState } from "react";
import { getAcceptedPickups, markPickupAsPicked } from "../../services/ecoagent-api";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
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
  Navigation,
  Timer,
  Home,
  Building2,
  X,
  Award
} from "lucide-react";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper components for icons
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

// Waste type icons with Lucide
const WasteIcons = {
  Plastic: <Recycle className="w-5 h-5 text-blue-600" />,
  Organic: <Leaf className="w-5 h-5 text-green-600" />,
  "E-Waste": <Monitor className="w-5 h-5 text-purple-600" />,
  Scrap: <Hammer className="w-5 h-5 text-orange-600" />,
  Default: <Package className="w-5 h-5 text-gray-600" />
};

export default function AcceptedPickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [agentLocation, setAgentLocation] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [mapPickup, setMapPickup] = useState(null);
  const [markingPicked, setMarkingPicked] = useState(false);
  const [todayPickupsCount, setTodayPickupsCount] = useState(0);
  const [showTodayModal, setShowTodayModal] = useState(false);

  const navigate = useNavigate();

  // Normalize coordinates for all pickups
  const normalize = (pickup) => {
    let coords = null;
    const { location_coords, coords: legacyCoords } = pickup.user || {};

    if (location_coords?.lat != null && location_coords?.lng != null) {
      coords = { lat: location_coords.lat, lng: location_coords.lng };
    } else if (legacyCoords) {
      const { latitude, longitude, lat, lng } = legacyCoords;
      if ((latitude != null && longitude != null) || (lat != null && lng != null)) {
        coords = { lat: latitude ?? lat, lng: longitude ?? lng };
      }
    }
    return { ...pickup, coords };
  };

  const fetchAcceptedPickups = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAcceptedPickups();
      if (res?.success && res.data) {
        const household = Array.isArray(res.data.household) ? res.data.household : [];
        const industrial = Array.isArray(res.data.industrial) ? res.data.industrial : [];
        const normalized = [...household, ...industrial].map(normalize);
        setPickups(normalized);
        
        // Count today's pickups
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPickups = normalized.filter(pickup => {
          const pickupDate = new Date(pickup.scheduled_date);
          pickupDate.setHours(0, 0, 0, 0);
          return pickupDate.getTime() === today.getTime();
        });
        setTodayPickupsCount(todayPickups.length);
        if (todayPickups.length > 0) {
          setShowTodayModal(true);
        }
      } else {
        setPickups([]);
        setError(res?.message || "No pickups found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load pickups.");
      setPickups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedPickups();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setAgentLocation([pos.coords.latitude, pos.coords.longitude]),
        () => setError("Location access required to show routes.")
      );
    }
  }, []);

  // Helpers
  const isIndustrialPickup = (pickup) =>
    pickup.pickup_type === "industrial" ||
    (pickup.user && (pickup.user.licence || pickup.user.industry_name));

  const calculateDistance = (pickupLocation) => {
    if (!agentLocation || !pickupLocation) return null;
    const R = 6371;
    const lat1 = (agentLocation[0] * Math.PI) / 180;
    const lat2 = (pickupLocation.lat * Math.PI) / 180;
    const deltaLat = ((pickupLocation.lat - agentLocation[0]) * Math.PI) / 180;
    const deltaLng = ((pickupLocation.lng - agentLocation[1]) * Math.PI) / 180;
    const a =
      Math.sin(deltaLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const getDaysUntilPickup = (scheduledDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickupDate = new Date(scheduledDate);
    pickupDate.setHours(0, 0, 0, 0);
    return Math.ceil((pickupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDaysStatus = (days) => {
    if (days < 0) return { text: "Overdue", color: "text-red-600 bg-red-100" };
    if (days === 0) return { text: "Today", color: "text-green-600 bg-green-100" };
    if (days === 1) return { text: "Tomorrow", color: "text-yellow-600 bg-yellow-100" };
    return { text: `${days} days left`, color: "text-blue-600 bg-blue-100" };
  };

  const handleMarkPicked = async (pickupId) => {
    setMarkingPicked(true);
    try {
      const res = await markPickupAsPicked(pickupId);
      if (res.success) {
        setSelectedPickup(null);
        fetchAcceptedPickups();
        navigate(`/ecoagent/rating/${pickupId}`);
      } else {
        setError(res.message || "Failed to update pickup");
      }
    } catch {
      setError("Error marking pickup as picked");
    } finally {
      setMarkingPicked(false);
    }
  };

  // Split pickups
  const householdPickups = pickups.filter((p) => !isIndustrialPickup(p));
  const industrialPickups = pickups.filter((p) => isIndustrialPickup(p));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your accepted pickups...</p>
        </div>
      </div>
    );
  }

  const renderPickupCard = (pickup) => {
    const distance = pickup.coords ? calculateDistance(pickup.coords) : null;
    const daysUntil = getDaysUntilPickup(pickup.scheduled_date);
    const daysStatus = getDaysStatus(daysUntil);
    const isIndustrial = isIndustrialPickup(pickup);

    return (
      <div
        key={pickup._id}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-emerald-100 group hover:-translate-y-1"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Pickup #{pickup._id.slice(-6).toUpperCase()}
          </h2>
          <div className="flex items-center space-x-2">
            {isIndustrial ? (
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-purple-600" />
              </div>
            ) : (
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-emerald-600" />
              </div>
            )}
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              {WasteIcons[pickup.waste_type] || WasteIcons.Default}
            </div>
          </div>
        </div>

        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${daysStatus.color}`}>
          <Timer className="w-3 h-3 mr-1" /> {daysStatus.text}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">{pickup.user?.full_name || pickup.user?.industry_name || "Unknown User"}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600">{pickup.user?.mobile_number || pickup.user?.phone || "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600 truncate">{pickup.user?.address || pickup.user?.localbody_name || "N/A"}</span>
          </div>
          {distance && (
            <div className="flex items-center space-x-2 text-sm">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium">{distance} away</span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">
              {new Date(pickup.scheduled_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-gray-600">{pickup.scheduled_time}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            isIndustrial ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            {isIndustrial ? "Industrial" : "Household"}
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPickup(pickup)}
            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => setMapPickup(pickup)}
            disabled={!pickup.coords || !agentLocation}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
              pickup.coords && agentLocation
                ? "bg-purple-500 text-white hover:bg-purple-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            View Route
          </button>
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accepted Pickups</h1>
          <p className="text-gray-600">Manage your current pickup assignments and mark them as completed</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {/* Today's Pickups Modal */}
        {showTodayModal && todayPickupsCount > 0 && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setShowTodayModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4 mx-auto">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Pickups</h2>
                <p className="text-gray-600 mb-6">
                  You have <span className="font-bold text-green-600">{todayPickupsCount}</span> pickup{todayPickupsCount > 1 ? 's' : ''} scheduled for today!
                </p>
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <p className="text-green-700 text-sm">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Make sure to complete all pickups on time to maintain your excellent rating!
                  </p>
                </div>
                <button
                  onClick={() => setShowTodayModal(false)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Got it! Let's get started
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Household Pickups */}
        {householdPickups.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                <Home className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Household Pickups</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {householdPickups.map(renderPickupCard)}
            </div>
          </div>
        )}

        {/* Industrial Pickups */}
        {industrialPickups.length > 0 && (
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mr-3">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Industrial Pickups</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industrialPickups.map(renderPickupCard)}
            </div>
          </div>
        )}

        {/* No pickups */}
        {householdPickups.length === 0 && industrialPickups.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Accepted Pickups</h3>
            <p className="text-gray-600 mb-6">You haven't accepted any pickup assignments yet.</p>
            <button 
              onClick={() => navigate('/ecoagent/pickups/new')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              View New Pickups
            </button>
          </div>
        )}

        {/* Details Modal */}
        {selectedPickup && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setSelectedPickup(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Pickup Details
              </h2>

              {/* Days Until Pickup in Modal */}
              {selectedPickup.scheduled_date && (
                <div className="mb-4 text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getDaysStatus(getDaysUntilPickup(selectedPickup.scheduled_date)).color}`}>
                    <Timer className="w-4 h-4 mr-2" />
                    {getDaysStatus(getDaysUntilPickup(selectedPickup.scheduled_date)).text}
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Customer Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Name:</span>
                      <span className="text-gray-900">{selectedPickup.user?.full_name || selectedPickup.user?.industry_name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-600" />
                        {selectedPickup.user?.mobile_number || selectedPickup.user?.phone || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Address:</span>
                      <span className="text-gray-900 text-right max-w-[180px] truncate" title={selectedPickup.user?.address}>
                        <MapPin className="w-4 h-4 inline mr-1 text-gray-600" />
                        {selectedPickup.user?.address || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
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
                      <span className="text-gray-900">
                        {new Date(selectedPickup.scheduled_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Time Slot:</span>
                      <span className="text-gray-900">{selectedPickup.scheduled_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Status:</span>
                      <span className="text-green-600 font-medium capitalize">{selectedPickup.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Pickup ID:</span>
                      <span className="text-gray-900 font-mono">#{selectedPickup._id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Home className="w-5 h-5 mr-2 text-gray-600" />
                    Pickup Type
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Type:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isIndustrialPickup(selectedPickup)
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isIndustrialPickup(selectedPickup) ? "Industrial" : "Household"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error in Modal */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-4 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setSelectedPickup(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleMarkPicked(selectedPickup._id)}
                  disabled={markingPicked}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-70 flex items-center justify-center"
                >
                  {markingPicked ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Marking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Waste Collected
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Map Modal */}
        {mapPickup && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[500px] relative overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Route to Pickup
                </h3>
                <button
                  onClick={() => setMapPickup(null)}
                  className="text-white hover:text-emerald-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Pickup Info Bar */}
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <div className="font-medium text-gray-900">
                    {mapPickup.user?.full_name || mapPickup.user?.industry_name}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isIndustrialPickup(mapPickup)
                        ? "bg-purple-100 text-purple-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {isIndustrialPickup(mapPickup) ? "Industrial" : "Household"}
                    </span>
                    <span className="text-gray-600">
                      {WasteIcons[mapPickup.waste_type] || WasteIcons.Default}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-1 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {mapPickup.user?.address || "Address not available"}
                </div>
              </div>

              {/* Map Container */}
              <div className="h-[calc(100%-110px)] w-full">
                {mapPickup.coords && agentLocation ? (
                  <MapContainer
                    center={agentLocation}
                    zoom={14}
                    scrollWheelZoom={true}
                    className="w-full h-full rounded-xl overflow-hidden"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={agentLocation}>
                      <Popup className="font-medium">Your Location</Popup>
                    </Marker>
                    <Marker position={[mapPickup.coords.lat, mapPickup.coords.lng]}>
                      <Popup className="font-medium">
                        <div>Pickup Location</div>
                        <div className="text-xs mt-1">{mapPickup.waste_type}</div>
                      </Popup>
                    </Marker>
                    <Polyline
                      positions={[
                        agentLocation,
                        [mapPickup.coords.lat, mapPickup.coords.lng]
                      ]}
                      color="#10b981"
                      weight={4}
                      opacity={0.8}
                    />
                  </MapContainer>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Location data unavailable</p>
                  </div>
                )}
              </div>

              {/* Distance & ETA Footer */}
              {mapPickup.coords && agentLocation && (
                <div className="p-3 bg-emerald-50 border-t border-emerald-100 text-center">
                  <p className="text-sm text-emerald-700 font-medium">
                    <Navigation className="w-4 h-4 inline mr-1" />
                    Distance: {calculateDistance(mapPickup.coords)} • 
                    Estimated travel time: {calculateDistance(mapPickup.coords)?.includes('m') ? '2-3 min' : '10-15 min'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

