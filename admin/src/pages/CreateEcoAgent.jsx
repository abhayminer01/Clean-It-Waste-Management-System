import React, { useState, useEffect } from "react";
import localbodyData from "../services/localbody.json";
import { createAgent } from "../services/api";

export default function CreateEcoAgent() {
  const [district, setDistrict] = useState("");
  const [localbodyType, setLocalbodyType] = useState("");
  const [localbodyOptions, setLocalbodyOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const districts = Object.keys(localbodyData);

  useEffect(() => {
    if (district && localbodyType) {
      const options = localbodyData[district]?.[localbodyType] || [];
      setLocalbodyOptions(options);
    } else {
      setLocalbodyOptions([]);
    }
  }, [district, localbodyType]);

  const handleForm = async (e) => {
    e.preventDefault();

    const form = e.target;
    const fullname = form.fullname.value.trim();
    const password = form.password.value.trim();
    const confirm = form.confirm.value.trim();
    const localbody_name = form.localbodyname.value;

    if (!fullname || !password || !confirm || !district || !localbodyType || !localbody_name) {
      alert("All fields are mandatory");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      fullname,
      password,
      district,
      localbody_type: localbodyType,
      localbody_name,
    };

    try {
      setLoading(true);
      const res = await createAgent(payload);
      if (res?.success) {
        alert(`✅ Agent created successfully! Agent ID: ${res.data.id}`);
        form.reset();
        setDistrict("");
        setLocalbodyType("");
      } else {
        alert(res?.message || "Failed to create agent");
      }
    } catch (error) {
      console.error(error);
      alert("Error while creating agent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Eco Agent</h1>
      <form onSubmit={handleForm} className="flex flex-col gap-6 bg-white shadow-md rounded-xl p-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium">Full Name:</label>
          <input
            name="fullname"
            type="text"
            className="w-full px-4 py-2 mt-1 border rounded-lg"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium">Password:</label>
          <input
            name="password"
            type="password"
            className="w-full px-4 py-2 mt-1 border rounded-lg"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium">Confirm Password:</label>
          <input
            name="confirm"
            type="password"
            className="w-full px-4 py-2 mt-1 border rounded-lg"
            required
          />
        </div>

        {/* District */}
        <div>
          <label className="block text-sm font-medium">District</label>
          <select
            name="district"
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setLocalbodyType("");
            }}
            className="w-full px-4 py-2 mt-1 border rounded-lg"
            required
          >
            <option value="">-- Select District --</option>
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* Localbody Type */}
        <div>
          <label className="block text-sm font-medium">Localbody Type</label>
          <select
            name="localbodytype"
            value={localbodyType}
            onChange={(e) => setLocalbodyType(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-lg"
            required
            disabled={!district}
          >
            <option value="">-- Select Type --</option>
            {district && (
              <>
                {localbodyData[district]?.corporation?.length > 0 && (
                  <option value="corporation">Corporation</option>
                )}
                {localbodyData[district]?.municipality?.length > 0 && (
                  <option value="municipality">Municipality</option>
                )}
                {localbodyData[district]?.panchayath?.length > 0 && (
                  <option value="panchayath">Panchayath</option>
                )}
              </>
            )}
          </select>
        </div>

        {/* Localbody Name */}
        <div>
          <label className="block text-sm font-medium">Localbody Name</label>
          <select
            name="localbodyname"
            className="w-full px-4 py-2 mt-1 border rounded-lg"
            required
            disabled={!localbodyType}
          >
            <option value="">-- Select Localbody --</option>
            {localbodyOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
        >
          {loading ? "Creating..." : "Create Agent"}
        </button>
      </form>
    </div>
  );
}
