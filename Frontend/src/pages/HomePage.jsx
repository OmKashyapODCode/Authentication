import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Welcome to the Secure Auth System</h1>
      <p className="text-xl text-gray-600 mb-8">
        Built with Express, MongoDB, Redis, and React (Vite).
      </p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition duration-300">
          Login
        </Link>
        <Link to="/register" className="bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg text-lg hover:bg-gray-300 transition duration-300">
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;