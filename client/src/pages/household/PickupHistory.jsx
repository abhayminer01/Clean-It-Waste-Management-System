import React, { useEffect, useState } from "react";
import { getUserPickups, deletePickup, updatePickup } from "../../services/user-api";

export default function PickupHistory() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // pickup being edited
  const [formData, setFormData] = useState({ wasteType: "", pickupDate: "", timeSlot: "" });

  useEffect(() => {
    async function fetchData() {
      const res = await getUserPickups();
      if (res?.success) {
        setPickups(res.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pickup?")) return;
    const res = await deletePickup(id);
    if (res?.success) {
      setPickups(pickups.filter((p) => p._id !== id));
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
    const res = await updatePickup(id, formData);
    if (res?.success) {
      setPickups(pickups.map((p) => (p._id === id ? res.data : p)));
      setEditing(null);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (pickups.length === 0) {
    return <p className="text-center mt-10 text-gray-600">No pickups found.</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pickups.map((pickup) => (
        <div key={pickup._id} className="bg-white shadow-lg rounded-2xl p-6 border">
          {editing === pickup._id ? (
            <>
              <h2 className="text-xl font-bold text-blue-700 mb-2">Edit Pickup</h2>
              <div className="mb-2">
                <label className="block">Waste Type:</label>
                <select
                  value={formData.wasteType}
                  onChange={(e) => setFormData({ ...formData, wasteType: e.target.value })}
                  className="border p-1 rounded w-full"
                >
                  <option value="Plastic">Plastic</option>
                  <option value="Organic">Organic</option>
                  <option value="E-Waste">E-Waste</option>
                  <option value="Scrap">Scrap</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block">Pickup Date:</label>
                <input
                  type="date"
                  value={formData.pickupDate}
                  onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  className="border p-1 rounded w-full"
                />
              </div>
              <div className="mb-2">
                <label className="block">Time Slot:</label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="border p-1 rounded w-full"
                >
                  <option value="Morning (8AM - 10AM)">Morning (8AM - 10AM)</option>
                  <option value="Afternoon (11PM - 2PM)">Afternoon (11PM - 2PM)</option>
                  <option value="Evening (3PM - 5PM)">Evening (3PM - 5PM)</option>
                </select>
              </div>
              <button
                onClick={() => handleUpdate(pickup._id)}
                className="bg-green-500 text-white px-4 py-1 rounded-lg mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(null)}
                className="bg-gray-400 text-white px-4 py-1 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-green-700 mb-2">{pickup.waste_type}</h2>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Date:</span> {pickup.sheduled_date}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Time:</span> {pickup.scheduled_time}
              </p>
              <p className="text-sm text-yellow-600 mt-2">Status: {pickup.status}</p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEditClick(pickup)}
                  className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pickup._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
