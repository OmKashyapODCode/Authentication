import { createContext, useContext, useEffect, useState } from "react";
import { getMyProfile, logout as logoutApi } from "../api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch logged-in user (used on app load & after OTP verification)
   */
  const fetchUser = async () => {
    try {
      const res = await getMyProfile();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async (navigate) => {
    try {
      await logoutApi();
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  // Run once on app load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        fetchUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
