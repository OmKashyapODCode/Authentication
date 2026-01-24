import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import Myprofile from "./pages/Myprofile";
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { AppData } from "./context/AppContext";
import Loding from "./Loding";
import { ToastContainer } from "react-toastify";

const App = () => {
  const { isAuth, loading } = AppData();

  return loading ? (
    <Loding />
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuth ? <Home /> : <Login />} />
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/register" element={isAuth ? <Home /> : <Register />} />
        <Route path="/verify" element={isAuth ? <Home /> : <VerifyOtp />} />
        <Route path="/token/:token" element={isAuth ? <Home /> : <Verify />} />

        <Route
          path="/forgot-password"
          element={isAuth ? <Home /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password/:token"
          element={isAuth ? <Home /> : <ResetPassword />}
        />

        <Route
          path="/admin"
          element={
            <Admin>
              <Dashboard />
            </Admin>
          }
        />
        <Route path="/me" element={isAuth ? <Myprofile /> : <Register />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
