import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { AuthFormProps } from "../types";
import { Eye, EyeOff, Lock, LogIn, Mail, UserIcon, UserPlus } from "lucide-react";

const AuthForm = ({ type, onSubmit, onChange, values, errors, message, passwordStrength }: AuthFormProps ) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-6 md:py-7 ">
      <div className="bg-white p-5 sm:p-6 md:p-6 rounded-xl shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-md border border-gray-200">
        {/* Header */}
        <div className="text-center mb-5">
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {/* {errors?.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>} */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {type === "login"
              ? "Login to Your Account"
              : "Create a New Account"}
          </h2>
          <p className="mt-1 text-md text-gray-600">
            {type === "login"
              ? "Welcome back! Please enter your details."
              : "Join Ecommerce Hub and start shopping today"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {type !== "login" && (
            <div className="relative">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Username
              </label>
              <UserIcon className="absolute left-3 mt-5 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                id="username"
                name="username"
                value={values.username}
                onChange={onChange}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-gray-900"
                placeholder="John Doe"
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
          )}

          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email address
            </label>
            <Mail className="absolute left-3 mt-6 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={onChange}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-gray-900"
              placeholder="Enter your email*"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <Lock className="absolute left-3 mt-5 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={values.password}
              onChange={onChange}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder-gray-400 text-gray-900"
              placeholder="Enter your password*"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
               className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/10 flex items-center text-gray-500 hover:text-indigo-600 focus:outline-none"            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

             {type !== "login" && (
               <div className="mt-2">
            {values.password && (
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
             )}
          </div>
           
          <div className={`${type === "login" ? "flex items-center justify-between" : null}`}>
            <div className={`flex ${type === "login" ? "items-center" : "justify-start"}`}>
              <input
                type="checkbox"
                id="rememberandterms"
                className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="rememberandterms"
                className="ml-2 block text-sm text-gray-600"
              >
                  {type === "login" ? (
                  <>Remember me</>
                  ) : (                
                  <>
                  By creating an account, you agree to our{" "}"
                <Link
                  to="/terms"
                  className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
                  </>
              )}
              </label>
            </div>
           {type === "login" ? (
            <Link to="/forgotpassword" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Forgot password?
            </Link>
              ) : null}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md  duration-200"
            >
            {type === "login"? (<LogIn className="size-5" />): (<UserPlus className="size-5" />)}
            {type === "login" ? "Login" : "Sign up"}
            </button>
        </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            {type === "login"
              ? "Don't have an account? "
              : "Already have an account? "
              }
            <Link
              to={type === "login" ? "/register" : "/login"}
              className="text-indigo-600 font-medium hover:underline"
            >
              {type === "login" ? "Sign up" : "Sign in"}
            </Link>
          </p>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                  Or {type === "login" ? "login" : "sign up"} with
              </span>
            </div>
          </div>

          {/* Responsive social buttons - grid on desktop, stack on mobile */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Google */}
            <button
              onClick={() =>
                window.open("http://localhost:4000/auth/google", "_self")
              }
              className="cursor-pointer flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3.5 px-4 shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <FcGoogle className="h-6 w-6 flex-shrink-0" />
              Google
            </button>

            {/* Facebook */}
            <button className="cursor-pointer flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3.5 px-4 shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              <FaFacebook className="h-6 w-6 text-blue-600 flex-shrink-0" />
              Facebook
            </button>

            {/* GitHub */}
            <button className="cursor-pointer flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-3.5 px-4 shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              <svg
                className="h-6 w-6 text-gray-900 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.475 2 2 6.475 2 12c0 4.425 2.865 8.175 6.839 9.495.5.09.682-.218.682-.484 0-.237-.009-.866-.014-1.7-2.782.602-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.621.069-.609.069-.609 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.089.636-1.34-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.447-1.27.097-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.698 1.028 1.591 1.028 2.682 0 3.841-2.337 4.687-4.565 4.935.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.525-4.475-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;