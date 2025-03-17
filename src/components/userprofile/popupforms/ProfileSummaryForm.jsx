import React, { useState, useEffect } from "react";

const ProfileSummaryForm = ({ onCancel, onSave, onDelete, initialSummary }) => {
  const [summary, setSummary] = useState(initialSummary || "");
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const characterLimit = 1000;
  const minCharacters = 50;

  // Set initial summary when component mounts or when initialSummary changes
  useEffect(() => {
    if (initialSummary) {
      setSummary(initialSummary);
    }
  }, [initialSummary]);

  const handleChange = (e) => {
    setSummary(e.target.value);
    if (e.target.value.length < minCharacters) {
      setError(
        `Summary must be at least ${minCharacters} characters (currently ${e.target.value.length})`
      );
    } else {
      setError("");
    }
  };

  const handleSave = () => {
    if (summary.length < minCharacters) {
      setError(
        `Summary must be at least ${minCharacters} characters (currently ${summary.length})`
      );
      return;
    }
    // Call the provided onSave function with the summary
    onSave(summary);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg bg-surface-DEFAULT rounded-xl shadow-lg p-10">
        {showDeleteConfirm ? (
          <div className="py-2">
            <h3 className="text-xl font-semibold mb-4">
              Delete profile summary?
            </h3>
            <p className="text-text-secondary mb-6">
              Are you sure you want to delete your profile summary? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="py-2 px-6 text-primary-600 font-medium hover:bg-hover-light rounded-lg"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="py-2 px-6 bg-red-500 text-white font-medium hover:bg-red-600 rounded-lg"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-text-primary">
                Profile summary
              </h2>
              {initialSummary && (
                <div className="flex items-center gap-4">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={handleDeleteClick}
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                  <button
                    className="text-text-tertiary hover:text-text-primary"
                    onClick={onCancel}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <p className="text-text-secondary mb-6">
              Your profile summary should mention the highlights of your career
              and education, what your professional interest are, and what kind
              of career you are looking for. Write a meaningful summary of more
              than 50 characters.
            </p>

            <div className="mb-4">
              <textarea
                className={`w-full max-h-[55vh] p-3 border rounded-lg bg-surface-DEFAULT text-text-primary ${
                  error ? "border-red-500" : "border-border-DEFAULT"
                }`}
                placeholder="Type here"
                rows="6"
                value={summary}
                onChange={handleChange}
                minLength={minCharacters}
                maxLength={characterLimit}
              />
              <div className="flex justify-between mt-1">
                {error ? (
                  <span className="text-red-500 text-sm">{error}</span>
                ) : (
                  <span />
                )}
                <span
                  className={`text-sm ${
                    summary.length < minCharacters
                      ? "text-red-500"
                      : "text-text-muted"
                  }`}
                >
                  {summary.length}/{characterLimit}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="py-2 px-6 text-primary-600 font-medium hover:bg-hover-light rounded-lg"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className={`py-2 px-6 font-medium rounded-lg ${
                  summary.length < minCharacters
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-hover"
                }`}
                onClick={handleSave}
                disabled={summary.length < minCharacters}
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSummaryForm;
