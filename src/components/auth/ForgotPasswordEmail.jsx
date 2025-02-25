import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, CheckCircle } from "lucide-react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const ForgotPasswordEmail = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/userlogin/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setIsEmailSent(true);

      enqueueSnackbar("Reset link sent to your email!", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface dark:bg-surface-dark p-8 rounded-lg shadow-sm border border-border dark:border-border-dark">
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark_primary mb-6">
            Forgot Password
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-700 text-warning-700 dark:text-warning-400 rounded">
              {error}
            </div>
          )}

          {isEmailSent && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="ml-3">
                <p className="font-medium text-green-800 dark:text-green-200">
                  Reset link has been sent!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Please check your email ({email}) and click on the provided
                  link to reset your password.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-border dark:border-border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-dark pl-10 bg-white dark:bg-surface-dark text-text-primary dark:text-text-dark_secondary"
                  placeholder="Enter your email"
                />
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary dark:text-text-dark_tertiary" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark_hover text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
