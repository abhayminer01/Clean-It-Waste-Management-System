import React, { useEffect, useState } from "react";
import { getIndustries } from "../services/api";
import { 
  Building2, 
  Mail, 
  FileText, 
  MapPin, 
  UserCheck, 
  Trash2, 
  Send, 
  Edit3, 
  Loader2, 
  AlertCircle, 
  CheckCircle ,
  Phone
} from 'lucide-react';

export default function ManageIndustry() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const res = await getIndustries();
        if (res?.success) {
          setIndustries(res.data || []);
        } else {
          setError(res?.message || "Failed to fetch industries");
        }
      } catch (err) {
        setError("An error occurred while fetching industries");
        console.error("Error fetching industries:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this industry? This action cannot be undone.")) {
      return;
    }
    
    setProcessingId(id);
    try {
      const res = await deleteIndustry(id);
      if (res?.success) {
        setIndustries(prev => prev.filter(ind => ind._id !== id));
      } else {
        setError(res?.message || "Failed to delete industry");
      }
    } catch (err) {
      setError("An error occurred during deletion");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendNotification = async (id, email, name) => {
    const message = prompt(`Enter notification message for ${name}:`);
    if (!message) return;
    
    setProcessingId(id);
    try {
      const res = await sendNotification(id, { message, email, name });
      if (res?.success) {
        alert("Notification sent successfully!");
      } else {
        setError(res?.message || "Failed to send notification");
      }
    } catch (err) {
      setError("An error occurred while sending notification");
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (industry) => {
    setEditingId(industry._id);
    setEditFormData({
      industry_name: industry.industry_name,
      email: industry.email,
      phone: industry.phone || industry.contact || "",
      address: industry.address,
      district: industry.district,
      localbody_type: industry.localbody_type,
      localbody_name: industry.localbody_name,
      licence: industry.licence
    });
  };

  const handleSaveEdit = async (id) => {
    setProcessingId(id);
    try {
      const res = await updateIndustry(id, editFormData);
      if (res?.success) {
        setIndustries(prev => 
          prev.map(ind => ind._id === id ? { ...ind, ...res.data } : ind)
        );
        setEditingId(null);
        setEditFormData({});
      } else {
        setError(res?.message || "Failed to update industry");
      }
    } catch (err) {
      setError("An error occurred during update");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading industrial accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Industrial Accounts</h1>
          <p className="text-gray-400">View, edit, and manage all verified industrial user accounts</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {industries.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto border border-gray-700">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Industrial Accounts</h3>
            <p className="text-gray-400 mb-6">No industrial accounts have been registered yet.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Refresh List
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind) => (
              <div
                key={ind._id}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 hover:shadow-xl transition-all duration-300"
              >
                {editingId === ind._id ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white mb-3">Edit Industry</h3>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Industry Name</label>
                      <input
                        type="text"
                        value={editFormData.industry_name}
                        onChange={(e) => setEditFormData({...editFormData, industry_name: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Phone</label>
                      <input
                        type="text"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Address</label>
                      <input
                        type="text"
                        value={editFormData.address}
                        onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">District</label>
                        <input
                          type="text"
                          value={editFormData.district}
                          onChange={(e) => setEditFormData({...editFormData, district: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Licence</label>
                        <input
                          type="text"
                          value={editFormData.licence}
                          onChange={(e) => setEditFormData({...editFormData, licence: e.target.value})}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => handleSaveEdit(ind._id)}
                        disabled={processingId === ind._id}
                        className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-sm disabled:opacity-70"
                      >
                        {processingId === ind._id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditFormData({});
                        }}
                        className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Industry Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-white flex items-center">
                        <Building2 className="w-5 h-5 mr-2 text-blue-400" />
                        {ind.industry_name}
                      </h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ind.status)}`}>
                        {ind.status}
                      </span>
                    </div>

                    {/* Industry Details */}
                    <div className="space-y-3 mb-4 text-sm">
                      <div className="flex items-start space-x-2">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <p className="text-white break-words">{ind.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-gray-500">Licence:</span>
                          <p className="text-white">{ind.licence}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-gray-500">Address:</span>
                          <p className="text-white break-words">{ind.address}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <UserCheck className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <p className="text-white">
                            {ind.district} • {ind.localbody_type} - {ind.localbody_name}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <p className="text-white">{ind.phone || ind.contact || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-2 pt-4">
                      <button
                        onClick={() => handleDelete(ind._id)}
                        disabled={processingId === ind._id}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded-lg text-xs disabled:opacity-70 flex items-center justify-center space-x-1"
                      >
                        {processingId === ind._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                        <span>Delete</span>
                      </button>
                      
                      <button
                        onClick={() => handleSendNotification(ind._id, ind.email, ind.industry_name)}
                        disabled={processingId === ind._id}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 rounded-lg text-xs disabled:opacity-70 flex items-center justify-center space-x-1"
                      >
                        {processingId === ind._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        <span>Notify</span>
                      </button>
                      
                      <button
                        onClick={() => handleEdit(ind)}
                        disabled={processingId === ind._id}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-2 rounded-lg text-xs disabled:opacity-70 flex items-center justify-center space-x-1"
                      >
                        {processingId === ind._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Edit3 className="w-3 h-3" />}
                        <span>Edit</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {industries.length > 0 && (
          <div className="mt-8 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Total Industries</h3>
              </div>
              <div className="text-2xl font-bold text-blue-400">{industries.length}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
              <div className="text-center p-2 bg-green-900/30 rounded-lg">
                <div className="font-bold text-green-400">
                  {industries.filter(i => i.status === 'verified').length}
                </div>
                <div className="text-gray-400">Verified</div>
              </div>
              <div className="text-center p-2 bg-red-900/30 rounded-lg">
                <div className="font-bold text-red-400">
                  {industries.filter(i => i.status === 'rejected').length}
                </div>
                <div className="text-gray-400">Rejected</div>
              </div>
              <div className="text-center p-2 bg-yellow-900/30 rounded-lg">
                <div className="font-bold text-yellow-400">
                  {industries.filter(i => i.status === 'pending').length}
                </div>
                <div className="text-gray-400">Pending</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}