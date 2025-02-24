import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin, Upload } from "lucide-react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import InputFieldCommon from "../fields_hooks/InputFieldCommon";
import { jwtDecode } from "jwt-decode";

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    resumeUrl: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const decodedToken = jwtDecode(token);
      const uid = decodedToken.user_id;

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/userlogin/getUserProfile/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      setFormData(response.data);
    } catch (err) {
      setError("Failed to fetch profile data");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any existing errors for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    await handleFileUploadProcess(file);
  };

  const handleFileUploadProcess = async (file) => {
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

      enqueueSnackbar("Resume uploaded successfully!", {
        variant: "success",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const uid = decodedToken.user_id;

      // Use the update profile endpoint with the correct path structure
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/userlogin/update/${uid}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          gender: formData.gender,
          resumeUrl: formData.resumeUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      enqueueSnackbar("Profile updated successfully!", {
        variant: "success",
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto mt-14">
        <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-sm border border-border dark:border-border-dark p-6">
          {/* Keep the header section */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark_primary">
              User Profile
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-primary dark:text-primary-dark hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-colors"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Display error messages */}
          {error && (
            <div className="mb-6 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 text-warning-700 dark:text-warning-400 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <InputFieldCommon
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                icon={User}
                required
              />

              <InputFieldCommon
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                error={errors.firstName}
              />

              <InputFieldCommon
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                error={errors.lastName}
              />

              <InputFieldCommon
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={true} // Email should typically not be editable
                icon={Mail}
                required
                error={errors.email}
              />

              <InputFieldCommon
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                icon={Phone}
                error={errors.phone}
              />

              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-dark bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark_secondary disabled:bg-surface-100 dark:disabled:bg-surface-dark/50"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-error-500 dark:text-error-400">
                    {errors.gender}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <InputFieldCommon
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  icon={MapPin}
                  multiline
                  rows={3}
                  error={errors.address}
                />
              </div>

              {/* Resume upload section with updated implementation */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
                  Resume
                </label>
                {isEditing ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                          <div className="w-full px-4 py-2 border border-dashed border-border dark:border-border-dark rounded-md hover:border-primary dark:hover:border-primary-dark text-center">
                            <Upload className="w-5 h-5 mx-auto mb-2 text-text-tertiary dark:text-text-dark_tertiary" />
                            <span className="text-sm text-text-secondary dark:text-text-dark_secondary">
                              {uploading
                                ? "Uploading..."
                                : "Click to upload PDF (Max 10MB)"}
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                    {errors.resume && (
                      <p className="text-sm text-error-500 dark:text-error-400">
                        {errors.resume}
                      </p>
                    )}
                    {formData.resumeUrl && (
                      <div className="text-sm text-text-secondary dark:text-text-dark_secondary">
                        Current resume:{" "}
                        <a
                          href={formData.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary dark:text-primary-dark hover:underline"
                        >
                          View PDF
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  formData.resumeUrl && (
                    <div className="mt-2 border border-border dark:border-border-dark rounded-md overflow-hidden">
                      <object
                        data={formData.resumeUrl}
                        type="application/pdf"
                        className="w-full h-96"
                      >
                        <div className="p-4 text-center">
                          <p className="text-text-secondary dark:text-text-dark_secondary mb-2">
                            Unable to display PDF preview.
                          </p>
                          <a
                            href={formData.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary dark:text-primary-dark hover:underline"
                          >
                            Click here to open PDF
                          </a>
                        </div>
                      </object>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Keep the submit button section */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark_hover text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
