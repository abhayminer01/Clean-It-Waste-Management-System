import React from 'react'
import { userLogin } from '../services/auth-api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          const payload = { email, password, location };
          const res = await userLogin(payload);

          if (res?.success) {
            navigate("/home");
          } else {
            alert(res?.message || "Login failed!");
          }
        },
        (err) => {
          console.error("Location error:", err);

          const payload = { email, password };
          userLogin(payload).then((res) => {
            if (res?.success) {
              navigate("/home");
            } else {
              alert(res?.message || "Login failed!");
            }
          });
        }
      );
    } else {
      const payload = { email, password };
      const res = await userLogin(payload);
      if (res?.success) {
        navigate("/home");
      } else {
        alert(res?.message || "Login failed!");
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleForm}
        className="flex flex-col gap-10 items-center bg-green-100 mt-10"
      >
        <h1>Login Form</h1>
        <div>
          <label>Email : </label>
          <input
            name="email"
            className="border border-solid rounded-lg px-1"
            type="email"
          />
        </div>
        <div>
          <label>Password : </label>
          <input
            name="password"
            className="border border-solid rounded-lg px-1"
            type="password"
          />
        </div>
        <p>
          Dont have an account?{" "}
          <span
            className="text-green-600 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
        <p>
          Industrial User ?{" "}
          <span
            className="text-green-600 cursor-pointer"
            onClick={() => navigate("/industry/login")}
          >
            Click here
          </span>
        </p>
        <input
          className="bg-green-500 px-10 py-1 rounded-lg"
          type="submit"
        />
      </form>
    </div>
  );
}
