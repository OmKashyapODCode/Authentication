import React from "react";

const Loding = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Animated Spinner */}
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-indigo-600 font-medium animate-pulse">Loading Application...</p>
      </div>
    </div>
  );
};

export default Loding;