import React from "react";
import { AppData } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const { logoutUser, user } = AppData();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-600 pb-32">
        <header className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Hello, {user?.name || "User"}
            </h1>
            <p className="mt-1 text-indigo-100">Welcome to your control center.</p>
          </div>
        </header>
      </div>

      <main className="-mt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin Card */}
                {user && user.role === "admin" && (
                  <Link
                    to="/dashboard"
                    className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {/* Simple Icon Representation */}
                      <span className="text-2xl font-bold">D</span>
                    </div>
                    <span className="text-gray-900 font-medium group-hover:text-purple-700">Access Dashboard</span>
                    <span className="text-sm text-gray-500 mt-1">View admin stats</span>
                  </Link>
                )}

                {/* Logout Card */}
                <button
                  onClick={() => logoutUser(navigate)}
                  className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-500 hover:bg-red-50 transition-all duration-300"
                >
                  <div className="h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                     <span className="text-xl font-bold">➜</span>
                  </div>
                  <span className="text-gray-900 font-medium group-hover:text-red-700">Logout</span>
                  <span className="text-sm text-gray-500 mt-1">End your session safely</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;