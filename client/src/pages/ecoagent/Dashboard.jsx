import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, CheckCircle, History, Leaf, Truck, MapPin, Award, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPickups: 0,
        completedToday: 0,
        pendingPickups: 0,
        ecoRating: 'A'
    });

    // Simulate loading agent stats
    useEffect(() => {
        const timer = setTimeout(() => {
            // Mock data - in real app this would come from API
            setStats({
                totalPickups: 147,
                completedToday: 12,
                pendingPickups: 8,
                ecoRating: 'A+'
            });
            setLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    const features = [
        {
            icon: <User className="w-8 h-8" />,
            title: "Profile",
            description: "Manage your personal information and agent settings",
            action: () => navigate('/ecoagent/profile'),
            color: "from-blue-500 to-cyan-600"
        },
        {
            icon: <Calendar className="w-8 h-8" />,
            title: "New Pickups",
            description: "View and accept new waste collection assignments",
            action: () => navigate('/ecoagent/pickups/new'),
            color: "from-green-500 to-emerald-600"
        },
        {
            icon: <CheckCircle className="w-8 h-8" />,
            title: "Accepted Pickups",
            description: "Manage your current pickup assignments and routes",
            action: () => navigate('/ecoagent/pickups/accepted'),
            color: "from-purple-500 to-indigo-600"
        },
        {
            icon: <History className="w-8 h-8" />,
            title: "Pickup History",
            description: "Review your completed collections and performance",
            action: () => navigate('/ecoagent/pickups/history'),
            color: "from-orange-500 to-red-600"
        }
    ];

    const quickStats = [
        { label: "Total Pickups", value: stats.totalPickups, icon: <Truck className="w-5 h-5 text-emerald-600" /> },
        { label: "Completed Today", value: stats.completedToday, icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
        { label: "Pending Assignments", value: stats.pendingPickups, icon: <AlertCircle className="w-5 h-5 text-yellow-600" /> },
        { label: "Eco Rating", value: stats.ecoRating, icon: <Award className="w-5 h-5 text-orange-600" /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
            {/* Navigation Bar */}
            <nav className="bg-white/90 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl shadow-lg">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                                CleanIt EcoAgent
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-6 text-sm">
                                <a href="#" className="text-emerald-700 hover:text-emerald-900 font-medium transition-colors">Dashboard</a>
                                <a href="#" className="text-gray-600 hover:text-emerald-700 font-medium transition-colors">Assignments</a>
                                <a href="#" className="text-gray-600 hover:text-emerald-700 font-medium transition-colors">Support</a>
                            </div>
                            <button 
                                onClick={() => navigate('/ecoagent/profile')}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm flex items-center"
                            >
                                <User className="w-4 h-4 mr-1" />
                                Profile
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Welcome Back, Eco Agent! 🌱
                            </h1>
                            <p className="text-gray-600">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90">Current Location</p>
                                        <p className="text-lg font-bold">Online ✅</p>
                                    </div>
                                    <MapPin className="w-8 h-8 opacity-90" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading your dashboard...</p>
                    </div>
                )}

                {/* Quick Stats */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {quickStats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    {stat.icon}
                                </div>
                                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-gray-600 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Features Grid */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Agent Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                onClick={feature.action}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-emerald-100 group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    {React.cloneElement(feature.icon, { className: "w-7 h-7 text-white" })}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Summary */}
                {!loading && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100 mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                            Weekly Performance Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-emerald-50 rounded-lg">
                                <div className="text-3xl font-bold text-emerald-700">98%</div>
                                <div className="text-sm text-emerald-600">On-time Rate</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-3xl font-bold text-green-700">4.9</div>
                                <div className="text-sm text-green-600">Customer Rating</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-3xl font-bold text-blue-700">1.2T</div>
                                <div className="text-sm text-blue-600">Waste Collected</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-center text-white">
                    <Truck className="w-12 h-12 mx-auto mb-4 text-white/90" />
                    <h2 className="text-2xl font-bold mb-4">Ready for Your Next Assignment?</h2>
                    <p className="text-lg text-white/90 mb-6">
                        Check your new pickups and start making a difference in your community today!
                    </p>
                    <button 
                        onClick={() => navigate('/ecoagent/pickups/new')}
                        className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
                    >
                        View New Pickups
                    </button>
                </div>

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-emerald-100">
                    <div className="text-center text-gray-600">
                        <p className="mb-2">© 2024 CleanIt EcoAgent. Making waste management efficient and eco-friendly.</p>
                        <div className="flex justify-center space-x-6 text-sm">
                            <a href="#" className="hover:text-emerald-700 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-emerald-700 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-emerald-700 transition-colors">Agent Support</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}