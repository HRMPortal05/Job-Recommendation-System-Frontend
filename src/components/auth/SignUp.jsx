import { useState } from "react";
import { X, EyeOff, Eye, Upload } from "lucide-react";
import GoogleIcon from "../../images/GoogleIcon";
import LinkedInIcon from "../../images/LinkedInIcon";
import InputField from "../InputField";

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "address" && key !== "role") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Signing up with", formData);
    // Handle signup logic here
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

  const handleFileUpload = async (file) => {
    if (file && file.type === "application/pdf") {
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

        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          resumeUrl: data.secure_url,
        }));
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          resume: "Failed to upload resume. Please try again.",
        }));
      }
      setUploading(false);
    } else {
      setErrors((prev) => ({
        ...prev,
        resume: "Please upload a PDF file.",
      }));
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
    console.log("Logging in with Google");
    // Handle Google login logic
  };

  const handleLinkedInLogin = () => {
    console.log("Logging in with LinkedIn");
    // Handle LinkedIn login logic
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[32rem] relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
          onClick={onClose}
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
              className="block text-sm mb-1 font-medium text-gray-700"
            >
              Address (Optional)
            </label>
            <textarea
              id="address"
              name="address"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm mb-1 font-medium text-gray-700"
            >
              Gender *
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              className="block text-sm mb-1 font-medium text-gray-700"
            >
              Resume (PDF) *
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
              } border-dashed rounded-md relative`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <Upload
                  className={`mx-auto h-12 w-12 ${
                    dragActive ? "text-blue-400" : "text-gray-400"
                  }`}
                />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="resume"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
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
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
                {uploading && (
                  <p className="text-sm text-blue-500">Uploading...</p>
                )}
                {formData.resumeUrl && (
                  <p className="text-sm text-green-500">
                    Resume uploaded successfully
                  </p>
                )}
                {errors.resume && (
                  <p className="text-sm text-red-500">{errors.resume}</p>
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
              className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
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
              className="absolute top-8 right-3 text-gray-500 hover:text-gray-700"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>

          {/* Social login section remains the same */}
          <span className="block text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="text-green-600 hover:text-green-700"
              onClick={onLoginClick}
            >
              Login
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

export default SignUp;
