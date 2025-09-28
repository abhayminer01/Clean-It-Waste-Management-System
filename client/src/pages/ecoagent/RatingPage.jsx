import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { submitRating, getPickupDetails } from "../../services/ecoagent-api";
import { Truck, User, Star, AlertCircle, CheckCircle, Loader2, Home, Calendar, Clock, Phone, Package } from 'lucide-react';

export default function RatingPage() {
  const { id } = useParams();
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scores, setScores] = useState({
    correctSegregation: 1,
    cleanliness: 1,
    timingCompliance: 1,
    hazardousHandling: 1,
    overallSatisfaction: 1,
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const fetchPickup = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await getPickupDetails(id);
      if (res?.success) {
        const data = res.data;
        setPickup(data);

        // If industrial pickup, redirect immediately to dashboard
        if (data.pickup_type === "industrial") {
          setError("Industrial pickups do not require ratings.");
          setTimeout(() => navigate("/ecoagent/dashboard"), 2000);
        }
        
        // If pickup was paid, redirect immediately
        if (data.payment) {
          setError("Paid pickups do not require ratings.");
          setTimeout(() => navigate("/ecoagent/dashboard"), 2000);
        }
      } else {
        setError(res?.message || "Failed to load pickup details");
      }
    } catch (err) {
      setError("Failed to load pickup details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickup();
  }, [id, navigate]);

  const handleChange = (field, value) => {
    setScores((prev) => ({ ...prev, [field]: Number(value) }));
  };

  const handleSubmit = async () => {
    console.log("Submitting scores:", scores); 
    setSubmitting(true);
    setError("");
    
    try {
      // Validate that all scores are provided
      const allScoresProvided = Object.values(scores).every(score => score > 0);
      if (!allScoresProvided) {
        setError("Please provide ratings for all criteria");
        setSubmitting(false);
        return;
      }

      const res = await submitRating(id, scores);
      if (res?.success) {
        const totalScore = res.rating?.totalScore || 0;
        alert(`Rating submitted successfully! Total Score: ${totalScore}/100`);
        navigate("/ecoagent/dashboard");
      } else {
        setError(res?.message || "Failed to submit rating");
      }
    } catch (err) {
      setError("Error submitting rating. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const questions = [
    { 
      key: "correctSegregation", 
      label: "Correct Waste Type & Segregation", 
      description: "Was the waste properly segregated and labeled correctly?"
    },
    { 
      key: "cleanliness", 
      label: "Cleanliness & Packaging", 
      description: "Was the waste clean and properly packaged for collection?"
    },
    { 
      key: "timingCompliance", 
      label: "Pickup Timing Compliance", 
      description: "Was the waste ready at the scheduled pickup time?"
    },
    { 
      key: "hazardousHandling", 
      label: "Hazardous/Recyclable Material Handling", 
      description: "Were hazardous or recyclable materials handled appropriately?"
    },
    { 
      key: "overallSatisfaction", 
      label: "Overall Pickup Satisfaction", 
      description: "How satisfied were you with this pickup experience overall?"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading pickup details...</p>
        </div>
      </div>
    );
  }

  // Handle redirects for industrial or paid pickups
  if ((pickup?.pickup_type === "industrial" || pickup?.payment) && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Rating Required</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate("/ecoagent/dashboard")}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-4">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rate This Pickup</h1>
          <p className="text-gray-600">Help us improve our service by providing your feedback</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center mb-6 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Pickup Details */}
          {pickup && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Truck className="w-5 h-5 mr-2 text-emerald-600" />
                Pickup Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Customer Name</p>
                      <p className="font-medium text-gray-900">{pickup.user?.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Home className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{pickup.user?.address || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium text-gray-900">{pickup.user?.mobile_number || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-gray-900">{pickup.user?.district} / {pickup.user?.localbody_name}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Waste Type</p>
                      <p className="font-medium text-gray-900">{pickup.waste_type}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(pickup.sheduled_date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Time Slot</p>
                      <p className="font-medium text-gray-900">{pickup.scheduled_time}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Pickup Type</p>
                      <p className="font-medium text-gray-900 capitalize">{pickup.pickup_type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rating Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-600" />
              Pickup Rating
            </h2>
            
            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q.key} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      {q.label}
                    </label>
                    <p className="text-xs text-gray-500 mb-3">{q.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={scores[q.key]}
                      onChange={(e) => handleChange(q.key, e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Poor (1)</span>
                      <span>Excellent (5)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">
                        Rating: {scores[q.key] || "Not rated"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting Rating...
                </>
              ) : (
                <>
                  <Star className="w-5 h-5 mr-2" />
                  Submit Rating
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for MapPin icon
const MapPin = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);