import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import VerifyOtp from "./pages/VerifyOtp";
import { AppData } from "./context/AppContext";
import Loding from "./Loding";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const { isAuth, loading } = AppData();
  return (
    <>
      {loading ? (
        <Loding />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
            <Route
              path="/verifyotp"
              element={isAuth ? <Home /> : <VerifyOtp />}
            />
            <Route
              path="/token/:token"
              element={isAuth ? <Home /> : <Verify />}
            />
            <Route
              path="/dashboard"
              element={isAuth ? <Dashboard /> : <Login />}
            />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
