import React, { useEffect, useState } from "react";
import { getAcceptedPickups, markPickupAsPicked } from "../../services/ecoagent-api";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";

export default function AcceptedPickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [mapPickup, setMapPickup] = useState(null);
  const [agentLocation, setAgentLocation] = useState(null);

  const navigate = useNavigate();

  const fetchAcceptedPickups = async () => {
    setLoading(true);
    const res = await getAcceptedPickups();
    if (res?.success) setPickups(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAcceptedPickups();

    // Get agent's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setAgentLocation([position.coords.latitude, position.coords.longitude]);
      },
      (err) => console.error("Location access denied", err)
    );
  }, []);

  const handleMarkPicked = async (pickupId) => {
    const res = await markPickupAsPicked(pickupId);
    if (res?.success) {
      setSelectedPickup(null);
      alert("Pickup marked as picked!");
      navigate(`/ecoagent/rating/${pickupId}`);
    } else {
      alert(res.message || "Failed to update pickup");
    }
  };

  if (loading) return <p>Loading pickups...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Accepted Pickups</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pickups.map((pickup) => {
            const coords = pickup.user?.location_coords;
            const hasValidCoords = coords && coords.lat != null && coords.lng != null;

          return (
            <div
              key={pickup._id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-200 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {pickup.user?.full_name || "Unknown User"}
                </h2>
                <p className="text-sm text-gray-600">
                  Waste: <span className="font-medium">{pickup.waste_type}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Date: <span className="font-medium">{pickup.sheduled_date}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Time: <span className="font-medium">{pickup.scheduled_time}</span>
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => setSelectedPickup(pickup)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                </button>

                 <button
                  onClick={() => setMapPickup(pickup)}
                  disabled={!hasValidCoords || !agentLocation}
                  className={`px-4 py-2 rounded-lg text-white transition ${
                    hasValidCoords && agentLocation
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  View Location
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedPickup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">Pickup Details</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">User:</span>{" "}
                {selectedPickup.user?.full_name} ({selectedPickup.user?.email})
              </p>
              <p>
                <span className="font-medium">Contact:</span>{" "}
                {selectedPickup.user?.phone || "N/A"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {selectedPickup.user?.address || "N/A"}
              </p>
              <p>
                <span className="font-medium">Waste Type:</span> {selectedPickup.waste_type}
              </p>
              <p>
                <span className="font-medium">Pickup Type:</span> {selectedPickup.pickup_type}
              </p>
              <p>
                <span className="font-medium">Scheduled:</span>{" "}
                {selectedPickup.sheduled_date} at {selectedPickup.scheduled_time}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="text-green-600">{selectedPickup.status}</span>
              </p>
              {selectedPickup.payment && (
                <p>
                  <span className="font-medium">Payment:</span>{" "}
                  {selectedPickup.payment.status} (₹{selectedPickup.payment.amount})
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedPickup(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => handleMarkPicked(selectedPickup._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Mark as Picked
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {mapPickup && agentLocation && mapPickup.user?.location_coords && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6">
            <h2 className="text-xl font-bold mb-4">Pickup Location</h2>
            <MapContainer
              center={agentLocation}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={agentLocation}>
                <Popup>Your Location</Popup>
              </Marker>
              <Marker
                position={[
                  mapPickup.user.location_coords.lat,
                  mapPickup.user.location_coords.lng,
                ]}
              >
                <Popup>Pickup Location</Popup>
              </Marker>
              <Polyline
                positions={[
                  agentLocation,
                  [
                    mapPickup.user.location_coords.lat,
                    mapPickup.user.location_coords.lng,
                  ],
                ]}
                color="blue"
              />
            </MapContainer>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setMapPickup(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
