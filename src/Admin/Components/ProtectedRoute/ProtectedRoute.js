import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // If user is logged in, render the child routes (e.g., Dashboard)
  // Otherwise, redirect to the login page
  return isLoggedIn ? <Outlet /> : <Navigate to="/Login" />;
};

export default ProtectedRoute;