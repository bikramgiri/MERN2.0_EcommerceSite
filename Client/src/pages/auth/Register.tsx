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
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
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
        password: "Password must be at least 6 characters long",
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
      console.log("Status Changed to:", status);
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
      />
    </>
  );
};

export default Register;
