import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">AuthApp</Link>
        <nav>
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">Welcome, {user.name}</span>
              <Link to="/profile" className="hover:text-blue-400">Profile</Link>
              <button
                onClick={() => logout(navigate)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:text-blue-400">Login</Link>
              <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;