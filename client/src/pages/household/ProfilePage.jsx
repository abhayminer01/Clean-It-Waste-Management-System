import React, { useEffect, useState } from "react";
import { updateProfile, changePassword, logoutUser, getProfile } from "../../services/user-api";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", mobile_number: "", address: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  const fetchProfile = async () => {
    const res = await getProfile();
    if (res?.success) {
      setProfile(res.data);
      setForm({
        full_name: res.data.full_name || "",
        email: res.data.email || "",
        mobile_number: res.data.mobile_number || "",
        address: res.data.address || "",
      });
    }
  };

  const handleSave = async () => {
    const res = await updateProfile(form);
    if (res?.success) {
      alert("Profile updated successfully!");
      setEditMode(false);
      fetchProfile();
    } else {
      alert(res?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    const res = await changePassword(passwords);
    if (res?.success) {
      alert("Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } else {
      alert(res?.message || "Failed to change password");
    }
  };

  const handleLogout = async () => {
    const res = await logoutUser();
    if (res?.success) {
      navigate("/");
    } else {
      alert("Logout failed!");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>

      {!editMode ? (
        <div className="bg-white shadow rounded p-4">
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Mobile:</strong> {profile.mobile_number}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded p-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 w-full mb-2"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mobile Number"
            className="border p-2 w-full mb-2"
            value={form.mobile_number}
            onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-2 w-full mb-2"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
            Save
          </button>
          <button onClick={() => setEditMode(false)} className="bg-gray-400 text-white px-3 py-1 rounded">
            Cancel
          </button>
        </div>
      )}

      {/* Change Password */}
      <div className="bg-white shadow rounded p-4 mt-6">
        <h2 className="font-bold mb-2">Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          className="border p-2 w-full mb-2"
          value={passwords.oldPassword}
          onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
        />
        <input
          type="password"
          placeholder="New Password"
          className="border p-2 w-full mb-2"
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />
        <button onClick={handleChangePassword} className="bg-purple-500 text-white px-3 py-1 rounded">
          Change Password
        </button>
      </div>

      {/* Logout */}
      <div className="mt-6">
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}
