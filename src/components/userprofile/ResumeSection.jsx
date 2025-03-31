import React from "react";

// Resume Section Component
const ResumeSection = ({ resumelink, onEdit }) => {
  // Get filename from URL
  const getFileName = (url) => {
    if (!url) return "Resume";
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    // Decode URL encoded characters
    return decodeURIComponent(fileName).replace(/_/g, " ");
  };

  // Get file size (mock function - in a real app this would need an API call)
  const getFileSize = () => {
    // Mock file size between 100KB and 5MB
    return Math.floor(
      Math.random() * (5 * 1024 * 1024 - 100 * 1024) + 100 * 1024
    );
  };

  return (
    <div
      className="bg-surface-DEFAULT p-6 rounded-lg shadow-sm dark:bg-surface-dark mb-6"
      id="resume-section"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg text-text-primary dark:text-text-dark_primary font-medium">
          Resume
        </h2>
        <button
          className="text-primary-500 dark:text-primary-dark"
          onClick={onEdit}
          aria-label="Edit Resume"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {resumelink ? (
          <div className="w-full">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary-500 dark:text-primary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {getFileName(resumelink)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {`${(getFileSize() / (1024 * 1024)).toFixed(2)} MB`}
                </p>
              </div>
              <div className="flex space-x-2">
                <a
                  href={resumelink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800"
                >
                  View
                </a>
                <button
                  onClick={onEdit}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  Replace
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                No resume uploaded
              </p>
              <button
                onClick={onEdit}
                className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800"
              >
                Upload Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeSection;
