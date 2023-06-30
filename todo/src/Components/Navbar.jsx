import React, { useContext } from "react";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Context/Context.jsx";

function Navbar() {
  const Bar = styled.nav`
    width: 100%;
    z-index: 14;
    font-size: 1.5em;
    display: flex;
    top: 0;
    position: fixed;
    height: 40px;
    background-color: #343a40;
    align-items: center;
    justify-content: space-between;
  `;

  const Button = styled.button`
    position: relative;
    background-color: #007bff;
    margin-top: 25px;
    margin-bottom: 25px;
    height: 70%;
    margin-right: 25px;
    width: 75px;
    font-size: 0.5em;
    padding: 0 8px;
  `;

  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const logout = () => {
    console.log(auth.token, localStorage.getItem("token"));
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    console.log(auth.token, localStorage.getItem("token"));
    navigate("/signin");
  };

  return (
    <div>
      <Bar>
        <Typography sx={{ ml: 2 }} color={"black"}>
          admin
        </Typography>
        {localStorage.getItem("token") ? (
          <Button onClick={logout}>Logout</Button>
        ) : (
          <Button onClick={() => navigate("/signin")}>Login</Button>
        )}
      </Bar>
    </div>
  );
}

export default Navbar;
