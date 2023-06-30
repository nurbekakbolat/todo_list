import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@mui/material";
import "./signin.css";
import { Box, TextField, Typography } from "@mui/material";
import { Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import axios from "axios";
import AuthContext from "../Context/Context.jsx";
import styled from "styled-components";

const StyledLabel = styled.label`
  margin-top: 10px;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: normal;
  transition: font-weight 0.3s ease-in-out;

  &:hover {
    font-weight: bold;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const LoginButton = styled(Button)`
  font-size: 14px;
  padding: 6px 12px;
`;

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        {
          username,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { token, userId } = response.data;
      console.log(response.data);
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      setAuth({ token, userId });
      navigate("/todos");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Invalid username or password");
        setError(true);
        // Handle incorrect credentials error
      } else {
        console.log("An error occurred:", error.message);
        // Handle other errors
      }
    }
  };

  return (
    <div>
      <form onSubmit={login}>
        <Box
          sx={{
            width: "500px",
            height: "400px",
            backgroundImage:
              "linear-gradient(0deg, rgba(47,13,64,1) 0%, rgba(51,33,79,1) 50%, rgba(56,49,90,100) 100%)",
          }}
          backgroundColor="#2d0a40"
          margin="auto"
          maxWidth={400}
          display="flex"
          flexDirection={"column"}
          marginTop={10}
          borderRadius={10}
          padding={3}
          boxShadow={"5px 5px 10px #ccc"}
        >
          <Typography
            color={"#ffffff"}
            variant="h4"
            padding={3}
            textAlign="center"
          >
            Sign in
          </Typography>

          <TextField
            sx={{
              backgroundColor: "#5d5175",
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
              },
            }}
            label="Login"
            error={error}
            margin="normal"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(false);
            }}
            InputLabelProps={{
              sx: {
                color: "#8d86ad",
              },
            }}
          />
          <TextField
            variant="filled"
            sx={{
              backgroundColor: "#5d5175",
            }}
            label="Password"
            error={error}
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            InputLabelProps={{
              sx: {
                color: "#8d86ad",
              },
            }}
          />
          <Box display="flex" alignItems="center">
            <Checkbox
              sx={{
                color: "#eec110",
                "&.Mui-checked": {
                  color: "#eec110",
                },
              }}
              disableRipple
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              color="primary"
            />
            <Typography color={"white"}>Keep me signed in</Typography>
          </Box>
          <ButtonContainer>
            <LoginButton
              sx={{ backgroundColor: "#eec110" }}
              variant="contained"
              type="submit"
              endIcon={<LoginIcon />}
            >
              Login
            </LoginButton>
            <StyledLabel onClick={() => navigate("/")}>
              Don't have an account? Sign up
            </StyledLabel>
          </ButtonContainer>
        </Box>
      </form>
    </div>
  );
};

export default Signin;
