import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../apiIntercepter";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [content, setContent] = useState("");

  async function fetchAdminData() {
    try {
      const { data } = await api.get(`/admin`);
      setContent(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white w-full max-w-4xl p-8 rounded-xl shadow-lg border-l-4 border-indigo-500">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {content && (
          <div className="p-4 bg-indigo-50 text-indigo-800 rounded-lg font-mono mb-8">
            {content}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/me"
            className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300"
          >
            <div className="h-12 w-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold">P</span>
            </div>
            <span className="text-gray-900 font-medium">
              My Profile
            </span>
            <span className="text-sm text-gray-500 mt-1">
              View account and session details
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
