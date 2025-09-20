import React from "react";
import NavBar from "../components/navbar";
import { useNavigate } from "react-router-dom";

export default function LaunchPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-black via-green-900/60 to-black min-h-screen w-full text-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-20">
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Built for Nature. <br /> Powered by You.
          </h1>
          <p className="text-gray-300 mb-8">
            Join our mission to create cleaner, smarter, and greener cities. 🌱
            Manage waste, earn rewards, and help save the planet.
          </p>
          <div className="flex gap-4">
            <button className="px-20 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition-all font-semibold" onClick={() => navigate('./login')}>
              Get Started
            </button>
          </div>
        </div>

        <div className="mt-10 md:mt-0">
          <img
            src="/image.png"
            alt="Eco Illustration"
            className="w-96 h-96 object-contain"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-10 md:px-20 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Smart Waste Disposal",
            desc: "Dispose waste by scheduling. Eco agent is ready to pick it up.",
          },
          {
            title: "Earn Eco Coins",
            desc: "Get in app coins named eco coins and utilise for various govt services.",
          },
          {
            title: "Community Impact",
            desc: "Be part of a movement towards cleaner, greener cities.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-lg hover:scale-105 transition-transform"
          >
            <h2 className="text-xl font-bold mb-3">{item.title}</h2>
            <p className="text-gray-300">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="px-10 md:px-20 py-16 text-center">
        <h2 className="text-3xl font-bold mb-10">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-4xl font-extrabold text-green-400">50K+</h3>
            <p className="text-gray-300">Users joined</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-green-400">200T+</h3>
            <p className="text-gray-300">Waste managed</p>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-green-400">99.9%</h3>
            <p className="text-gray-300">Eco Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-10 md:px-20 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to make your city cleaner?
        </h2>
        <button className="px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-700 transition-all font-semibold">
          Get Started 🌍
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-black/70 border-t border-white/10 text-gray-400 px-10 md:px-20 py-6 text-center">
        © {new Date().getFullYear()} Clean-It. All rights reserved.
      </footer>
    </div>
  );
}
