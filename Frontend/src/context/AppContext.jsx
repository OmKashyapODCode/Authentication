import { createContext, useContext, useEffect, useState } from "react";
import api from "../apiIntercepter";
import { toast } from "react-toastify";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  async function fetchUser() {
    setLoading(true);
    try {
      const { data } = await api.get("/me");

      setUser(data.user);
      setSessionInfo(data.sessionInfo || null);
      setIsAuth(true);
    } catch (error) {
      setUser(null);
      setSessionInfo(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  async function logoutUser(navigate) {
    try {
      const { data } = await api.post("/logout");
      toast.success(data.message);
      setIsAuth(false);
      setUser(null);
      setSessionInfo(null);
      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        setIsAuth,
        isAuth,
        user,
        sessionInfo,
        setUser,
        loading,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppData must be used within an AppProvider");
  }
  return context;
};
