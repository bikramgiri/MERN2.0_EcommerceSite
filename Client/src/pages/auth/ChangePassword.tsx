import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Status } from "../../globals/statuses";
import { changePassword, resetAuthStatus } from "../../store/authSlice";
import { Loader2 } from "lucide-react";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // State to toggle new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|in)$/i; // Matches backend regex, valid email format like user@example.com
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors((prev) => ({
      ...prev,
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
      general: "",
    }));

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
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password is required",
      }));
      hasError = true;
    }

    if (!userData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm password is required",
      }));
      hasError = true;
    }

    if (hasError) return;

    // Validate email format
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

    // Check if new password and confirm password match
    if (userData.newPassword !== userData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "New password and confirm password do not match",
      }));
      setTimeout(() => {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }, 2000);
      return;
    }

    dispatch(changePassword(userData))
      .then((result) => {
        console.log("Password changed successfully:", result);
        setMessage("OTP verified successfully!");
        setTimeout(() => {
          setMessage("");
          navigate("/login");
        }, 2000);

        // Reset status manually after success
      // setTimeout(() => {
      //   dispatch(resetAuthStatus());
      // }, 0);
    })
      .catch((error) => {
        console.log("Error changing password:", error);
        const errMsg =
          error?.response?.data?.message ||
          "Failed to change password. Please try again.";

        if (
          errMsg &&
          error?.response?.status >= 400 &&
          error?.response?.status < 500
        ) {
          const field = errMsg.field;
          const msg = errMsg || "Password change failed";

          if (
            field &&
            [
              "email",
              "otp",
              "newPassword",
              "confirmPassword",
              "general",
            ].includes(field)
          ) {
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
        // Reset status after error too
      setTimeout(() => {
        dispatch(resetAuthStatus());
      }, 0);
      });
  };

  //  useEffect(() => {
  //         if (status === Status.SUCCESS) {
  //           setTimeout(() => {
  //           setMessage("Password changed successfully");
  //           setTimeout(() => {
  //             setMessage("");
  //             navigate("/login");
  //           }, 2000);
  //           }, 0);
  //           dispatch(resetAuthStatus());
  //           console.log("Status Changed to:", status);
  //         } else if (status === Status.ERROR) {
  //           if (!errors.general) {
  //             setTimeout(() => {
  //               setErrors((prev) => ({
  //                 ...prev,
  //                 general: "Password change failed!",
  //               }));
  //             }, 0);
  //           }
  //         }
  //       }, [status, errors, navigate, dispatch]);

  return (
    <div className="mt-8 flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-md border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">Change Password</h2>
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

          {/* New Password */}
          <div className="relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password
            </label>
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
              className="absolute inset-y-0 right-0 pr-4 mt-7 flex items-center text-gray-500 hover:text-indigo-600 focus:outline-none"
            >
              {showNewPassword ? (
                <AiFillEyeInvisible className="h-5 w-5" />
              ) : (
                <AiFillEye className="h-5 w-5" />
              )}
            </button>
            {errors.newPassword && (
              <p className="mt-1.5 text-sm text-red-600">{errors.newPassword}</p>
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
              className="absolute inset-y-0 right-0 mt-7 pr-4 flex items-center text-gray-500 hover:text-indigo-600 focus:outline-none"
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
