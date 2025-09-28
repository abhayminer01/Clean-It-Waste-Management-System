import React, { useEffect, useState } from "react";
import { getAgentProfile, logoutAgent } from "../../services/ecoagent-api";
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  MapPin, 
  FileText, 
  LogOut, 
  Loader2, 
  AlertCircle,
  Leaf,
  Truck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AgentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAgentProfile();
      if (res?.success) {
        setProfile(res.data);
      } else {
        setError(res?.message || "Failed to load profile");
      }
    } catch (err) {
      setError("An error occurred while loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await logoutAgent();
      if (res?.success) {
        navigate("/ecoagent/login");
      } else {
        setError(res?.message || "Logout failed");
      }
    } catch (err) {
      setError("An error occurred during logout");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Eco Agent Profile</h1>
          <p className="text-gray-600">View your account information and agent details</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          {profile ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mb-4">
                  <User className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.full_name || "N/A"}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">District</p>
                      <p className="font-medium text-gray-900">{profile.district || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Truck className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Agent ID</p>
                      <p className="font-medium text-gray-900"># {profile._id.toString().slice(-6) || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Home className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Local Body</p>
                      <p className="font-medium text-gray-900">{profile.localbody_type || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">
                        {profile.localbody_name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Leaf className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Agent Id</p>
                      <p className="font-medium text-gray-900"># {profile._id.toString().slice(-6) }</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium text-gray-900">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Online
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Profile Data</h3>
              <p className="text-gray-600">Unable to load your profile information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}