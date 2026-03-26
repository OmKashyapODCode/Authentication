import React, { useEffect, useState } from "react";
import { AppData } from "../context/AppContext";
import api from "../apiIntercepter";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logoutUser, sessionInfo } = AppData();
  const [adminData, setAdminData] = useState("");
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const navigate = useNavigate();

  async function fetchAdminData() {
    setLoadingAdmin(true);
    try {
      const { data } = await api.get("/admin");
      setAdminData(data.message);
    } catch (error) {
      toast.error("Failed to load admin data");
    } finally {
      setLoadingAdmin(false);
    }
  }

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <button
            onClick={() => logoutUser(navigate)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-indigo-500">
          <h2 className="text-lg font-semibold mb-4">User Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <p><span className="font-semibold">Name:</span> {user?.name}</p>
            <p><span className="font-semibold">Email:</span> {user?.email}</p>

            <p>
              <span className="font-semibold">Role:</span>{" "}
              <span className={`px-2 py-1 rounded text-xs ${
                user?.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {user?.role}
              </span>
            </p>

            <p>
              <span className="font-semibold">Verified:</span>{" "}
              {user?.isVerified ? (
                <span className="text-green-600">Yes</span>
              ) : (
                <span className="text-red-600">No</span>
              )}
            </p>
          </div>
        </div>

        {/* SESSION INFO (BIG PLUS POINT 🔥) */}
        {sessionInfo && (
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <h2 className="text-lg font-semibold mb-4">Session Info</h2>

            <div className="text-sm space-y-2">
              <p><span className="font-semibold">Session ID:</span> {sessionInfo.sessionId}</p>
              <p><span className="font-semibold">Login Time:</span> {sessionInfo.loginTime}</p>
              <p><span className="font-semibold">Last Activity:</span> {sessionInfo.lastActivity}</p>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate("/reset-password")}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              Reset Password
            </button>

            <button
              onClick={() => navigate("/me")}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg"
            >
              View Profile
            </button>
          </div>
        </div>

        {/* ADMIN PANEL */}
        {user?.role === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
            <h2 className="text-lg font-semibold mb-4">
              Admin Panel
            </h2>

            {loadingAdmin ? (
              <p className="text-gray-500">Loading admin data...</p>
            ) : adminData ? (
              <div className="p-4 bg-purple-50 text-purple-800 rounded-lg font-mono">
                {adminData}
              </div>
            ) : (
              <p className="text-gray-500">No admin data</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;