import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../main";
import { toast } from "react-toastify";
import { AppData } from "../context/AppContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuth, setUser } = AppData();

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();

    const email = localStorage.getItem("email");
    try {
      const { data } = await axios.post(
        `${server}/api/v1/verify`,
        { email, otp },
        { withCredentials: true }
      );

      toast.success(data.message);
      setIsAuth(true);
      setUser(data.user);
      localStorage.removeItem("email"); // Changed clear to removeItem for safety
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
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
          Verify OTP
        </h2>

        <div className="mb-6">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
            OTP Code
          </label>
          <input
            type="number"
            id="otp"
            className="w-full bg-gray-50 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base outline-none py-2 px-3 transition-colors duration-200 ease-in-out"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        <button
          className="w-full text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg transition-colors"
          disabled={btnLoading}
        >
          {btnLoading ? "Verifying..." : "Verify"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/login" className="text-indigo-500 hover:text-indigo-600">
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default VerifyOtp;