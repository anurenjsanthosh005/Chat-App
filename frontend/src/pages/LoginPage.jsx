import React, { useState } from "react";
import { useForm } from "react-hook-form";
import login from "../services/authServices";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
      const response = await login(email, password);

      console.log("token :", response.token);
      console.log("role :", response.role);

      userLogin({ token: response.token, role: response.role });

      //   localStorage.setItem("token", response.token);
      //   localStorage.setItem("role", response.role);

      if (response.role === "admin") {
        navigate("/admin-pannel");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setLoginError(error.message);
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
