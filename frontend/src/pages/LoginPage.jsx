import React, { useState } from "react";
import { useForm } from "react-hook-form";
import login from "../services/authServices";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../services/axiosInstance";

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
      const email = data.email;
      const password = data.password;

      const response = await axiosInstance.post("/token/", {
        email,
        password,
      });

      const { access, refresh, role, name, id } = response.data;

      userLogin({
        token: access,
        refreshToken: refresh,
        role,
        name,
        id,
      });

      if (role === "admin") {
        navigate("/admin-pannel");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.error || error.message || "Login failed";

      setLoginError(errMsg);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitForm)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        {loginError && <p>{loginError}</p>}
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
