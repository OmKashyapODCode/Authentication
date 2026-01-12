import React, { useState } from "react";
import { Link } from "react-router-dom";
import { server } from "../main";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // NEW

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/v1/register`, {
        name,
        email,
        password,
      });
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={submitHandler}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Sign Up
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 py-2 px-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 py-2 px-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password with Show / Hide */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 py-2 px-3 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-500 hover:text-indigo-600 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          className="w-full text-white bg-indigo-500 py-2 px-6 hover:bg-indigo-600 rounded text-lg transition-colors"
          disabled={btnLoading}
        >
          {btnLoading ? "Signing Up..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:text-indigo-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
