import { Navigate } from "react-router-dom";
import { AppData } from "../context/AppContext";
import Loding from "../Loding";

const Admin = ({ children }) => {
  const { isAuth, user, loading } = AppData();

  if (loading) return <Loding />;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Admin;
