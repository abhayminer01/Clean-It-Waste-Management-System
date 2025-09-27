import React, { useEffect, useState } from "react";
import { getUserPickups, updatePickup, deletePickup } from "../../services/industry-api";

export default function IndustrialPickupHistory() {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    waste_type: "",
    sheduled_date: "",
    scheduled_time: "",
  });

  const fetchPickups = async () => {
    setLoading(true);
    const res = await getUserPickups();
    console.log(res);
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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Your Scheduled Pickups
      </h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : pickups.length === 0 ? (
        <p className="text-gray-500">No pickups scheduled yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pickups.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100"
            >
              {editingId === p._id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={formData.waste_type}
                    onChange={(e) =>
                      setFormData({ ...formData, waste_type: e.target.value })
                    }
                    className="border p-2 rounded"
                    placeholder="Waste Type"
                  />
                  <input
                    type="date"
                    value={formData.sheduled_date}
                    onChange={(e) =>
                      setFormData({ ...formData, sheduled_date: e.target.value })
                    }
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={formData.scheduled_time}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduled_time: e.target.value })
                    }
                    className="border p-2 rounded"
                    placeholder="Time Slot"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleUpdate(p._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Pickup Details */}
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    #{p._id.slice(-6)}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Waste Type:</span> {p.waste_type}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(p.sheduled_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Time Slot:</span> {p.scheduled_time}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status: </span> 
                    <span
                          className={`px-2 py-0.5 rounded-full font-medium ${
                            p.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {p.status}
                      </span>
                  </p>

                  {/* Payment Details if available */}
                  {p.payment ? (
                    <div className="text-sm text-gray-600 mt-3 space-y-1">
                      <p>
                        <span className="font-medium">Payment Status:</span>{" "}
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium ${
                            p.payment.status === "succeeded"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {p.payment.status}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Amount:</span> ₹
                        {(p.payment.amount / 100).toFixed(2)}
                      </p>
                      {p.payment.createdAt && (
                        <p>
                          <span className="font-medium">Paid On:</span>{" "}
                          {new Date(p.payment.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500 mt-3">
                      Payment not available
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
