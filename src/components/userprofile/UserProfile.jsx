import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, MapPin, Upload } from "lucide-react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
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
        // navigate("/login");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/upload-resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData((prev) => ({
        ...prev,
        resumeUrl: response.data.resumeUrl,
      }));

      enqueueSnackbar("Resume uploaded successfully!", {
        variant: "success",
      });
    } catch (err) {
      setError("Failed to upload resume");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile`,
        formData,
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
      <div className="max-w-3xl mx-auto mt-10">
        <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-sm border border-border dark:border-border-dark p-6">
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

          {error && (
            <div className="mb-6 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 text-warning-700 dark:text-warning-400 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-dark pl-10 bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark_secondary disabled:bg-surface-100 dark:disabled:bg-surface-dark/50"
                  />
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-text-dark_tertiary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-dark bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark_secondary disabled:bg-surface-100 dark:disabled:bg-surface-dark/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-dark bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark_secondary disabled:bg-surface-100 dark:disabled:bg-surface-dark/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-dark pl-10 bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark_secondary disabled:bg-surface-100 dark:disabled:bg-surface-dark/50"
                  />
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-text-dark_tertiary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
                  Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-dark pl-10 bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark_secondary disabled:bg-surface-100 dark:disabled:bg-surface-dark/50"
                  />
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-text-dark_tertiary" />
                </div>
              </div>

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
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
                  Address
                </label>
                <div className="relative">
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-dark pl-10 bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark_secondary disabled:bg-surface-100 dark:disabled:bg-surface-dark/50"
                  />
                  <MapPin className="w-5 h-5 absolute left-3 top-3 text-text-tertiary dark:text-text-dark_tertiary" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
                  Resume
                </label>
                {isEditing ? (
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="w-full px-4 py-2 border border-dashed border-border dark:border-border-dark rounded-md hover:border-primary dark:hover:border-primary-dark text-center">
                          <Upload className="w-5 h-5 mx-auto mb-2 text-text-tertiary dark:text-text-dark_tertiary" />
                          <span className="text-sm text-text-secondary dark:text-text-dark_secondary">
                            Click to upload PDF
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                ) : (
                  formData.resumeUrl && (
                    <div className="mt-2 border border-border dark:border-border-dark rounded-md overflow-hidden">
                      <iframe
                        src={formData.resumeUrl}
                        className="w-full h-96"
                        title="Resume Preview"
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
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
