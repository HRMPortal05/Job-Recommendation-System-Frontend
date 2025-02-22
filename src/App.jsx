import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/main/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./index.css";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <SpeedInsights />
        <Outlet />
      </main>
    </div>
  );
};

export default App;
