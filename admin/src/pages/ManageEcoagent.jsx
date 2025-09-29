import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEcoAgents, deleteEcoAgent, updateEcoAgent } from "../services/api";
import { 
  User, 
  MapPin, 
  Clipboard, 
  Trash2, 
  Edit3, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Plus,
  Building2
} from "lucide-react";

export default function ManageEcoagent() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    district: "",
    localbody_type: "",
    localbody_name: "",
  });
  const [processingId, setProcessingId] = useState(null);

  const fetchAgents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllEcoAgents();
      if (res?.success) {
        setAgents(res.data || []);
      } else {
        setError(res?.message || "Failed to fetch eco agents");
      }
    } catch (err) {
      setError("An error occurred while loading eco agents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this eco agent? This action cannot be undone.")) {
      return;
    }
    
    setProcessingId(id);
    try {
      const res = await deleteEcoAgent(id);
      if (res?.success) {
        setAgents(agents.filter(agent => agent._id !== id));
      } else {
        setError(res?.message || "Failed to delete eco agent");
      }
    } catch (err) {
      setError("An error occurred during deletion");
    } finally {
      setProcessingId(null);
    }
  };

  const copyId = (id) => {
    navigator.clipboard.writeText(id.slice(-6));
    // Optional: Show temporary success message instead of alert
    const successMsg = document.createElement('div');
    successMsg.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successMsg.textContent = 'Agent ID copied: ' + id.slice(-6);
    document.body.appendChild(successMsg);
    setTimeout(() => document.body.removeChild(successMsg), 2000);
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
    setProcessingId(editingAgent);
    
    try {
      const payload = {
        fullname: formData.full_name,
        district: formData.district,
        localbody_type: formData.localbody_type,
        localbody_name: formData.localbody_name,
      };

      const res = await updateEcoAgent(editingAgent, payload);
      if (res?.success) {
        setAgents(agents.map(agent => 
          agent._id === editingAgent ? { ...agent, ...res.data } : agent
        ));
        setEditingAgent(null);
        setFormData({
          full_name: "",
          district: "",
          localbody_type: "",
          localbody_name: ""
        });
      } else {
        setError(res?.message || "Update failed");
      }
    } catch (err) {
      setError("An error occurred during update");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading eco agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Manage Eco Agents</h1>
          </div>
          <button
            onClick={() => navigate("/ecoagent/create")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Agent</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {agents.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto border border-gray-700">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Eco Agents Found</h3>
            <p className="text-gray-400 mb-6">There are no eco agents registered in the system yet.</p>
            <button 
              onClick={() => navigate("/ecoagent/create")}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Create First Agent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent._id}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 hover:shadow-xl transition-all duration-300"
              >
                {/* Agent Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-400" />
                    {agent.full_name}
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                    <span>#{agent._id.slice(-6).toUpperCase()}</span>
                  </span>
                </div>

                {/* Agent Details */}
                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">District:</span>
                      <p className="text-white">{agent.district || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">Localbody:</span>
                      <p className="text-white">
                        {agent.localbody_type || "N/A"} - {agent.localbody_name || "N/A"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className="text-white">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-900 text-emerald-200">
                          Active
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={() => copyId(agent._id)}
                    disabled={processingId === agent._id}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition disabled:opacity-50"
                  >
                    <Clipboard className="w-4 h-4" />
                    <span>Copy ID</span>
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(agent)}
                      disabled={processingId === agent._id}
                      className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm transition disabled:opacity-50"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(agent._id)}
                      disabled={processingId === agent._id}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition disabled:opacity-50"
                    >
                      {processingId === agent._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span>{processingId === agent._id ? "Deleting..." : "Delete"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {agents.length > 0 && (
          <div className="mt-8 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">Total Eco Agents</h3>
              </div>
              <div className="text-2xl font-bold text-green-400">{agents.length}</div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Manage eco agent accounts and monitor their assignment coverage.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Edit Eco Agent</h2>
              <button
                onClick={() => setEditingAgent(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter district"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Localbody Type</label>
                <input
                  type="text"
                  value={formData.localbody_type}
                  onChange={(e) => setFormData({ ...formData, localbody_type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter localbody type"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Localbody Name</label>
                <input
                  type="text"
                  value={formData.localbody_name}
                  onChange={(e) => setFormData({ ...formData, localbody_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  placeholder="Enter localbody name"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingAgent(null)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingId === editingAgent}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition disabled:opacity-70"
                >
                  {processingId === editingAgent ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    "Update Agent"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for X icon
const X = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);