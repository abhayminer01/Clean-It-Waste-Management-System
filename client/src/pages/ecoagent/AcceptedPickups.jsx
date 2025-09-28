import React, { useEffect, useState } from "react";
import { getAcceptedPickups, markPickupAsPicked } from "../../services/ecoagent-api";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from 'leaflet';
import { Truck, User, MapPin, Calendar, Clock, CheckCircle, AlertCircle, Loader2, Phone, Home, Navigation, Timer, Bell } from 'lucide-react';

// Fix for leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function AcceptedPickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [mapPickup, setMapPickup] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null);
  const [error, setError] = useState("");
  const [markingPicked, setMarkingPicked] = useState(false);
  const [todayPickupsModal, setTodayPickupsModal] = useState(false);
  const [todayPickupsCount, setTodayPickupsCount] = useState(0);

  const navigate = useNavigate();

  const fetchAcceptedPickups = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await getAcceptedPickups();
      if (res?.success) {
        const pickupData = res.data || [];
        setPickups(pickupData);
        
        // Calculate today's pickups
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPickups = pickupData.filter(pickup => {
          const pickupDate = new Date(pickup.sheduled_date);
          pickupDate.setHours(0, 0, 0, 0);
          return pickupDate.getTime() === today.getTime();
        });
        setTodayPickupsCount(todayPickups.length);
        
        // Show modal if there are pickups for today
        if (todayPickups.length > 0) {
          setTodayPickupsModal(true);
        }
      } else {
        setError(res?.message || "Failed to fetch accepted pickups");
      }
    } catch (err) {
      setError("An error occurred while loading pickups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcceptedPickups();

    // Get agent's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAgentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => {
          console.error("Location access denied", err);
          setError("Location access is required to view pickup locations and optimize routes");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  const handleMarkPicked = async (pickupId) => {
    setMarkingPicked(true);
    setError("");
    
    try {
      const res = await markPickupAsPicked(pickupId);
      if (res?.success) {
        setSelectedPickup(null);
        fetchAcceptedPickups();
        navigate(`/ecoagent/rating/${pickupId}`);
      } else {
        setError(res?.message || "Failed to update pickup");
      }
    } catch (err) {
      setError("An error occurred while marking pickup as picked");
    } finally {
      setMarkingPicked(false);
    }
  };

  const calculateDistance = (pickupLocation) => {
    if (!agentLocation || !pickupLocation) return null;
    
    const R = 6371; // Earth's radius in kilometers
    const lat1 = agentLocation[0] * Math.PI / 180;
    const lat2 = pickupLocation.lat * Math.PI / 180;
    const deltaLat = (pickupLocation.lat - agentLocation[0]) * Math.PI / 180;
    const deltaLng = (pickupLocation.lng - agentLocation[1]) * Math.PI / 180;
    
    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const getDaysUntilPickup = (scheduledDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const pickupDate = new Date(scheduledDate);
    pickupDate.setHours(0, 0, 0, 0);
    
    const diffTime = pickupDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getDaysStatus = (days) => {
    if (days < 0) return { text: "Overdue", color: "text-red-600 bg-red-100" };
    if (days === 0) return { text: "Today", color: "text-green-600 bg-green-100" };
    if (days === 1) return { text: "Tomorrow", color: "text-yellow-600 bg-yellow-100" };
    return { text: `${days} days left`, color: "text-blue-600 bg-blue-100" };
  };

  const getWasteIcon = (wasteType) => {
    switch (wasteType) {
      case 'Plastic': return <Recycle className="w-5 h-5 text-blue-600" />;
      case 'Organic': return <Leaf className="w-5 h-5 text-green-600" />;
      case 'E-Waste': return <Monitor className="w-5 h-5 text-purple-600" />;
      case 'Scrap': return <Hammer className="w-5 h-5 text-orange-600" />;
      default: return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

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

        {pickups.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pickups.map((pickup) => {
              const hasValidCoords = pickup.user?.location_coords?.lat != null && pickup.user?.location_coords?.lng != null;
              const distance = hasValidCoords ? calculateDistance(pickup.user.location_coords) : null;
              const daysUntilPickup = getDaysUntilPickup(pickup.sheduled_date);
              const daysStatus = getDaysStatus(daysUntilPickup);

              return (
                <div
                  key={pickup._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-emerald-100"
                >
                  {/* Pickup Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Pickup #{pickup._id.slice(-6).toUpperCase()}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {getWasteIcon(pickup.waste_type)}
                    </div>
                  </div>

                  {/* Days Until Pickup Badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3 ${daysStatus.color}`}>
                    <Timer className="w-3 h-3 mr-1" />
                    {daysStatus.text}
                  </div>

                  {/* User Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="font-medium text-gray-900">{pickup.user?.full_name || "Unknown User"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600">{pickup.user?.mobile_number || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600 truncate">{pickup.user?.address || "N/A"}</span>
                    </div>
                    {distance && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Navigation className="w-4 h-4 text-blue-600" />
                        <span className="text-blue-600 font-medium">{distance} away</span>
                      </div>
                    )}
                  </div>

                  {/* Schedule Info */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-600">
                        {new Date(pickup.sheduled_date).toLocaleDateString('en-US', {
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

                  {/* Waste Type Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {pickup.waste_type}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedPickup(pickup)}
                      className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => setMapPickup(pickup)}
                      disabled={!hasValidCoords || !agentLocation}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                        hasValidCoords && agentLocation
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      View Route
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Today's Pickups Modal */}
        {todayPickupsModal && todayPickupsCount > 0 && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
              <button
                onClick={() => setTodayPickupsModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4 mx-auto">
                  <Bell className="w-8 h-8 text-green-600" />
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
                  onClick={() => setTodayPickupsModal(false)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Got it! Let's get started
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {selectedPickup && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
              {/* Close Button */}
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
              {selectedPickup.sheduled_date && (
                <div className="mb-4 text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getDaysStatus(getDaysUntilPickup(selectedPickup.sheduled_date)).color}`}>
                    <Timer className="w-4 h-4 mr-2" />
                    {getDaysStatus(getDaysUntilPickup(selectedPickup.sheduled_date)).text}
                  </div>
                </div>
              )}

              {/* User Information */}
              <div className="space-y-4 mb-6">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Customer Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Name:</span>
                      <span className="text-gray-900">{selectedPickup.user?.full_name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Email:</span>
                      <span className="text-gray-900">{selectedPickup.user?.email || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-600" />
                        {selectedPickup.user?.mobile_number || "N/A"}
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

                {/* Pickup Information */}
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
                        {new Date(selectedPickup.sheduled_date).toLocaleDateString('en-US', {
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

                {/* Payment Information */}
                {selectedPickup.payment && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                      Payment Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          selectedPickup.payment.status === 'succeeded' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {selectedPickup.payment.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Amount:</span>
                        <span className="text-gray-900">₹{(selectedPickup.payment.amount / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
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
        {mapPickup && agentLocation && mapPickup.user?.location_coords && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setMapPickup(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Route to Pickup Location
              </h2>
              
              {/* Days Until Pickup in Map Modal */}
              {mapPickup.sheduled_date && (
                <div className="mb-4 text-center">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getDaysStatus(getDaysUntilPickup(mapPickup.sheduled_date)).color}`}>
                    <Timer className="w-4 h-4 mr-2" />
                    {getDaysStatus(getDaysUntilPickup(mapPickup.sheduled_date)).text}
                  </div>
                </div>
              )}
              
              <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
                <p className="text-sm text-emerald-700 font-medium">
                  <Navigation className="w-4 h-4 inline mr-1" />
                  Distance: {calculateDistance(mapPickup.user.location_coords)} • 
                  Estimated travel time: {calculateDistance(mapPickup.user.location_coords)?.includes('m') ? '2-3 min' : '10-15 min'}
                </p>
              </div>

              <div className="h-96 w-full rounded-xl overflow-hidden border border-gray-300">
                <MapContainer
                  center={agentLocation}
                  zoom={14}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={agentLocation}>
                    <Popup>Your Current Location</Popup>
                  </Marker>
                  <Marker
                    position={[
                      mapPickup.user.location_coords.lat,
                      mapPickup.user.location_coords.lng,
                    ]}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-bold">{mapPickup.user?.full_name}</h3>
                        <p className="text-sm">{mapPickup.waste_type} Pickup</p>
                        <p className="text-xs mt-1">{mapPickup.user?.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                  <Polyline
                    positions={[
                      agentLocation,
                      [
                        mapPickup.user.location_coords.lat,
                        mapPickup.user.location_coords.lng,
                      ],
                    ]}
                    color="#10b981"
                    weight={4}
                    opacity={0.8}
                  />
                </MapContainer>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Navigate to the pickup location using your preferred navigation app
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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

const X = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CreditCard = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);