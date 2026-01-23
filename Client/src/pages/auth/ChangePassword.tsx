import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Status } from "../../globals/statuses";
import { changePassword } from "../../store/authSlice";
import { Loader2 } from "lucide-react";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
    general: "",
  });

  const [message, setMessage] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (name === "newPassword" || name === "confirmPassword") {
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
    setErrors({ email: "", otp: "", newPassword: "", confirmPassword: "", general: "" });
    setMessage("");

    let hasError = false;

    if (!userData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      hasError = true;
    }

    if (!userData.otp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      hasError = true;
    }

    if (!userData.newPassword) {
      setErrors((prev) => ({ ...prev, newPassword: "New password is required" }));
      hasError = true;
    }

    if (!userData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Confirm password is required" }));
      hasError = true;
    }

    if (hasError) return;

    if (!validateEmail(userData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(userData.otp)) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be a 6-digit number" }));
      return;
    }

    if (userData.newPassword !== userData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    dispatch(changePassword(userData))
      .then(() => {
        setMessage("Password changed successfully!");
        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 2000);
      })
      .catch((error) => {
        const errMsg =
          error?.response?.data?.message ||
          "Failed to change password. Please try again.";

        if (error?.response?.status === 400 || error?.response?.status === 404) {
          setErrors((prev) => ({ ...prev, general: errMsg }));
        } else {
          setErrors((prev) => ({ ...prev, general: "Something went wrong. Please try again." }));
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-md border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Ecommerce Hub</h1>
          <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
          <p className="mt-3 text-gray-600">
            Enter your email, OTP, and new password to reset your password.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <p className="text-center text-green-600 font-medium mb-6 bg-green-50 py-3 rounded-lg">
            {message}
          </p>
        )}
        {errors.general && (
          <p className="text-center text-red-600 font-medium mb-6 bg-red-50 py-3 rounded-lg">
            {errors.general}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className={`block w-full px-4 py-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-gray-900`}
              placeholder="Enter your registered email"
            />
            {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* OTP */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={userData.otp}
              onChange={handleChange}
              className={`block w-full px-4 py-3 border ${
                errors.otp ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-gray-900`}
              placeholder="Enter the OTP sent to your email"
              maxLength={6}
            />
            {errors.otp && <p className="mt-1.5 text-sm text-red-600">{errors.otp}</p>}
          </div>

          {/* New Password with Strength Indicator */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={userData.newPassword}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-gray-900 pr-12`}
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="cursor-pointer absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-indigo-600 focus:outline-none"
              >
                {showNewPassword ? (
                  <AiFillEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiFillEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-sm text-red-600">{errors.newPassword}</p>
            )}

            {/* Password Strength Indicator */}
            {userData.newPassword && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                <p
                  className={`mt-1 text-sm font-sm ${
                    passwordStrength.label === "Weak"
                      ? "text-red-600"
                      : passwordStrength.label === "Fair"
                      ? "text-orange-600"
                      : passwordStrength.label === "Good"
                      ? "text-yellow-600"
                      : passwordStrength.label === "Strong"
                      ? "text-green-600"
                      : "text-indigo-600"
                  }`}
                >
                  Password Strength: {passwordStrength.label || "Enter password"}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className={`block w-full px-4 py-3 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-gray-900 pr-12`}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer absolute inset-y-0 right-0 mt-3 pr-4 flex items-center text-gray-500 hover:text-indigo-600 focus:outline-none"
            >
              {showConfirmPassword ? (
                <AiFillEyeInvisible className="h-5 w-5" />
              ) : (
                <AiFillEye className="h-5 w-5" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>
            )}

            {/* Password Strength Indicator */}
            {userData.confirmPassword && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                <p
                  className={`mt-1 text-sm font-sm ${
                    passwordStrength.label === "Weak"
                      ? "text-red-600"
                      : passwordStrength.label === "Fair"
                      ? "text-orange-600"
                      : passwordStrength.label === "Good"
                      ? "text-yellow-600"
                      : passwordStrength.label === "Strong"
                      ? "text-green-600"
                      : "text-indigo-600"
                  }`}
                >
                  Password Strength: {passwordStrength.label || "Enter password"}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === Status.LOADING}
            className="cursor-pointer w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {status === Status.LOADING ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                Changing Password...
              </div>
            ) : (
              "Change Password"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;