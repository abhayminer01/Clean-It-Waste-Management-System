import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, Building, History, User, Leaf, Recycle, Truck, Award, MapPin, Users, TrendingUp, Star, Phone, Mail, HelpCircle, CheckCircle, Clock, Shield, Zap } from 'lucide-react';

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
      action: () => navigate('/ecocoins'),
      color: "from-yellow-500 to-orange-600",
      gradient: "bg-gradient-to-br from-yellow-50 to-orange-50"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "Register & Login",
      description: "Create your account by providing basic details and location information for optimized pickup routes."
    },
    {
      step: 2,
      icon: <Truck className="w-8 h-8 text-white" />,
      title: "Schedule Pickup",
      description: "Choose waste type, date, and time slot that works best for you through our user-friendly interface."
    },
    {
      step: 3,
      icon: <Recycle className="w-8 h-8 text-white" />,
      title: "Eco Agent Assignment",
      description: "Our system automatically assigns the nearest available eco agent based on your location and schedule."
    },
    {
      step: 4,
      icon: <Award className="w-8 h-8 text-white" />,
      title: "Collection & Rewards",
      description: "Eco agent collects your waste, marks it as picked, and you earn Eco Coins for sustainable practices."
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'services':
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our System Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                CleanIt connects residents, industries, and eco agents through a seamless digital platform 
                for efficient waste management and environmental sustainability.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Flow */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Residential Users</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-green-600 font-bold text-xs">1</span>
                    </div>
                    <p>Register with personal details and address</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-green-600 font-bold text-xs">2</span>
                    </div>
                    <p>Schedule waste pickups by type and time</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-green-600 font-bold text-xs">3</span>
                    </div>
                    <p>Track pickup status and earn Eco Coins</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-green-600 font-bold text-xs">4</span>
                    </div>
                    <p>Utilise rewards on various services</p>
                  </div>
                </div>
              </div>

              {/* Industry Flow */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Industrial Users</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">1</span>
                    </div>
                    <p>Register with business license and industrial details</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">2</span>
                    </div>
                    <p>Schedule commercial waste pickups with payment</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">3</span>
                    </div>
                    <p>Secure payment processing for industrial services</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">4</span>
                    </div>
                    <p>Comprehensive pickup history and billing management</p>
                  </div>
                </div>
              </div>

              {/* Eco Agent Flow */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Eco Agents</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-purple-600 font-bold text-xs">1</span>
                    </div>
                    <p>Agent registration with location and certification</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-purple-600 font-bold text-xs">2</span>
                    </div>
                    <p>View and accept new pickup assignments</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-purple-600 font-bold text-xs">3</span>
                    </div>
                    <p>Optimized route navigation to pickup locations</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-purple-600 font-bold text-xs">4</span>
                    </div>
                    <p>Complete pickups and receive performance ratings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-center text-white mt-12">
              <h3 className="text-2xl font-bold mb-4">Join Our Ecosystem</h3>
              <p className="text-lg mb-6 opacity-90">
                Whether you're a resident, business, or eco agent, CleanIt provides the tools you need 
                for efficient and sustainable waste management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  Register as User
                </button>
                <button 
                  onClick={() => navigate('/industry/register')}
                  className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  Register as Industry
                </button>
                <button 
                  onClick={() => navigate('/ecoagent/login')}
                  className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  Eco Agent Login
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'support':
        return (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Customer Support</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're here to help you every step of the way. Find answers to common questions below.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h3>
              <div className="space-y-6 max-w-3xl mx-auto">
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">How do I schedule a pickup?</h4>
                  <p className="text-gray-600">
                    Log into your account, navigate to 'Schedule Pickup', select your waste type, 
                    choose your preferred date and time slot, then confirm your request. You'll receive 
                    confirmation and can track your pickup status in real-time.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">What types of waste do you collect?</h4>
                  <p className="text-gray-600">
                    We collect various waste types including Plastic, Organic waste, Electronic waste (E-Waste), 
                    Metal scrap, and other general waste. Please ensure proper segregation before scheduling 
                    your pickup for efficient processing.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">How do Eco Coins work?</h4>
                  <p className="text-gray-600">
                    Eco Coins are our reward system for sustainable waste disposal. You earn coins for every 
                    successful pickup, which can be redeemed for discounts on future services, merchandise, 
                    or even donated to environmental causes. The more you participate, the more you earn!
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">What if I need to reschedule my pickup?</h4>
                  <p className="text-gray-600">
                    You can easily reschedule your pickup through the 'Pickup History' section in your dashboard. 
                    Simply find your scheduled pickup and click 'Edit' to choose a new date and time. Please note 
                    that rescheduling should be done at least 2 hours before the scheduled pickup time.
                  </p>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">How does the eco agent rating system work?</h4>
                  <p className="text-gray-600">
                    After each pickup completion, you'll be prompted to rate your eco agent experience. 
                    This helps maintain service quality and ensures our agents provide excellent service. 
                    Ratings are based on punctuality, professionalism, and overall pickup experience.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">What payment methods do you accept?</h4>
                  <p className="text-gray-600">
                    For residential users, our basic pickup services are completely free! Industrial users 
                    can pay securely through our integrated payment system using credit/debit cards. 
                    All transactions are processed through Stripe for maximum security.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">Still need help? Contact our support team:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Phone className="w-5 h-5" />
                  <span>+1-800-CLEANIT</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Mail className="w-5 h-5" />
                  <span>support@cleanit.com</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-600">
                  <HelpCircle className="w-5 h-5" />
                  <span>Live Chat (9AM-9PM)</span>
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
                Clean-It
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
                  How It Works
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