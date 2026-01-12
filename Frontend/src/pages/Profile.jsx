import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Profile = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        window.history.replaceState({}, document.title);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return <div className="text-center mt-10">Loading profile data...</div>;
  }

  if (!user) {
    return <div className="text-center mt-10 text-red-500">User not logged in.</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Profile</h2>

      {successMessage && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded-lg border border-green-300 transition duration-300">
          {successMessage}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Name:</span>
          <span className="text-gray-800">{user.name}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Email:</span>
          <span className="text-gray-800">{user.email}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Role:</span>
          <span className="text-gray-800 capitalize">{user.role}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">Member Since:</span>
          <span className="text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-gray-500 text-center">
        This is a protected route, accessible only when authenticated.
      </p>
    </div>
  );
};

export default Profile;