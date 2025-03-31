import { jwtDecode } from "jwt-decode";
import React, { useState, useCallback, useRef } from "react";

const ResumeUploadForm = ({ onCancel, onSave, initialResumeUrl }) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Define file validation constants
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const VALID_FILE_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validateFile = (selectedFile) => {
    if (!selectedFile) return "Please select a file to upload";

    if (!VALID_FILE_TYPES.includes(selectedFile.type)) {
      return "Please upload a PDF or Word document";
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB";
    }

    return ""; // No error
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validationError = validateFile(selectedFile);
    setError(validationError);

    if (!validationError) {
      setFile(selectedFile);
    } else {
      // Reset file input if there's an error
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add("border-primary-400");
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary-400");
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove("border-primary-400");
    }

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const validationError = validateFile(droppedFile);
    setError(validationError);

    if (!validationError) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get user ID from token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication error. Please log in again.");
      }

      const decoded = jwtDecode(token);
      const userId = decoded?.user_id;
      if (!userId) {
        throw new Error("Authentication error. Please log in again.");
      }

      // Create a filename using the userId
      const fileName = `resume_${userId}_${Date.now()}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "PDF_Resume");
      formData.append("public_id", fileName);

      // Set up progress tracking with XHR
      const xhr = new XMLHttpRequest();
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/upload`,
        true
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          onSave(response.secure_url);
        } else {
          throw new Error("Upload failed: " + xhr.statusText);
        }
      };

      xhr.onerror = function () {
        throw new Error("Network error occurred during upload");
      };

      xhr.send(formData);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload resume. Please try again.");
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    handleFileUpload();
  };

  const handleCancel = () => {
    // Clean up any resources if needed
    if (isUploading) {
      // Potentially cancel the upload if possible
      setIsUploading(false);
    }
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
              Upload Resume
            </h2>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload your resume (PDF or Word, max 5MB)
              </label>

              {/* File input area with drag and drop */}
              <div
                ref={dropAreaRef}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300 transition-colors"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>

                  <p className="text-xs text-gray-500">PDF or Word up to 5MB</p>
                </div>
              </div>

              {/* Selected file info */}
              {file && (
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="truncate">{file.name}</span>
                  <span className="ml-2">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                    aria-label="Remove file"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Error message */}
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            {/* Upload progress */}
            {isUploading && (
              <div className="mb-4">
                <div className="bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {uploadProgress}% uploaded
                </p>
              </div>
            )}

            {/* Current resume info */}
            {initialResumeUrl && !isUploading && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-500">Current resume:</p>
                <div className="flex items-center mt-1">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <a
                    href={initialResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary-600 hover:underline truncate"
                  >
                    {initialResumeUrl.split("/").pop()}
                  </a>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUploading}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!file || isUploading}
                className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${
                  !file || isUploading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isUploading ? "Uploading..." : "Upload Resume"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadForm;
