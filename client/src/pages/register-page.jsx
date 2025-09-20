import React from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-black via-green-900/60 to-black w-screen h-full flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 w-full max-w-md shadow-xl">
        <h1 className="text-3xl font-extrabold text-white mb-6 text-center">
          Join the Movement 🌍
        </h1>
        <p className="text-gray-300 mb-8 text-center">
          Create an account and start your eco journey today
        </p>

        {/* Register Form */}
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 transition-all font-semibold text-white shadow-lg"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-700" />
          <span className="px-4 text-gray-400 text-sm">or</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        {/* Alternative Register */}
        <button className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-gray-200 hover:bg-white/20 transition-all">
          Continue with Google
        </button>

        {/* Footer */}
        <p className="mt-6 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <span className="text-green-400 font-medium cursor-pointer hover:underline" onClick={() => navigate('/login')}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
