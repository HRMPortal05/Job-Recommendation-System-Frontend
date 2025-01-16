import React, { useState } from "react";
import { X, EyeOff, Eye } from "lucide-react";
import GoogleIcon from "../../images/GoogleIcon";
import LinkedInIcon from "../../images/LinkedInIcon";
import InputField from "../InputField";

const Login = ({ onLoginClose, onSignUpClick }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email or username is required";
        if (value.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address";
        }
        return "";
      case "password":
        return !value ? "Password is required" : "";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Logging in with", formData);
    // Handle login logic here
  };

  const handleGoogleLogin = () => console.log("Logging in with Google");
  const handleLinkedInLogin = () => console.log("Logging in with LinkedIn");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={onLoginClose}
        >
          <X />
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">
            <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              CareerVista
            </span>
          </h1>
          <p className="text-gray-600">
            Welcome back! Your professional journey continues here.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            label="Email or Username"
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your email or username"
            required
            error={errors.email}
          />

          <InputField
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your password"
            required
            error={errors.password}
            icon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            }
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Login
          </button>

          <span className="block text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-green-600 hover:text-green-700"
              onClick={onSignUpClick}
            >
              Sign Up
            </button>
          </span>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center px-4 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors w-full"
            >
              <GoogleIcon />
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>

            <button
              type="button"
              onClick={handleLinkedInLogin}
              className="flex items-center justify-center px-4 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors"
            >
              <LinkedInIcon />
              <span className="text-sm font-medium text-gray-700">
                LinkedIn
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
