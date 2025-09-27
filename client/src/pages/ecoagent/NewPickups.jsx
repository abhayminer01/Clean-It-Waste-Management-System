// pages/NewPickups.jsx
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { getNewPickups, acceptPickup } from "../../services/ecoagent-api";

Modal.setAppElement("#root");

export default function NewPickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    setLoading(true);
    const res = await getNewPickups();
    if (res?.success) {
      setPickups(res.pickups || []);
    } else {
      alert(res?.message || "Failed to fetch pickups");
    }
    setLoading(false);
  };

  const handleAcceptPickup = async (pickupId) => {
    setAccepting(true);
    const res = await acceptPickup(pickupId);
    if (res?.success) {
      alert("Pickup accepted successfully!");
      setSelectedPickup(null); // close modal
      fetchPickups(); // refresh list
    } else {
      alert(res.message || "Failed to accept pickup");
    }
    setAccepting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">New Pickups</h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : pickups.length === 0 ? (
          <div className="text-center text-gray-600 py-16 bg-white rounded-xl shadow">
            <p className="text-xl font-semibold mb-2">No new pickups</p>
            <p>All requests are processed. Check back later.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pickups.map((p) => (
              <div
                key={p._id}
                onClick={() => setSelectedPickup(p)}
                className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  Pickup #{p._id.slice(-6)}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {p.user.full_name} — {p.waste_type}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(p.scheduled_date).toLocaleDateString()} •{" "}
                  {p.scheduled_time}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!selectedPickup}
        onRequestClose={() => setSelectedPickup(null)}
        className="fixed inset-0 flex items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60"
      >
        {selectedPickup && (
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Pickup #{selectedPickup._id.slice(-6)}
            </h2>

            {/* User Info */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Name:</span>{" "}
                {selectedPickup.user.full_name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Address:</span>{" "}
                {selectedPickup.user.address}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Phone:</span>{" "}
                {selectedPickup.user.mobile_number}
              </p>
            </div>

            {/* Pickup Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Waste Type:</span>{" "}
                {selectedPickup.waste_type}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Scheduled:</span>{" "}
                {new Date(selectedPickup.scheduled_date).toLocaleDateString()} •{" "}
                {selectedPickup.scheduled_time}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedPickup(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => handleAcceptPickup(selectedPickup._id)}
                disabled={accepting}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {accepting ? "Accepting..." : "Accept Pickup"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
