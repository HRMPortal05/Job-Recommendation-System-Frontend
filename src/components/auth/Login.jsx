import React, { useState } from "react";
import { X, EyeOff, Eye } from "lucide-react";
import GoogleIcon from "../../images/GoogleIcon";
import LinkedInIcon from "../../images/LinkedInIcon";
import InputField from "../fields_hooks/InputField";
import useScrollLock from "../fields_hooks/useScrollLock";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const Login = ({ onLoginClose, onSignUpClick }) => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useScrollLock(true);

  const validateField = (name, value) => {
    switch (name) {
      case "usernameOrEmail":
        return !value ? "Email or username is required" : "";
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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Clear any previous errors
    setErrors({});

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

    // Create the login data object in the expected format
    const loginData = {
      usernameOrEmail: formData.usernameOrEmail,
      password: formData.password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/userlogin/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.token) {
        enqueueSnackbar("Logged in successfully", {
          variant: "success",
          autoHideDuration: 3000,
        });
        localStorage.setItem("token", response.data.token);
        onLoginClose();
      }
    } catch (error) {
      console.error("Login error:", error.response.data.error);

      if (error.response) {
        setErrors({
          submit: error.response.data.error,
        });
      } else {
        setErrors({
          submit: "An error occurred. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const params = new URLSearchParams({
      response_type: "code",
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
      scope: "openid email profile",
      access_type: "online",
    });

    // Redirect to Google OAuth login page
    window.location.href = `${googleAuthUrl}?${params.toString()}`;
  };
  const handleLinkedInLogin = () => console.log("Logging in with LinkedIn");

  return (
    <div className="fixed inset-0 backdrop-blur-[3px] bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface p-8 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary"
          onClick={onLoginClose}
        >
          <X />
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary-600 mb-2">
            <span className="font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              CareerVista
            </span>
          </h1>
          <p className="text-text-secondary">
            Welcome back! Your professional journey continues here.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {errors.submit && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded">
              {errors.submit}
            </div>
          )}

          <InputField
            label="Email or Username"
            type="text"
            name="usernameOrEmail"
            value={formData.usernameOrEmail}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your email or username"
            required
            error={errors.usernameOrEmail}
            disabled={isLoading}
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
            disabled={isLoading}
            icon={
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-text-muted hover:text-text-primary focus:outline-none"
                disabled={isLoading}
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
            className="w-full bg-primary-600 text-surface py-2 px-4 rounded hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <span className="block text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-success-600 hover:text-success-700"
              onClick={onSignUpClick}
            >
              Sign Up
            </button>
          </span>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-tertiary">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center px-4 py-1.5 border border-border rounded-md bg-surface hover:bg-hover transition-colors w-full"
            >
              <GoogleIcon />
              <span className="text-sm font-medium text-text-primary">
                Google
              </span>
            </button>

            <button
              type="button"
              onClick={handleLinkedInLogin}
              className="flex items-center justify-center px-4 py-1.5 border border-border rounded-md bg-surface hover:bg-hover transition-colors"
            >
              <LinkedInIcon />
              <span className="text-sm font-medium text-text-primary">
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
