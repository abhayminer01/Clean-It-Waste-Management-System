import React from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../services/api'

export default function LoginPage() {
  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault(); // 👈 stop form from refreshing / appending data to URL

    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    const res = await adminLogin(payload); // 👈 renamed to res (more clear)

    if (res?.success) {
      navigate("/dashboard");
    } else {
      alert(res?.message || "Login failed!");
    }
  };

  return (
    <div>
      <form onSubmit={handleForm}>
        <h1>Admin login</h1>
        <div>
          <label>Email :</label>
          <input type="email" name="email" />
        </div>
        <div>
          <label>Password :</label>
          <input type="password" name="password" />
        </div>
        <input type="submit" />
      </form>
    </div>
  );
}
