import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../apiIntercepter";

const Dashboard = () => {
  const [content, setContent] = useState("");
  
  async function fetchAdminData() {
    try {
      const { data } = await api.get(`/admin`, { withCredentials: true });
      setContent(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => { fetchAdminData(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
       {content && (
         <div className="bg-white w-full max-w-4xl p-8 rounded-xl shadow-lg border-l-4 border-indigo-500">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
            <div className="p-4 bg-indigo-50 text-indigo-800 rounded-lg font-mono">
               {content}
            </div>
         </div>
       )}
    </div>
  );
};

export default Dashboard;