import React, { useEffect, useState } from "react";
import { getAllPickups, deletePickup } from "../services/api";

export default function ManagePickups() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPickups = async () => {
    setLoading(true);
    const res = await getAllPickups();
    if (res?.success) {
      setPickups(res.data);
    } else {
      setPickups([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pickup?")) return;

    const res = await deletePickup(id);
    if (res?.success) {
      setPickups(pickups.filter((p) => p._id !== id));
    } else {
      alert(res?.message || "Failed to delete pickup");
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  if (loading) {
    return <p className="text-center mt-6">Loading pickups...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Pickups</h1>

      {pickups.length === 0 ? (
        <p>No pickups found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pickups.map((pickup) => (
            <div
              key={pickup._id}
              className="bg-white shadow-md rounded-xl p-4 border"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-800">
                Waste Type: {pickup.waste_type}
              </h2>
              <p>
                <strong>Date:</strong> {pickup.sheduled_date}
              </p>
              <p>
                <strong>Time:</strong> {pickup.scheduled_time}
              </p>
              <p>
                <strong>Status:</strong> {pickup.status}
              </p>
              <p className="mt-2 text-gray-700">
                <strong>User:</strong>{" "}
                {pickup.user
                  ? `${pickup.user.full_name} (${pickup.user.email})`
                  : "Unknown"}
              </p>
              <button
                onClick={() => handleDelete(pickup._id)}
                className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
