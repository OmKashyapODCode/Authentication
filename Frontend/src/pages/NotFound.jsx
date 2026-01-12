import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
      <p className="text-2xl text-gray-700 mb-8">Page Not Found</p>
      <Link to="/" className="text-blue-600 hover:text-blue-800 text-lg font-medium">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;