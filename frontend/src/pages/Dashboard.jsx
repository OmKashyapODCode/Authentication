import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../apiIntercepter";

const Dashboard = () => {
  const [content, setContent] = useState("");
  
  async function fetchAdminData() {
    try {
      const { data } = await api.get(`/api/v1/admin`, {
        withCredentials: true,
      });

      setContent(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {content && (
            <div className="bg-white p-6 rounded-lg shadow-md text-xl font-medium text-gray-700">
                {content}
            </div>
        )}
    </div>
  );
};

export default Dashboard;