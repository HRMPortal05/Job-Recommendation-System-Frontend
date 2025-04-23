import { useState } from "react";
import { X, EyeOff, Eye, Upload } from "lucide-react";
import GoogleIcon from "../../images/GoogleIcon";
import LinkedInIcon from "../../images/LinkedInIcon";
import InputField from "../fields_hooks/InputField";
import useScrollLock from "../fields_hooks/useScrollLock";
import axios from "axios";

const SignUp = ({ onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: "male",
    resumeUrl: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useScrollLock(true);

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return value.length < 2 ? "Must be at least 2 characters" : "";
      case "username":
        return !/^[a-zA-Z0-9_]{3,20}$/.test(value)
          ? "Username must be 3-20 characters and can only contain letters, numbers, and underscore"
          : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Please enter a valid email address"
          : "";
      case "phoneNumber":
        return !/^\+?[\d\s-]{10,}$/.test(value)
          ? "Please enter a valid phone number"
          : "";
      case "password":
        let errorMessage = "";

        if (value.length < 8) {
          errorMessage = "Password must be at least 8 characters long.";
        } else if (!/[A-Z]/.test(value)) {
          errorMessage = "Password must include at least one uppercase letter.";
        } else if (!/\d/.test(value)) {
          errorMessage = "Password must include at least one number.";
        } else if (!/[@$!%*#?&]/.test(value)) {
          errorMessage =
            "Password must include at least one special character.";
        }

        return errorMessage;

      case "confirmPassword":
        return value !== formData.password ? "Passwords do not match" : "";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "address" && key !== "role" && key !== "confirmPassword") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const registerData = {
      username: formData.username,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phoneNumber,
      address: formData.address,
      gender:
        formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1),
      resumeUrl: formData.resumeUrl,
      role: formData.role,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/userlogin/register`,
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      onClose();
      onLoginClick();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const errorData = error.response.data;
        setErrors({
          username: errorData.includes("Username")
            ? "Username already exists"
            : "",
          email: errorData.includes("Email") ? "Email already registered" : "",
        });
      } else {
        setErrors({
          submit: "Registration failed. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // File handling functions with error handling
  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        resume: "Please upload a PDF file.",
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      setErrors((prev) => ({
        ...prev,
        resume: "File size must be less than 10MB.",
      }));
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "PDF_Resume");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/duzoeq3dw/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        resumeUrl: data.secure_url,
      }));

      // Clear any existing resume errors
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.resume;
        return newErrors;
      });
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        resume: "Failed to upload resume. Please try again.",
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
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

  const handleLinkedInLogin = () => {
    console.log("Logging in with LinkedIn");
    // Handle LinkedIn login logic
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[3px] bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface p-8 rounded-lg shadow-lg w-[32rem] relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary"
          onClick={onClose}
        >
          <X />
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            <span className="font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              CareerVista
            </span>
          </h1>
          <p className="text-text-secondary">
            Create an account to start your professional journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter first name"
              required
              error={errors.firstName}
            />

            <InputField
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Enter last name"
              required
              error={errors.lastName}
            />
          </div>

          <InputField
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Choose a username"
            required
            error={errors.username}
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter your email"
            required
            error={errors.email}
          />

          <InputField
            label="Phone Number"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="Enter phone number"
            required
            error={errors.phoneNumber}
          />

          <div>
            <label
              htmlFor="address"
              className="block text-sm mb-1 font-medium text-text-primary"
            >
              Address (Optional)
            </label>
            <textarea
              id="address"
              name="address"
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm mb-1 font-medium text-text-primary"
            >
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="resume"
              className="block text-sm mb-1 font-medium text-text-primary"
            >
              Resume (PDF) *
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                dragActive
                  ? "border-primary-400 bg-primary-50"
                  : "border-border"
              } border-dashed rounded-md relative`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <Upload
                  className={`mx-auto h-12 w-12 ${
                    dragActive ? "text-primary-400" : "text-text-muted"
                  }`}
                />
                <div className="flex text-sm text-text-secondary">
                  <label
                    htmlFor="resume"
                    className="relative cursor-pointer bg-surface rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-text-muted">PDF up to 10MB</p>
                {uploading && (
                  <p className="text-sm text-primary-500">Uploading...</p>
                )}
                {formData.resumeUrl && (
                  <p className="text-sm text-success-500">
                    Resume uploaded successfully
                  </p>
                )}
                {errors.resume && (
                  <p className="text-sm text-error-500">{errors.resume}</p>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
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
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-8 right-3 text-text-tertiary hover:text-text-primary"
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <InputField
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              required
              error={errors.confirmPassword}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-8 right-3 text-text-tertiary hover:text-text-primary"
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-surface py-2 px-4 rounded hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || uploading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>

          <span className="block text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <button
              type="button"
              className="text-success-600 hover:text-success-700"
              onClick={onLoginClick}
            >
              Login
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

export default SignUp;
