import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../main";
import Loding from "../Loding";

const Verify = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const params = useParams();
  const [loading, setLoading] = useState(true);

  async function verifyUser() {
    try {
      const { data } = await axios.post(
        `${server}/api/v1/verify/${params.token}`
      );
      setSuccessMessage(data.message);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <>
      {loading ? (
        <Loding />
      ) : (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            {successMessage && (
              <p className="text-green-500 text-2xl font-bold mb-4">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-2xl font-bold mb-4">{errorMessage}</p>
            )}
            <a href="/login" className="text-indigo-500 underline">Go to Login</a>
          </div>
        </div>
      )}
    </>
  );
};

export default Verify;