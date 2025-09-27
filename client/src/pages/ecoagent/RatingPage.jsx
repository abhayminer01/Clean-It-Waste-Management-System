import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function RatingPage() {
  const { id } = useParams(); // pickup id
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState({
    correctSegregation: 0,
    cleanliness: 0,
    timingCompliance: 0,
    hazardousHandling: 0,
    overallSatisfaction: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
  const fetchPickup = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/pickup/${id}`, { withCredentials: true });
      if (res.data.success) {
        const data = res.data.data;
        setPickup(data);

        // If industrial pickup, redirect immediately to dashboard
        if (data.pickup_type === "industrial") {
          alert("Industrial pickups do not require ratings.");
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  fetchPickup();
}, [id, navigate]);

  const handleChange = (field, value) => {
    setScores((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/rating/${id}`,
        scores,
        { withCredentials: true }
      );
      if (res.data.success) {
        alert(`Rating submitted! Total Score: ${res.data.rating.totalScore}/100`);
        navigate("/dashboard"); 
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting rating");
    }
  };

  if (loading) return <p>Loading pickup...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
        {pickup && pickup.payment ? (
        <p className="text-red-500 font-medium">
            This pickup was paid. Rating is not required.
        </p>
        ) : (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
            {pickup && (
            <div className="bg-white p-6 rounded-lg shadow space-y-2">
            <h2 className="text-xl font-bold mb-2">Pickup Details</h2>
            <p><span className="font-medium">User:</span> {pickup.user?.full_name}</p>
            <p><span className="font-medium">Email:</span> {pickup.user?.email || "N/A"}</p>
            <p><span className="font-medium">Mobile:</span> {pickup.user?.mobile_number || "N/A"}</p>
            <p><span className="font-medium">Address:</span> {pickup.user?.address || "N/A"}</p>
            <p><span className="font-medium">District / Local Body:</span> {pickup.user?.district} / {pickup.user?.localbody_name}</p>
            <p><span className="font-medium">Waste Type:</span> {pickup.waste_type}</p>
            <p><span className="font-medium">Pickup Type:</span> {pickup.pickup_type}</p>
            <p><span className="font-medium">Scheduled Date:</span> {pickup.sheduled_date}</p>
            <p><span className="font-medium">Scheduled Time:</span> {pickup.scheduled_time}</p>
            {pickup.payment && (
                <p>
                <span className="font-medium">Payment:</span> {pickup.payment.status} (₹{pickup.payment.amount})
                </p>
            )}
            </div>
        )}

        {/* Rating Form */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="text-xl font-bold mb-2">Rate This Pickup</h2>
            {[
            { key: "correctSegregation", label: "Correct Waste Type & Segregation" },
            { key: "cleanliness", label: "Cleanliness & Packaging" },
            { key: "timingCompliance", label: "Pickup Timing Compliance" },
            { key: "hazardousHandling", label: "Hazardous/Recyclable Material Handling" },
            { key: "overallSatisfaction", label: "Overall Pickup Satisfaction" },
            ].map((q) => (
            <div key={q.key}>
                <p className="font-medium">{q.label}</p>
                <input
                type="range"
                min="1"
                max="5"
                value={scores[q.key]}
                onChange={(e) => handleChange(q.key, e.target.value)}
                className="w-full mt-1"
                />
                <p>Rating: {scores[q.key]}</p>
            </div>
            ))}

            <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
            Submit Rating
            </button>
        </div>
        </div>
        )}
      {/* Pickup & User Details */}
      
    </div>
  );
}
