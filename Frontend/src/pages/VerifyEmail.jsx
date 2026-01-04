import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../api/auth';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // If no token found in the URL
    if (!token) {
      setMessage('No verification token provided.');
      setStatus('error');
      return;
    }

    let isCancelled = false;

    const attemptVerification = async () => {
      try {
        const res = await verifyEmail(token);

        // prevent state update if component unmounted or re-run
        if (!isCancelled) {
          setMessage(res.data?.message || 'Email verified successfully!');
          setStatus('success');
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMessage =
            err.response?.data?.message ||
            'The verification link is invalid or has expired.';
          setMessage(errorMessage);
          setStatus('error');
        }
      }
    };

    attemptVerification();

    // cleanup to prevent duplicate API calls
    return () => {
      isCancelled = true;
    };
  }, [token]);

  const getStatusContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-blue-600">Verifying Email...</h2>
            <p className="mt-2 text-gray-600">
              Please wait while we confirm your account.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center text-green-700">
            <h2 className="text-2xl font-bold">✅ Verification Successful!</h2>
            <p className="mt-4">{message}</p>
            <Link
              to="/login"
              className="mt-6 inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Go to Login
            </Link>
          </div>
        );
      case 'error':
        return (
          <div className="text-center text-red-700">
            <h2 className="text-2xl font-bold">❌ Verification Failed</h2>
            <p className="mt-4">{message}</p>
            <Link
              to="/register"
              className="mt-6 inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Re-register
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl">
      {getStatusContent()}
    </div>
  );
};

export default VerifyEmail;
