import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../services/api";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserById(id);
      if (res?.success) {
        setUser(res.data);
        setFormData(res.data);
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateUser(id, formData);
    if (res?.success) {
      alert("User updated successfully!");
      navigate("/users/manage");
    } else {
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <div className="p-6">User not found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="full_name"
          value={formData.full_name || ""}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
        />
        <input
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          name="mobile_number"
          value={formData.mobile_number || ""}
          onChange={handleChange}
          placeholder="Mobile Number"
          className="w-full p-2 border rounded"
        />
        <input
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 border rounded"
        />
        <input
          name="district"
          value={formData.district || ""}
          onChange={handleChange}
          placeholder="District"
          className="w-full p-2 border rounded"
        />
        <input
          name="localbody_type"
          value={formData.localbody_type || ""}
          onChange={handleChange}
          placeholder="Localbody Type"
          className="w-full p-2 border rounded"
        />
        <input
          name="localbody_name"
          value={formData.localbody_name || ""}
          onChange={handleChange}
          placeholder="Localbody Name"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
