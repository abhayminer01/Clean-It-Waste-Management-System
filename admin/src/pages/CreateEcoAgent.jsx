import React, { useState, useEffect } from "react";
import localbodyData from "../services/localbody.json";
import { createAgent } from "../services/api";
import { 
  User, 
  Lock, 
  MapPin, 
  Building2, 
  Loader2, 
  AlertCircle, 
  CheckCircle,
  Plus
} from 'lucide-react';

export default function CreateEcoAgent() {
  const [district, setDistrict] = useState("");
  const [localbodyType, setLocalbodyType] = useState("");
  const [localbodyOptions, setLocalbodyOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const districts = Object.keys(localbodyData);

  useEffect(() => {
    if (district && localbodyType) {
      const options = localbodyData[district]?.[localbodyType] || [];
      setLocalbodyOptions(options);
    } else {
      setLocalbodyOptions([]);
    }
  }, [district, localbodyType]);

  const handleForm = async (e) => {
    e.preventDefault();

    const form = e.target;
    const fullname = form.fullname.value.trim();
    const password = form.password.value.trim();
    const confirm = form.confirm.value.trim();
    const localbody_name = form.localbodyname.value;

    // Validation
    if (!fullname || !password || !confirm || !district || !localbodyType || !localbody_name) {
      setError("All fields are mandatory");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const payload = {
      fullname,
      password,
      district,
      localbody_type: localbodyType,
      localbody_name,
    };

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      const res = await createAgent(payload);
      if (res?.success) {
        setSuccess(`✅ Agent created successfully! Agent ID: ${res.data.id}`);
        form.reset();
        setDistrict("");
        setLocalbodyType("");
        setLocalbodyOptions([]);
      } else {
        setError(res?.message || "Failed to create agent");
      }
    } catch (error) {
      console.error(error);
      setError("Error while creating agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Eco Agent</h1>
          <p className="text-gray-400">Register a new eco agent for waste collection assignments</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center mb-6">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg text-sm flex items-center mb-6">
            <CheckCircle className="w-4 h-4 mr-2" />
            {success}
          </div>
        )}

        <form onSubmit={handleForm} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name
              </label>
              <input
                name="fullname"
                type="text"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter agent's full name"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Password
              </label>
              <input
                name="password"
                type="password"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Create a strong password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Confirm Password
              </label>
              <input
                name="confirm"
                type="password"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                District
              </label>
              <select
                name="district"
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setLocalbodyType("");
                }}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                required
              >
                <option value="" className="text-gray-500">-- Select District --</option>
                {districts.map((dist) => (
                  <option key={dist} value={dist} className="text-gray-200 bg-gray-800">
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Localbody Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Building2 className="w-4 h-4 inline mr-1" />
                Localbody Type
              </label>
              <select
                name="localbodytype"
                value={localbodyType}
                onChange={(e) => setLocalbodyType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                required
                disabled={!district}
              >
                <option value="" className="text-gray-500">-- Select Type --</option>
                {district && (
                  <>
                    {localbodyData[district]?.corporation?.length > 0 && (
                      <option value="corporation" className="text-gray-200 bg-gray-800">Corporation</option>
                    )}
                    {localbodyData[district]?.municipality?.length > 0 && (
                      <option value="municipality" className="text-gray-200 bg-gray-800">Municipality</option>
                    )}
                    {localbodyData[district]?.panchayath?.length > 0 && (
                      <option value="panchayath" className="text-gray-200 bg-gray-800">Panchayath</option>
                    )}
                  </>
                )}
              </select>
            </div>

            {/* Localbody Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Localbody Name
              </label>
              <select
                name="localbodyname"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200"
                required
                disabled={!localbodyType}
              >
                <option value="" className="text-gray-500">-- Select Localbody --</option>
                {localbodyOptions.map((name) => (
                  <option key={name} value={name} className="text-gray-200 bg-gray-800">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Agent...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Agent
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}