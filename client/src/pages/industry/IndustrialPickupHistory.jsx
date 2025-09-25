import React, { useEffect, useState } from "react";
import { getUserPickups, updatePickup, deletePickup } from "../../services/industry-api";

export default function IndustrialPickupHistory() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ waste_type: "", sheduled_date: "", scheduled_time: "" });

  const fetchPickups = async () => {
    setLoading(true);
    const res = await getUserPickups();
    if (res?.success) setPickups(res.pickups);
    else alert(res?.message || "Failed to fetch pickups");
    setLoading(false);
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const handleEdit = (pickup) => {
    setEditingId(pickup._id);
    setFormData({
      waste_type: pickup.waste_type,
      sheduled_date: pickup.sheduled_date.split("T")[0],
      scheduled_time: pickup.scheduled_time,
    });
  };

  const handleUpdate = async (id) => {
    const res = await updatePickup(id, formData);
    if (res?.success) {
      alert("Pickup updated successfully!");
      setEditingId(null);
      fetchPickups();
    } else alert(res?.message || "Update failed");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pickup?")) {
      const res = await deletePickup(id);
      if (res?.success) {
        alert("Pickup deleted");
        fetchPickups();
      } else alert(res?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Scheduled Pickups</h1>
      {loading ? (
        <p>Loading...</p>
      ) : pickups.length === 0 ? (
        <p>No pickups scheduled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pickups.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow">
              {editingId === p._id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={formData.waste_type}
                    onChange={(e) => setFormData({ ...formData, waste_type: e.target.value })}
                    className="border p-1 rounded"
                  />
                  <input
                    type="date"
                    value={formData.sheduled_date}
                    onChange={(e) => setFormData({ ...formData, sheduled_date: e.target.value })}
                    className="border p-1 rounded"
                  />
                  <input
                    type="text"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    className="border p-1 rounded"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdate(p._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p><strong>Waste Type:</strong> {p.waste_type}</p>
                  <p><strong>Date:</strong> {new Date(p.sheduled_date).toLocaleDateString()}</p>
                  <p><strong>Time Slot:</strong> {p.scheduled_time}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
