import React from "react";
import { AppData } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const { logoutUser, user } = AppData();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 gap-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || "User"}!</h1>
      
      <div className="flex gap-4">
        {user && user.role === "admin" && (
          <Link
            to="/dashboard"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Dashboard
          </Link>
        )}
        
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
          onClick={() => logoutUser(navigate)}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;