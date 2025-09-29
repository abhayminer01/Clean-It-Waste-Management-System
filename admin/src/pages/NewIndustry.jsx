import React, { useEffect, useState } from "react";
import { getNewIndustry, verifyIndustry, rejectIndustry } from "../services/api";
import { Building2, Mail, FileText, MapPin, UserCheck, X, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function NewIndustry() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchIndustries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getNewIndustry();
      if (res?.success) {
        setIndustries(res.data || []);
      } else {
        setError(res?.message || "Failed to fetch industries");
      }
    } catch (error) {
      setError("An error occurred while fetching industries");
      console.error("Error fetching industries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const handleVerify = async (id) => {
    setProcessingId(id);
    try {
      const res = await verifyIndustry(id);
      if (res?.success) {
        setIndustries((prev) => prev.filter((ind) => ind._id !== id));
      } else {
        setError(res?.message || "Failed to verify industry");
      }
    } catch (error) {
      setError("An error occurred during verification");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id, email, name) => {
    if (!window.confirm(`Are you sure you want to reject ${name}? This will send a rejection email to ${email}.`)) {
      return;
    }
    
    setProcessingId(id);
    try {
      const res = await rejectIndustry(id, email, name);
      if (res?.success) {
        setIndustries((prev) => prev.filter((ind) => ind._id !== id));
      } else {
        setError(res?.message || "Failed to reject industry");
      }
    } catch (error) {
      setError("An error occurred during rejection");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading new industrial registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">New Industrial Registrations</h1>
          <p className="text-gray-400">Review and approve new industrial user applications</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {industries.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto border border-gray-700">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No New Registrations</h3>
            <p className="text-gray-400 mb-6">All industrial registrations have been processed.</p>
            <button 
              onClick={fetchIndustries}
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
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-400" />
                    {ind.industry_name}
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-200">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </span>
                </div>

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
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => handleVerify(ind._id)}
                    disabled={processingId === ind._id}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                  >
                    {processingId === ind._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span>{processingId === ind._id ? "Verifying..." : "Verify"}</span>
                  </button>
                  
                  <button
                    onClick={() => handleReject(ind._id, ind.email, ind.industry_name)}
                    disabled={processingId === ind._id}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                  >
                    {processingId === ind._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    <span>{processingId === ind._id ? "Rejecting..." : "Reject"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {industries.length > 0 && (
          <div className="mt-8 bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Pending Approvals</h3>
              </div>
              <div className="text-2xl font-bold text-blue-400">{industries.length}</div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              Review and approve industrial registrations to maintain platform quality and compliance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}