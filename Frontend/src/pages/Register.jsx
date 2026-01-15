import React, { useState } from "react";
import { Link } from "react-router-dom";
import { server } from "../main";
import { toast } from "react-toastify";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // ADD
  const [btnLoading, setBtnLoading] = useState(false);

  // Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setBtnLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(`${server}/register`, {
        name,
        email,
        password,
        role,
      });

      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("user");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBtnLoading(false);
    }
  };

  
  const EyeIcon = ({ visible, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer focus:outline-none"
    >
      {visible ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">

        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us to get started today
          </p>
        </div>

        {/* ROLE TOGGLE */}
        <div className="flex border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`w-1/2 py-2 font-medium ${
              role === "user"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`w-1/2 py-2 font-medium ${
              role === "admin"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Admin
          </button>
        </div>

        <form className="mt-4 space-y-5" onSubmit={submitHandler}>
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                placeholder="••••••••"
              />
              <EyeIcon visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                placeholder="••••••••"
              />
              <EyeIcon visible={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            </div>
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
              btnLoading
                ? "bg-indigo-400"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
            } transition-all duration-200`}
          >
            {btnLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="text-center mt-2">
            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
