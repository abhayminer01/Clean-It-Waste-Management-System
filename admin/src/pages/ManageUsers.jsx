import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  MapPin, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllUsers();
      if (res?.success) {
        setUsers(res.data || []);
      } else {
        setError(res?.message || "Failed to fetch users");
        setUsers([]);
      }
    } catch (err) {
      setError("An error occurred while loading users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    
    setDeletingId(id);
    try {
      const res = await deleteUser(id);
      if (res?.success) {
        setUsers(users.filter((u) => u._id !== id));
      } else {
        setError(res?.message || "Failed to delete user");
      }
    } catch (err) {
      setError("An error occurred during deletion");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading user accounts...</p>
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
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage User Accounts</h1>
          <p className="text-gray-400">View and manage all residential user accounts</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto border border-gray-700">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Users Found</h3>
            <p className="text-gray-400 mb-6">There are no residential user accounts in the system.</p>
            <button 
              onClick={fetchUsers}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Refresh List
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/users/${user._id}`)}
                className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 hover:shadow-xl transition-all duration-300 cursor-pointer group"
              >
                {/* User Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-400" />
                    {user.full_name || "Unknown User"}
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-900 text-emerald-200">
                    Residential
                  </span>
                </div>

                {/* User Details */}
                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex items-start space-x-2">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="text-white break-words">{user.email || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">Mobile:</span>
                      <p className="text-white">{user.mobile_number || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <Home className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">Address:</span>
                      <p className="text-white break-words">{user.address || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="text-white">
                        {user.district || "N/A"} • {user.localbody_type || "N/A"} - {user.localbody_name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDelete(e, user._id)}
                  disabled={deletingId === user._id}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-70 flex items-center justify-center space-x-2"
                >
                  {deletingId === user._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>{deletingId === user._id ? "Deleting..." : "Delete User"}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {users.length > 0 && (
          <div className="mt-8 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Total Users</h3>
              </div>
              <div className="text-2xl font-bold text-blue-400">{users.length}</div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Manage residential user accounts and monitor platform engagement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}