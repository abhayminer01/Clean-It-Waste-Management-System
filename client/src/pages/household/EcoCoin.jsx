import React, { useEffect, useState } from "react";
import axios from "axios";
import { Coins, Zap } from "lucide-react";

export default function EcoCoin() {
  const [totalCoins, setTotalCoins] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEcoCoins = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/ecocoin/`, { withCredentials: true });
        if (res.data.success) {
          setTotalCoins(res.data.totalCoins);
          setHistory(res.data.history);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEcoCoins();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8 border border-emerald-100">
        <div className="flex items-center space-x-4 mb-6">
          <Zap className="w-10 h-10 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Your Eco Coins</h1>
        </div>

        {loading ? (
          <p>Loading your Eco Coins...</p>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl font-bold text-emerald-600 mb-4 flex items-center justify-center">
              <Coins className="w-12 h-12 mr-2" /> {totalCoins}
            </div>
            <p className="text-gray-600 text-lg">Eco Coins available in your account</p>
          </div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coins History</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {history.map((item, idx) => (
                <div key={idx} className="flex justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Pickup: {item.pickup ? item.pickup.waste_type : "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Date: {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center text-emerald-600 font-bold">
                    <Coins className="w-5 h-5 mr-1" /> {item.coins}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Redeem Section */}
        <div className="mt-12 bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redeem Eco Coins</h2>
          <p className="text-gray-600 mb-4">Redeem your Eco Coins for rewards (coming soon).</p>
          <button
            disabled
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-xl font-semibold cursor-not-allowed"
          >
            Available Soon
          </button>
        </div>

        {/* Coin Conversion Info */}
        <div className="mt-8 text-center text-gray-700 text-sm">
          <p>
            Conversion Rate: <span className="font-semibold">100 Coins = ₹1</span>
          </p>
          <p>
            Can be used for government services like KSRTC travel fare, KWA water bill, KSEB electricity bill, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
