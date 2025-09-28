import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Factory, 
  Calendar, 
  UserCheck, 
  Leaf, 
  Shield, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Database 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const adminCards = [
    {
      title: "New Industrial Users",
      description: "Review and approve new industrial registrations",
      icon: <Factory className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-600",
      action: () => navigate('/industry/new')
    },
    {
      title: "Manage Industrial Users",
      description: "View, edit, and manage all industrial accounts",
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-600",
      action: () => navigate('/industry/manage')
    },
    {
      title: "Manage Pickup Schedules",
      description: "Oversee all waste collection schedules and assignments",
      icon: <Calendar className="w-8 h-8" />,
      color: "from-green-500 to-emerald-600",
      action: () => navigate('/pickup/schedules')
    },
    {
      title: "Manage Users",
      description: "Administer residential user accounts and profiles",
      icon: <UserCheck className="w-8 h-8" />,
      color: "from-yellow-500 to-orange-600",
      action: () => navigate('/users/manage')
    },
    {
      title: "Manage Eco Agents",
      description: "Monitor and manage eco agent performance and assignments",
      icon: <Leaf className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-600",
      action: () => navigate('/ecoagent/manage')
    }
  ];

  const stats = [
    { label: "Total Users", value: "12,487", icon: <Users className="w-5 h-5 text-blue-600" /> },
    { label: "Industrial Accounts", value: "342", icon: <Factory className="w-5 h-5 text-purple-600" /> },
    { label: "Active Eco Agents", value: "89", icon: <Leaf className="w-5 h-5 text-green-600" /> },
    { label: "Daily Pickups", value: "1,247", icon: <Calendar className="w-5 h-5 text-orange-600" /> }
  ];

  const recentActivity = [
    { id: 1, action: "New industrial user registered", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Eco agent completed 10 pickups", time: "15 minutes ago", type: "agent" },
    { id: 3, action: "System maintenance scheduled", time: "1 hour ago", type: "system" },
    { id: 4, action: "New pickup schedule created", time: "2 hours ago", type: "pickup" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation Bar */}
      <nav className="bg-gray-800/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CleanIt Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 font-medium">
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your waste management platform with full control</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {adminCards.map((card, index) => (
            <div
              key={index}
              onClick={card.action}
              className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-blue-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.action}</p>
                  <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              System Performance
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">API Response Time</span>
                  <span className="text-white">124ms</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Database Load</span>
                  <span className="text-white">32%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
              System Alerts
            </h3>
            <div className="text-gray-400 text-sm">
              <p className="mb-2">✅ All systems operational</p>
              <p className="mb-2">✅ Database backup completed</p>
              <p>✅ Security scan passed</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-800 text-center">
          <div className="text-gray-500">
            <p>© 2024 CleanIt Admin Portal. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}