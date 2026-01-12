import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { server } from "../main";
import Loding from "../Loding";

const Verify = () => {
  const [status, setStatus] = useState({ success: "", error: "" });
  const params = useParams();
  const [loading, setLoading] = useState(true);

  async function verifyUser() {
    try {
      const { data } = await axios.post(`${server}/api/v1/verify/${params.token}`);
      setStatus({ success: data.message, error: "" });
    } catch (error) {
      setStatus({ success: "", error: error.response.data.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { verifyUser(); }, []);

  if (loading) return <Loding />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center">
        {status.success && (
          <div className="space-y-4">
             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500 text-3xl">✓</div>
             <h2 className="text-2xl font-bold text-gray-800">Success!</h2>
             <p className="text-gray-600">{status.success}</p>
             <Link to="/login" className="inline-block mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">Login Now</Link>
          </div>
        )}
        
        {status.error && (
          <div className="space-y-4">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500 text-3xl">!</div>
             <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
             <p className="text-red-500 font-medium">{status.error}</p>
             <Link to="/login" className="inline-block mt-4 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">Return to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;