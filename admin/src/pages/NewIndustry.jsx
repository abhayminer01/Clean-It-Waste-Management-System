import React, { useEffect, useState } from "react";
import { getNewIndustry, verifyIndustry, rejectIndustry } from "../services/api";

export default function NewIndustry() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch industries
  const fetchIndustries = async () => {
    try {
      const res = await getNewIndustry();
      if (res?.success) {
        setIndustries(res.data);
      } else {
        console.log(res?.message || "Failed to fetch industries");
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  // ✅ Handle verify
  const handleVerify = async (id) => {
    const res = await verifyIndustry(id);
    if (res?.success) {
      alert("Industry verified!");
      // remove the verified industry from state
      setIndustries((prev) => prev.filter((ind) => ind._id !== id));
    } else {
      alert(res?.message || "Failed to verify");
    }
  };

  // ✅ Handle reject
  const handleReject = async (id) => {
    const res = await rejectIndustry(id);
    if (res?.success) {
      alert("Industry rejected! It will be deleted after 24 hours.");
      // remove the rejected industry from state
      setIndustries((prev) => prev.filter((ind) => ind._id !== id));
    } else {
      alert(res?.message || "Failed to reject");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (industries.length === 0) {
    return <p className="text-center mt-10 text-gray-600">No new industries found.</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {industries.map((ind) => (
        <div
          key={ind._id}
          className="bg-white shadow-lg rounded-2xl p-6 border hover:shadow-xl transition"
        >
          <h2 className="text-xl font-bold text-green-700 mb-2">
            {ind.industry_name}
          </h2>
          <p className="text-sm text-gray-600"><span className="font-semibold">Email:</span> {ind.email}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Licence:</span> {ind.licence}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Address:</span> {ind.address}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">District:</span> {ind.district}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Local Body:</span> {ind.localbody_type} - {ind.localbody_name}</p>
          <p className="text-sm text-yellow-600 mt-2">
            Status: {ind.status}
          </p>

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => handleVerify(ind._id)}
              className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-600"
            >
              Verify
            </button>
            <button
              onClick={() => handleReject(ind._id)}
              className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
