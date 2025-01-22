import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/main/Navbar";
import "./index.css";

const App = () => {
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
