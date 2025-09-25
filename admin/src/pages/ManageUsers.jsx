import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAllUsers();
    if (res?.success) {
      setUsers(res.data);
    } else {
      setUsers([]);
    }
    setLoading(false);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const res = await deleteUser(id);
    if (res?.success) {
      setUsers(users.filter((u) => u._id !== id));
    } else {
      alert(res?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => navigate(`/users/${user._id}`)}
              className="bg-white shadow-md rounded-xl p-4 border cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-2 text-gray-800">
                {user.full_name}
              </h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Mobile:</strong> {user.mobile_number || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {user.address || "N/A"}
              </p>
              <p>
                <strong>District:</strong> {user.district || "N/A"}
              </p>
              <button
                onClick={(e) => handleDelete(e, user._id)}
                className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
