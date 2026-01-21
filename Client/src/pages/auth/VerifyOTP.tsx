import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOTP } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Status } from "../../globals/statuses";
import { Loader2 } from "lucide-react";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth); // Access error and message from state
  
  const [userData, setUserData] = useState({
    email: "",
    otp: "",
  });

    const [errors, setErrors] = useState({
      email: "",
      otp: "",
      general: "",
    });

  // const [emailError, setEmailError] = useState("");
  // const [otpError, setOtpError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  // Validate email format like name@gmail.com where name can have letters, numbers, dots, hyphens, underscores but @gmail.com part is mandatory
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    return emailRegex.test(email);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, email: "", otp: "", general: "" }));

    let hasError = false;

    if (!userData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      hasError = true;
    }

    if (!userData.otp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }));
      hasError = true;
    }

    if (hasError) return;

    if (!validateEmail(userData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      setTimeout(() => {
        setErrors((prev) => ({ ...prev, email: "" }));
      }, 2000);
      return;
    }

    // check opt must be 6 digit number
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(userData.otp)) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be a 6-digit number" }));
      setTimeout(() => {
        setErrors((prev) => ({ ...prev, otp: "" }));
      }, 2000);
      return;
    }

    dispatch(verifyOTP(userData))
      .then(() => {
        setMessage("OTP verified successfully!");
        setTimeout(() => {
          setMessage("");
          navigate("/changepassword");
        }, 2000);
      })
      .catch((error) => {
        const errMsg =
          error?.response?.data?.message ||
          "Failed to verify OTP. Please try again.";

        if (
          errMsg &&
          error?.response?.status >= 400 &&
          error?.response?.status < 500
        ) {
          const field = errMsg.field;
          const msg = errMsg || "OTP verification failed";

          if (field && ["email", "otp", "general"].includes(field)) {
            setTimeout(() => {
              setErrors((prev) => ({ ...prev, [field]: msg }));
            }, 0);
          } else {
            setTimeout(() => {
              setErrors((prev) => ({ ...prev, general: msg }));
            }, 0);
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

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">Verify OTP</h1>
          <p className="mt-3 text-gray-600">
            Enter the OTP sent to your email to verify your account
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

           {/* OTP Field */}
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
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
            />
            {errors.otp && (
              <p className="mt-1.5 text-sm text-red-600">{errors.otp}</p>
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
                Verifying OTP...
              </div>
            ) : (
              "Verify OTP"
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

      </div>
    </div>
  );
};

export default VerifyOTP;