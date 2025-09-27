import React, { useEffect, useState } from 'react';
import { checkAuth, checkStatus } from '../../services/industry-api';
import { useNavigate } from 'react-router-dom';
import { Building2, Calendar, History, CreditCard, User, Clock, CheckCircle, AlertCircle, Loader2, Truck, Award, TrendingUp } from 'lucide-react';

export default function IndustryHome() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkSession() {
      try {
        const req = await checkAuth();
        if (!req?.success) {
          navigate('/industry/login');
        }
      } catch (err) {
        setError("Authentication failed. Please log in again.");
        navigate('/industry/login');
      }
    }

    async function loadStatus() {
      try {
        const req = await checkStatus();
        setStatus(req.status);
      } catch (err) {
        setError("Failed to load account status.");
      } finally {
        setLoading(false);
      }
    }

    checkSession();
    loadStatus();
  }, [navigate]);

  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Schedule Pickup",
      description: "Book industrial waste collection with flexible scheduling options",
      action: () => navigate('/industry/schedule'),
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Profile",
      description: "Manage your business information and account settings",
      action: () => navigate('/industry/profile'),
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <History className="w-8 h-8" />,
      title: "Pickup History",
      description: "Track all your past collections and waste management records",
      action: () => navigate('/industry/pickup-history'),
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Payment History",
      description: "View invoices, payments, and billing information",
      action: () => navigate('/industry/payment-history'),
      color: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { label: "Total Pickups", value: "47", icon: <Truck className="w-5 h-5 text-emerald-600" /> },
    { label: "Waste Collected", value: "12.8T", icon: <TrendingUp className="w-5 h-5 text-blue-600" /> },
    { label: "Active Contracts", value: "3", icon: <CheckCircle className="w-5 h-5 text-purple-600" /> },
    { label: "Eco Rating", value: "A+", icon: <Award className="w-5 h-5 text-orange-600" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/industry/login')}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                CleanIt Industry
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <a href="#" className="text-emerald-700 hover:text-emerald-900 font-medium transition-colors">Dashboard</a>
                <a href="#" className="text-gray-600 hover:text-emerald-700 font-medium transition-colors">Services</a>
                <a href="#" className="text-gray-600 hover:text-emerald-700 font-medium transition-colors">Support</a>
              </div>
              <button 
                onClick={() => navigate('/industry/profile')}
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
        {status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">Account Under Review</h2>
            <p className="text-yellow-700 mb-6">
              Your industrial account registration is currently pending admin approval. 
              You will receive an email notification once your account is verified.
            </p>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Estimated Review Time:</strong> 24-48 hours
              </p>
            </div>
          </div>
        )}

        {status === 'verified' && (
          <>
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Welcome Back, Industry Partner! 🏭
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
                        <p className="text-sm opacity-90">Account Status</p>
                        <p className="text-xl font-bold">Verified ✅</p>
                      </div>
                      <CheckCircle className="w-8 h-8 opacity-90" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Industrial Waste Management Hub</h2>
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

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-center text-white">
              <Truck className="w-12 h-12 mx-auto mb-4 text-white/90" />
              <h2 className="text-2xl font-bold mb-4">Ready for Your Next Pickup?</h2>
              <p className="text-lg text-white/90 mb-6">
                Schedule your industrial waste collection and maintain your eco-friendly operations.
              </p>
              <button 
                onClick={() => navigate('/industry/schedule')}
                className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Schedule Pickup Now
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-emerald-100">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2024 CleanIt Industry. Professional waste management solutions for businesses.</p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="#" className="hover:text-emerald-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald-700 transition-colors">Contact Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}