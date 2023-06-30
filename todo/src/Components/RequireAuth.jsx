import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../Context/Context.jsx";

const RequireAuth = ({ element }) => {
  const { auth } = useContext(AuthContext);

  console.log(auth.token, localStorage.token);
  if (auth.token !== localStorage.getItem("token")) {
    // If not authenticated, redirect to the signin page
    return <Navigate to="/signin" replace />;
  }

  return element;
};

export default RequireAuth;
