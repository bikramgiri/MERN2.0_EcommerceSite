import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { forgotPassword } from "../../store/authSlice";
import { Status } from "../../globals/statuses";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    general: "",
  });

  const [message, setMessage] = useState("");

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
    setErrors({ email: "", general: "" });
    setMessage("");

    let hasError = false;

    if (!userData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      hasError = true;
    }

    if (hasError) return;

      if (!validateEmail(userData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      return;
    }

    dispatch(forgotPassword(userData))
      .then(() => {
        setMessage("OTP sent to your email successfully!");
        setTimeout(() => {
          setMessage("");
          navigate("/verifyotp");
        }, 2000);
      })
      .catch((error) => {
        const errMsg =
          error?.response?.data?.message ||
          "Failed to send OTP. Please try again.";

        if (
          errMsg &&
          error?.response?.status >= 400 &&
          error?.response?.status < 500
        ) {
          const field = errMsg.field;
          const msg = errMsg.message || "OTP sending failed";

          if (field && ["email", "general"].includes(field)) {
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

  return (
    <div className="mt-12 flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-md border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Forgot Password</h1>
          <p className="mt-3 text-gray-600">
            Enter your email to receive a password reset OTP
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
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
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
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
                Sending OTP...
              </div>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="cursor-pointer text-indigo-600 font-medium hover:text-indigo-800 hover:underline transition"
          >
            Back to Login
          </button>
        </div>

         {/* Messages */}
        <p className="mt-2">
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
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;