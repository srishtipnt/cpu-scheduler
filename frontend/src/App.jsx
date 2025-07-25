import React from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/authContext";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
       
      <Navbar />
        <Toaster position="top-right" richColors />
        <Outlet />
    
    </>
  );
};

export default App;
