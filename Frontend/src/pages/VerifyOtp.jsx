import React, { useState } from 'react';
import { verifyOtp } from '../api/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchUser } = useAuth();
  
  const initialEmail = location.state?.email || '';
  const initialMessage = location.state?.message || 'Please check your email for the OTP.';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsLoading(true);

    try {
      const res = await verifyOtp({ email, otp });
      
      await fetchUser(); 
      
      navigate('/profile', { replace: true, state: { successMessage: res.data.message } });

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'OTP verification failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Verify OTP</h2>
      <p className="mb-4 text-center text-gray-600">
        Enter the 6-digit code sent to <strong>{email || 'your email'}</strong>.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {message && <div className="p-3 bg-blue-100 text-blue-700 rounded border border-blue-300">{message}</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded border border-red-300">{error}</div>}
        
        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="otp">Verification Code (OTP)</label>
          <input
            type="text"
            id="otp"
            name="otp"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1" htmlFor="emailInput">Email (for verification)</label>
          <input
            type="email"
            id="emailInput"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="Enter email if not pre-filled"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.length !== 6 || email.length === 0}
          className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;