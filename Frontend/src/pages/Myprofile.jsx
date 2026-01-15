import React from "react";
import { AppData } from "../context/AppContext";

const Myprofile = () => {
  const { user, sessionInfo } = AppData();

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white w-full max-w-4xl p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <span className="font-semibold">Name</span>
            <div>{user?.name}</div>
          </div>

          <div>
            <span className="font-semibold">Email</span>
            <div>{user?.email}</div>
          </div>

          <div>
            <span className="font-semibold">Role</span>
            <div>{user?.role}</div>
          </div>

          {sessionInfo && (
            <>
              <div>
                <span className="font-semibold">Session ID</span>
                <div className="break-all">{sessionInfo.sessionId}</div>
              </div>

              <div>
                <span className="font-semibold">Login Time</span>
                <div>{sessionInfo.loginTime}</div>
              </div>

              <div>
                <span className="font-semibold">Last Activity</span>
                <div>{sessionInfo.lastActivity}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
