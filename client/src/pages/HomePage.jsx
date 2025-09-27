import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, History, User, Leaf, Recycle, Truck, Award, MapPin, Users, TrendingUp, Star, Phone, Mail, HelpCircle, CheckCircle, Clock, Shield, Zap, Building } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Schedule Pickup",
      description: "Book waste collection at your convenience with real-time tracking",
      action: () => navigate('/schedule'),
      color: "from-green-500 to-emerald-600",
      gradient: "bg-gradient-to-br from-green-50 to-emerald-50"
    },
    {
      icon: <History className="w-8 h-8" />,
      title: "Pickup History",
      description: "Track all your past collections and monitor your environmental impact",
      action: () => navigate('/pickup/history'),
      color: "from-blue-500 to-cyan-600",
      gradient: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Profile",
      description: "Manage your account settings and view your sustainability stats",
      action: () => navigate('/profile'),
      color: "from-purple-500 to-indigo-600",
      gradient: "bg-gradient-to-br from-purple-50 to-indigo-50"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Eco Coins",
      description: "Earn rewards for responsible waste disposal and redeem exciting offers",
      action: () => {},
      color: "from-yellow-500 to-orange-600",
      gradient: "bg-gradient-to-br from-yellow-50 to-orange-50"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "Schedule Pickup",
      description: "Choose your preferred date and time for waste collection through our easy-to-use app."
    },
    {
      step: 2,
      icon: <Truck className="w-8 h-8 text-white" />,
      title: "Collection Day",
      description: "Our eco-friendly trucks arrive on time to collect your segregated waste responsibly."
    },
    {
      step: 3,
      icon: <Recycle className="w-8 h-8 text-white" />,
      title: "Processing",
      description: "Waste is processed at certified facilities with proper recycling and disposal methods."
    },
    {
      step: 4,
      icon: <Award className="w-8 h-8 text-white" />,
      title: "Earn Rewards",
      description: "Get Eco Coins for every pickup that you can redeem for exciting offers and discounts."
    }
  ];

  const services = [
    {
      icon: <Recycle className="w-6 h-6 text-emerald-600" />,
      title: "Residential Waste Collection",
      description: "Regular pickup services for households with segregated waste collection."
    },
    {
      icon: <Building className="w-6 h-6 text-blue-600" />,
      title: "Commercial Waste Management",
      description: "Customized solutions for offices, restaurants, and businesses."
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: "E-Waste Collection",
      description: "Safe disposal of electronic waste with certified recycling partners."
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: "Community Programs",
      description: "Educational workshops and community clean-up drives."
    }
  ];

  const supportOptions = [
    {
      icon: <Phone className="w-6 h-6 text-emerald-600" />,
      title: "Phone Support",
      description: "+1-800-CLEANIT (24/7)",
      contact: "+1-800-253-2648"
    },
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      title: "Email Support",
      description: "support@cleanit.com",
      contact: "support@cleanit.com"
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
      title: "Live Chat",
      description: "Available 9 AM - 9 PM daily",
      contact: "Chat Now"
    },
    {
      icon: <MapPin className="w-6 h-6 text-orange-600" />,
      title: "Local Office",
      description: "Visit our nearest center",
      contact: "Find Location"
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'services':
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive waste management solutions tailored to your needs, 
                from residential to commercial properties.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-center text-white mt-12">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of satisfied customers who have made the switch to sustainable waste management.
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Sign Up Today
              </button>
            </div>
          </div>
        );
      
      case 'support':
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Customer Support</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're here to help you every step of the way. Contact us through any of our support channels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportOptions.map((option, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-3">{option.description}</p>
                  <div className="text-emerald-600 font-semibold">{option.contact}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">How do I schedule a pickup?</h4>
                  <p className="text-gray-600">Simply log into your account, go to 'Schedule Pickup', select your preferred date and time, and confirm your request.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">What types of waste do you collect?</h4>
                  <p className="text-gray-600">We collect dry waste, wet waste, e-waste, and hazardous waste. Please segregate your waste properly before pickup.</p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">How do Eco Coins work?</h4>
                  <p className="text-gray-600">You earn Eco Coins for every successful pickup. These can be redeemed for discounts, merchandise, or donated to environmental causes.</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Transform Waste into
                <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent"> 
                  {" "}Worth
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join thousands of eco-conscious citizens in building a cleaner, greener future. 
                Schedule pickups, track your impact, and earn rewards for sustainable living.
              </p>
            </div>

            {/* How It Works Section */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">How CleanIt Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {howItWorks.map((step, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      {step.icon}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center border-4 border-white">
                        <span className="text-green-600 font-bold text-lg">{step.step}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Grid */}
            <div className="mb-16">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Your Waste Management Hub</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    onClick={feature.action}
                    className={`${feature.gradient} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-emerald-100 group`}
                  >
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-white rounded-3xl p-12 mb-16 shadow-lg border border-emerald-100">
              <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Why Choose CleanIt?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Reliable Service</h3>
                  <p className="text-gray-600">99.8% on-time pickup rate with real-time tracking</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
                  <p className="text-gray-600">Round-the-clock customer support for all your needs</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Eco Certified</h3>
                  <p className="text-gray-600">Certified sustainable practices and recycling partners</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-center text-white">
              <Zap className="w-16 h-16 mx-auto mb-6 text-white/90" />
              <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Every pickup you schedule helps reduce landfill waste and creates a cleaner environment for future generations.
              </p>
              <button 
                onClick={() => navigate('/schedule')}
                className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Schedule Your First Pickup
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
                CleanIt
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm">
                <button 
                  onClick={() => setActiveTab('home')}
                  className={`font-medium transition-colors flex items-center ${
                    activeTab === 'home' ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700'
                  }`}
                >
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </button>
                <button 
                  onClick={() => setActiveTab('services')}
                  className={`font-medium transition-colors ${
                    activeTab === 'services' ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700'
                  }`}
                >
                  Services
                </button>
                <button 
                  onClick={() => setActiveTab('support')}
                  className={`font-medium transition-colors ${
                    activeTab === 'support' ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700'
                  }`}
                >
                  Support
                </button>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm flex items-center"
              >
                <User className="w-4 h-4 mr-1" />
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
        
        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-emerald-100">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2024 CleanIt. Building a sustainable future, one pickup at a time.</p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="#" className="hover:text-emerald-700 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-700 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-emerald-700 transition-colors">Contact Us</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}