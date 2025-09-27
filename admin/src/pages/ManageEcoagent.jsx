import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEcoAgents, deleteEcoAgent, updateEcoAgent } from "../services/api";
import { Clipboard, Trash2, Edit } from "lucide-react";

export default function ManageEcoagent() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    district: "",
    localbody_type: "",
    localbody_name: "",
  });

  const fetchAgents = async () => {
    setLoading(true);
    const res = await getAllEcoAgents();
    if (res?.success) {
      setAgents(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      const res = await deleteEcoAgent(id);
      if (res?.success) {
        fetchAgents();
      }
    }
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id.slice(-6));
    alert("Agent Login ID copied: " + id.slice(-6));
  };

  const handleEditClick = (agent) => {
    setEditingAgent(agent._id);
    setFormData({
      full_name: agent.full_name,
      district: agent.district,
      localbody_type: agent.localbody_type,
      localbody_name: agent.localbody_name,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      fullname: formData.full_name,
      district: formData.district,
      localbody_type: formData.localbody_type,
      localbody_name: formData.localbody_name,
    };

    const res = await updateEcoAgent(editingAgent, payload);
    if (res?.success) {
      alert("Agent updated successfully");
      fetchAgents();
      setEditingAgent(null);
    } else {
      alert(res.message || "Update failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Eco Agents</h1>
        <button
          onClick={() => navigate("/ecoagent/create")}
          className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          + Create Eco Agent
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading agents...</p>
      ) : agents.length === 0 ? (
        <p className="text-gray-500">No eco agents found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div
              key={agent._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {agent.full_name}
                </h2>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 text-xs font-medium rounded-full">
                  #{agent._id.slice(-6)}
                </span>
              </div>

              {/* Body */}
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <span className="font-medium">District:</span> {agent.district}
                </p>
                <p>
                  <span className="font-medium">Localbody Type:</span> {agent.localbody_type}
                </p>
                <p>
                  <span className="font-medium">Localbody Name:</span> {agent.localbody_name}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => copyId(agent._id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
                >
                  <Clipboard size={16} /> Copy ID
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(agent)}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-600 transition"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(agent._id)}
                    className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingAgent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Eco Agent</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="District"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Localbody Type"
                value={formData.localbody_type}
                onChange={(e) => setFormData({ ...formData, localbody_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Localbody Name"
                value={formData.localbody_name}
                onChange={(e) => setFormData({ ...formData, localbody_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
