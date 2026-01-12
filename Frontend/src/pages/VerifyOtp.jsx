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
      localStorage.removeItem("email");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Security Check</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">Please enter the OTP sent to your email.</p>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">One-Time Password</label>
            <input
              type="number"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="000000"
            />
          </div>

          <button
            disabled={btnLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
              btnLoading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
            } transition-all duration-200`}
          >
            {btnLoading ? "Verifying..." : "Confirm Code"}
          </button>
          
          <div className="text-center">
             <Link to="/login" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;