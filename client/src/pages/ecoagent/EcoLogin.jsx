import React, { useState } from 'react';
import { agentLogin } from '../../services/ecoagent-api';
import { useNavigate } from 'react-router-dom';
import { User, Lock, MapPin, Leaf, Loader2, AlertCircle } from 'lucide-react';

export default function EcoLogin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleForm = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const id = e.target.id.value;
        const password = e.target.password.value;

        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const payload = {
                            id: id,
                            password: password,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        try {
                            const res = await agentLogin(payload);
                            setIsLoading(false);
                            if (res?.success) {
                                navigate('/ecoagent/dashboard');
                            } else {
                                setError(res?.message || "Login failed!");
                            }
                        } catch (loginError) {
                            setIsLoading(false);
                            setError("Login failed! Please try again.");
                        }
                    },
                    (error) => {
                        setIsLoading(false);
                        setError("Location access is required for login. Please enable location services and try again.");
                    }
                );
            } else {
                setIsLoading(false);
                setError("Geolocation is not supported by your browser. Please use a modern browser with location support.");
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Eco Agent Login</h1>
                    <p className="text-gray-600">Sign in to manage your waste collection assignments</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleForm} className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100">
                    <div className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}

                        {/* Agent ID Field */}
                        <div>
                            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                                Agent ID
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="id"
                                    name="id"
                                    type="text"
                                    required
                                    disabled={isLoading}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Enter your agent ID"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
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
                            <span>Location access is required for route optimization and assignment tracking</span>
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

                {/* Instructions */}
                <div className="mt-6 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <h3 className="font-semibold text-emerald-800 mb-2">Before You Login:</h3>
                    <ul className="text-emerald-700 text-sm space-y-1">
                        <li>• Please ensure location services are enabled in your browser</li>
                        <li>• Your location helps optimize pickup routes and assignments</li>
                        <li>• Contact admin if you don't have your agent credentials</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}