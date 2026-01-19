import React, { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";
import { useNavigate } from "react-router-dom";
import { loginUser, resetAuthStatus } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { Status } from "../../globals/statuses";
import { useAppSelector } from "../../hooks/hooks";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {status, token} = useAppSelector((state) => state.auth);

  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    let hasError = false;
    const newErrors = { username: "", email: "", password: "", general: "" };

    // Basic required field check
    if (!userData.email) {
      newErrors.email = "Email is required";
      hasError = true;
    }
    if (!userData.password) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    // Early exit only for required fields (keep other backend checks)
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    if (!validateEmail(userData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    dispatch(loginUser(userData))
      // .then(() => {
      //   // Success handling (moved out of useEffect)
      //   setMessage("Login successful!");
      //   setUserData({ email: "", password: "" });
      //   setErrors({ email: "", password: "", general: "" });

      //   setTimeout(() => {
      //     setMessage("");
      //     // console.log(status)
      //     navigate("/");
      //   }, 2000); 
      // })
      .catch((error) => {
        // Error: handle here
        const errData = error?.response?.data || error?.data;

        if (
          errData &&
          error?.response?.status >= 400 &&
          error?.response?.status < 500
        ) {
          const field = errData.field;
          const msg = errData.message || "Login failed";

          if (field && ["email", "password", "general"].includes(field)) {
            setErrors((prev) => ({ ...prev, [field]: msg }));
          } else {
            setErrors((prev) => ({ ...prev, general: msg }));
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            general: "Something went wrong. Please try again.",
          }));
        }
      });
  };

  useEffect(() => {
    if (status === Status.SUCCESS && token) {
      setTimeout(() => {
      setMessage("Login successful");
      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 2000);
      }, 0);
      dispatch(resetAuthStatus());
      console.log("Status Changed to:", status);
    } else if (status === Status.ERROR) {
      if (!errors.general) {
        setTimeout(() => {
          setErrors((prev) => ({
            ...prev,
            general: "Login failed!",
          }));
        }, 0);
      }
    }

    // Check logout success from query parameter
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("logout") === "true") {
      setTimeout(() => {
        setMessage("Logout successful");
        setTimeout(() => {
          setMessage("");
          navigate("/login", { replace: true });
        }, 2000);
      }, 0); 
      dispatch(resetAuthStatus());
      console.log("Status Changed to:", status);
    }
  }, [navigate, status, errors, token, dispatch]);

  return (
    <>
      <AuthForm
        type="login"
        onSubmit={handleSubmit}
        onChange={handleChange}
        values={userData}
        errors={errors}
        message={message}
      />
    </>
  );
};

export default Login;
