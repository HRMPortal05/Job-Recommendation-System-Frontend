import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/main/Navbar";
import "./index.css";
import NotificationInitializer from "./components/fields_hooks/NotificationInitializer";
import NotificationButton from "./components/fields_hooks/NotificationButton";

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
      {/* <NotificationInitializer /> */}
      <Navbar />
      <NotificationButton />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
