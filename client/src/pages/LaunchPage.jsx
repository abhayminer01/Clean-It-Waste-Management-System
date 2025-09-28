import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Recycle, Truck, Users, ArrowRight, Sparkles, Award } from 'lucide-react';

export default function LaunchPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Smart Pickup Scheduling",
      description: "Schedule waste collection at your convenience"
    },
    {
      icon: <Recycle className="w-8 h-8" />,
      title: "Eco-Coin Rewards",
      description: "Earn Eco Coins for every pickup and redeem for government services"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Impact",
      description: "Join thousands of users making a real difference in waste management"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              Clean-It
            </span>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="bg-white text-emerald-600 px-6 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors shadow-sm"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Digitalized version of "Haritha karma Sena"
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Revolutionize Waste
              <span className="block bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Clean-It makes sustainable waste disposal simple, rewarding, and impactful. 
              Schedule pickups,  and earn rewards for building a cleaner future.
            </p>
            
            <button 
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <p className="text-gray-500 text-sm">
              Be the Game Changer for a bright future
            </p>
          </div>

          {/* Right Content - Features Preview */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  {React.cloneElement(feature.icon, { className: "w-8 h-8 text-white" })}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Element - Abstract Waste Management Graphic */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white rounded-3xl p-8 border border-emerald-100">
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-sm text-gray-600">Schedule</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Recycle className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-sm text-gray-600">Collect</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-cyan-600" />
                </div>
                <div className="text-sm text-gray-600">Reward</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>© 2024 CleanIt. Building a sustainable future, one pickup at a time.</p>
      </footer>
    </div>
  );
}