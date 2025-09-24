import React from 'react'
import { useNavigate } from 'react-router-dom'
import { loginIndustry } from '../../services/industry-api';

export default function IndustryLogin() {
  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault();

    const payload = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await loginIndustry(payload); // 👈 call API, not component

      if (res?.success) {
        navigate("/industry/home");
      } else {
        alert(res?.message || "Login failed!");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div>
      <form onSubmit={handleForm} className="flex flex-col gap-10 items-center bg-green-100 mt-10">
        <h1>Industrial Login Form</h1>

        <div>
          <label>Email : </label>
          <input name="email" className="border border-solid rounded-lg px-1" type="email" />
        </div>

        <div>
          <label>Password : </label>
          <input name="password" className="border border-solid rounded-lg px-1" type="password" />
        </div>

        <p>
          Dont registered your industry ?{" "}
          <span className="text-green-600 cursor-pointer" onClick={() => navigate("/industry/register")}>
            Register
          </span>
        </p>

        <input className="bg-green-500 px-10 py-1 rounded-lg" type="submit" />
      </form>
    </div>
  );
}
