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

   // Password strength state
    const [passwordStrength, setPasswordStrength] = useState({
      score: 0,
      label: "",
      color: "bg-gray-200",
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));

      // Calculate password strength only for newPassword field
    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

    // Password strength calculation function
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "", color: "bg-gray-200" });
      return;
    }

    let score = 0;

    // Length
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Final strength level
    let label = "";
    let color = "";

    switch (true) {
      case score <= 2:
        label = "Weak";
        color = "bg-red-500";
        break;
      case score === 3:
        label = "Fair";
        color = "bg-orange-500";
        break;
      case score === 4:
        label = "Good";
        color = "bg-yellow-500";
        break;
      case score === 5:
        label = "Strong";
        color = "bg-green-500";
        break;
      case score >= 6:
        label = "Very Strong";
        color = "bg-indigo-600";
        break;
      default:
        label = "";
        color = "bg-gray-200";
    }

    setPasswordStrength({ score, label, color });
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
            setTimeout(() => {
              setErrors((prev) => ({ ...prev, [field]: msg }));
            }, 2000);
          } else {
            setTimeout(() => {
              setErrors((prev) => ({ ...prev, general: msg }));
            }, 2000);
          }
        } else {
          setTimeout(() => {
            setErrors((prev) => ({
            ...prev,
            general: "Something went wrong. Please try again.",
          }));
          }, 2000);
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
        }, 1000);
      }, 0); 
      dispatch(resetAuthStatus());
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
        passwordStrength={passwordStrength}
      />
    </>
  );
};

export default Login;
