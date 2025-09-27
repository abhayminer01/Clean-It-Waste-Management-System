import React, { useState } from 'react';
import { userLogin } from '../services/auth-api';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, MapPin, Building, Leaf, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const location = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            const payload = { email, password, location };
            const res = await userLogin(payload);

            setIsLoading(false);
            if (res?.success) {
              navigate("/home");
            } else {
              setError(res?.message || "Login failed!");
            }
          },
          (err) => {
            console.error("Location error:", err);

            const payload = { email, password };
            userLogin(payload).then((res) => {
              setIsLoading(false);
              if (res?.success) {
                navigate("/home");
              } else {
                setError(res?.message || "Login failed!");
              }
            }).catch(() => {
              setIsLoading(false);
              setError("Login failed!");
            });
          }
        );
      } else {
        const payload = { email, password };
        const res = await userLogin(payload);
        setIsLoading(false);
        if (res?.success) {
          navigate("/home");
        } else {
          setError(res?.message || "Login failed!");
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue your eco-friendly journey</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleForm} className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Location Info */}
            <div className="flex items-center text-sm text-gray-600 bg-emerald-50 rounded-lg p-3">
              <MapPin className="w-4 h-4 mr-2 text-emerald-600" />
              <span>Location access helps optimize pickup routes</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>

        {/* Alternative Login Options */}
        <div className="mt-8 space-y-4">
          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors"
                disabled={isLoading}
              >
                Create Account
              </button>
            </p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate("/industry/login")}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Building className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
              <span className="text-gray-700 group-hover:text-emerald-600 font-medium">
                Industrial User Login
              </span>
            </button>
            
            <button
              onClick={() => navigate("/ecoagent/login")}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-xl py-3 px-4 hover:bg-gray-50 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Leaf className="w-5 h-5 text-gray-600 group-hover:text-emerald-600" />
              <span className="text-gray-700 group-hover:text-emerald-600 font-medium">
                Eco Agent Login
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}