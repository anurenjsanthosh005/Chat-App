import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../services/axiosInstance";

import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

function LoginPage() {
  const { userLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const submitForm = async (data) => {
    try {
      console.log("INSIDE THE SUBMI");

      const { email, password } = data;
      const response = await axiosInstance.post("/token/", { email, password });
      const { access, refresh, role, name, id } = response.data;

      userLogin({ token: access, refreshToken: refresh, role, name, id });

      if (role === "admin") {
        navigate("/admin-pannel");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.detail ===
        "No active account found with the given credentials"
          ? "Invalid credentials"
          : error.response?.data?.detail || error.message || "Login failed";

      setLoginError(errMsg);
    }
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",
        animation: "gradient 10s ease infinite",
        background:
          "linear-gradient(-45deg, #ff6b6b, #ff8e53, #f06292, #ce93d8)",
        backgroundSize: "400% 400%",
        "@keyframes gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          bgcolor: "transparent",
        }}
      >
        <Typography variant="h3" fontWeight="bold" sx={{ color: "#f6eced" }}>
          Init Chat.
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 5,
          animation: "gradientRight 12s ease infinite",
          background: "linear-gradient(135deg, #ca7481, #c94f62, #a53a4d)",
          backgroundSize: "300% 300%",
          "@keyframes gradientRight": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" },
          },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(submitForm)}
          sx={{ width: "100%", maxWidth: 400 }}
        >
          <Typography
            variant="h4"
            mb={3}
            fontWeight="medium"
            sx={{ color: "#f5e8ea", fontWeight: "bold" }}
          >
            Login.
          </Typography>
          {loginError && (
            <Typography severity="error" sx={{ mt: 2 }}>
              {loginError}
            </Typography>
          )}
          <TextField
            placeholder="Email"
            fullWidth
            margin="dense"
            color="white"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "Invalid email format",
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
            sx={{
              width: 400,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
              },
              "& .MuiInputBase-input": {
                padding: "8px 12px",
                fontSize: "1rem",
                color: "#333",
              },
              "& .MuiOutlinedInput-root.Mui-error fieldset": {
                borderColor: "white",
              },
              "& .MuiFormHelperText-root": {
                color: "white",
              },
              "& .MuiFormHelperText-root.Mui-error": {
                color: "white",
              },
            }}
          />

          <TextField
            placeholder="Password"
            type="password"
            fullWidth
            margin="dense"
            {...register("password", {
              required: "Password is required",
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
           sx={{
              width: 400,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
              },
              "& .MuiInputBase-input": {
                padding: "8px 12px",
                fontSize: "1rem",
                color: "#333",
              },
              "& .MuiOutlinedInput-root.Mui-error fieldset": {
                borderColor: "white",
              },
              "& .MuiFormHelperText-root": {
                color: "white",
              },
              "& .MuiFormHelperText-root.Mui-error": {
                color: "white",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 4, bgcolor: "#792830", fontWeight:'600'}}
          >
            Login
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default LoginPage;
