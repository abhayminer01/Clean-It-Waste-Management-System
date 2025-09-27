import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
    overallSatisfaction: 0
  });

  useEffect(() => {
    const fetchPickup = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pickup/${id}`, { withCredentials: true });
        if (res.data.success) setPickup(res.data.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPickup();
  }, [id]);

  const handleChange = (field, value) => {
    setScores(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/rating/${id}`,
        scores,
        { withCredentials: true }
      );
      if (res.data.success) alert(`Rating submitted! Total Score: ${res.data.rating.totalScore}/100`);
    } catch (err) {
      console.error(err);
      alert("Error submitting rating");
    }
  };

  if (loading) return <p>Loading pickup...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {pickup && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold">{pickup.user?.full_name}</h2>
          <p>Waste Type: {pickup.waste_type}</p>
          <p>Date: {pickup.sheduled_date}</p>
          <p>Time: {pickup.scheduled_time}</p>
          <p>Pickup Type: {pickup.pickup_type}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        {[
          { key: "correctSegregation", label: "Correct Waste Type & Segregation" },
          { key: "cleanliness", label: "Cleanliness & Packaging" },
          { key: "timingCompliance", label: "Pickup Timing Compliance" },
          { key: "hazardousHandling", label: "Hazardous/Recyclable Material Handling" },
          { key: "overallSatisfaction", label: "Overall Pickup Satisfaction" },
        ].map(q => (
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
  );
}
