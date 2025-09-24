import React, { useEffect, useState } from "react";
import { getIndustries } from "../services/api";

export default function ManageIndustry() {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getIndustries();
        if (res?.success) {
          setIndustries(res.data);
        } else {
          console.log(res?.message || "Failed to fetch industries");
        }
      } catch (err) {
        console.error("Error fetching industries:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (industries.length === 0) {
    return <p className="text-center mt-10 text-gray-600">No industries found.</p>;
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
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Email:</span> {ind.email}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Licence:</span> {ind.licence}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Address:</span> {ind.address}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">District:</span> {ind.district}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Local Body:</span>{" "}
            {ind.localbody_type} - {ind.localbody_name}
          </p>
          <p className="text-sm mt-2">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={
                ind.status === "verified"
                  ? "text-green-600"
                  : ind.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {ind.status}
            </span>
          </p>
          <button className="bg-red-500 px-3 py-1 text-white rounded-lg hover:bg-red-600 mt-4">Delete Industry</button>
          <button className="bg-blue-500 px-3 py-1 text-white rounded-lg hover:bg-blue-600 mt-4 ml-5">Send Notification</button>
          <button className="bg-green-500 px-3 py-1 text-white rounded-lg hover:bg-green-600 mt-4 ml-5">Edit Details</button>
        </div>
      ))}
    </div>
  );
}
