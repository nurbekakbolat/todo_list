import React from "react";
import axios from "axios";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Typography } from "@mui/material";
import { Button } from "@mui/material";
import { useState } from "react";
import InputIcon from "@mui/icons-material/Input";

const Signup = () => {
  const [signed, setsigned] = useState(false);
  const [exists, setExists] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
    repeatPass: "",
  });
  const [wrong, setWrong] = useState(false);
  const handleClick = () => {};
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.password != input.repeatPass) {
      setWrong(true);

      return;
    }
    axios
      .post("http://localhost:3000/register", input)
      .then((res) => {
        console.log("Successfully added user");
        navigate("/todos");
      })
      .catch((err) => {
        if (err.response.status === 409) {
          setExists(true);
        }
        setInput({ email: "", password: "" });

        console.error(err);
      });
  };
  const handleChange = (e) => {
    setWrong(false);
    setInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
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
            text-align="center"
          >
            Registration form
          </Typography>
          <TextField
            variant="outlined"
            sx={{
              backgroundColor: "#5d5175",
            }}
            InputLabelProps={{
              sx: {
                color: "#8d86ad",
              },
            }}
            InputProps={{
              sx: {
                color: "#ffffff",
              },
            }}
            label="Email"
            value={input.email}
            onChange={handleChange}
            name="email"
            type={"text"}
            margin="normal"
          />
          <TextField
            variant="filled"
            sx={{
              backgroundColor: "#5d5175",
            }}
            label={wrong ? "Passwords don't match" : "Password"}
            value={input.password}
            onChange={handleChange}
            name="password"
            type={"password"}
            margin="normal"
            error={wrong}
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
            label={wrong ? "Passwords don't match" : "Repeat password"}
            value={input.repeatPass}
            onChange={handleChange}
            name="repeatPass"
            type={"password"}
            margin="normal"
            error={wrong}
            InputLabelProps={{
              sx: {
                color: "#8d86ad",
              },
            }}
          />
          <div className="btn-signUp">
            <Button
              sx={{ backgroundColor: "#eec110" }}
              endIcon={<InputIcon />}
              type="submit"
              variant="contained"
            >
              Register
            </Button>
            <Button
              sx={{ ml: 2, backgroundColor: "#eec110" }}
              variant="contained"
              onClick={() => navigate("/signin")}
            >
              Already have an account?
            </Button>
          </div>
        </Box>
      </form>
    </div>
  );
};

export default Signup;
