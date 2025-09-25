import React, { useState } from "react";
import { createPickup } from "../../services/user-api";

export default function Schedule() {
  const [wasteType, setWasteType] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      wasteType,
      pickupDate,
      timeSlot,
    };

    const res = await createPickup(payload);
    if (res?.success) {
        alert('Successfully Scheduled Pickup')
        navigate("/pickup/history");
    } else {
        alert(res?.message || "Schedule Failed !");
    }
    
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Schedule Waste Pickup</h1>

        <div>
          <label className="block mb-1">Waste Type:</label>
          <select
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          >
            <option value="">Select type</option>
            <option value="Plastic">Plastic</option>
            <option value="Organic">Organic</option>
            <option value="E-Waste">E-Waste</option>
            <option value="Scrap">Scrap</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Pickup Date:</label>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Time Slot:</label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          >
            <option value="">Select time</option>
            <option value="Morning (8AM - 10AM)">
              Morning (8AM - 10AM)
            </option>
            <option value="Afternoon (11AM - 2PM)">
              Afternoon (11AM - 2PM)
            </option>
            <option value="Evening (3PM - 5PM)">
              Evening (3PM - 5PM)
            </option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Schedule Pickup
        </button>
      </form>
    </div>
  );
}
