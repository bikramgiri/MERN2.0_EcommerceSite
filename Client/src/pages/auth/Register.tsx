import React, { useEffect, useState } from "react";
import AuthForm from "./components/AuthForm";
import { useNavigate } from "react-router-dom";
import { registerUser, resetAuthStatus } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Status } from "../../globals/statuses";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  console.log("Auth Status:", status);

  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    general: "",
  });

  // Reset auth state on component mount
  // useEffect(() => {
  //   dispatch(resetAuth()); // Reset auth state
  // }, [dispatch, status]);

  // Password strength state
    const [passwordStrength, setPasswordStrength] = useState({
      score: 0,
      label: "",
      color: "bg-gray-200",
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
      general: "",
    });

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

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ username: "", email: "", password: "", general: "" });

    let hasError = false;
    const newErrors = { username: "", email: "", password: "", general: "" };

    // Basic required field check
    if (!userData.username) {
      newErrors.username = "Username is required";
      hasError = true;
    }
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

    // Validate email
    if (!validateEmail(userData.email)) {
      setErrors({ ...errors, email: "Invalid email format" });
      return;
    }

    // Validate password
    if (!validatePassword(userData.password)) {
      setErrors({
        ...errors,
        password: "Password must be at least 8 characters long",
      });
      return;
    }

    dispatch(registerUser(userData))
      // .then(() => {
      //   setMessage("Registration successful!");
      //   setUserData({ username: "", email: "", password: "" });
      //   setErrors({ username: "", email: "", password: "", general: "" });

      //   setTimeout(() => {
      //     setMessage("");
      //     navigate("/login"); // or keep commented
      //   }, 3000);
      // })
      .catch((error) => {
        const errData = error?.response?.data || error?.data;

        if (
          errData &&
          error?.response?.status >= 400 &&
          error?.response?.status < 500
        ) {
          const field = errData.field;
          const msg = errData.message || "Validation error";

          if (
            field &&
            ["username", "email", "password", "general"].includes(field)
          ) {
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
    if (status === Status.SUCCESS) {
      setTimeout(() => {
        setMessage("Registration successful!");
        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 4000);
      }, 0);
      dispatch(resetAuthStatus());
    } else if (status === Status.ERROR) {
      if (!errors.general) {
        setTimeout(() => {
          setErrors((prev) => ({
            ...prev,
            general: "Registration failed!",
          }));
        }, 0);
      }
    }
  }, [status, navigate, errors, dispatch]);

  return (
    <>
      <AuthForm
        type="register"
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

export default Register;
