import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/main/Navbar";
import "./index.css";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("Location search:", location.search);
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    console.log("Token:", token);

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage");
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
