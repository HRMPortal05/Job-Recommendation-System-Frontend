import React from "react";

const ProfileSummarySection = ({ profileSummary, onEdit, className = "" }) => {
  return (
    <div
      className={`bg-surface-DEFAULT dark:bg-surface-dark rounded-lg shadow-sm mb-6 p-6 ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-text-primary dark:text-text-dark_primary">
          Profile Summary
        </h2>
        <button
          className="text-primary-500 dark:text-primary-dark hover:text-primary-hover dark:hover:text-primary-dark_hover"
          onClick={onEdit}
          aria-label="Edit profile summary"
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
        {profileSummary ? (
          <p className="text-text-secondary dark:text-text-dark_secondary">
            {profileSummary}
          </p>
        ) : (
          <p className="text-text-muted dark:text-text-dark_muted italic">
            Your Profile Summary should mention the highlights of your career
            and education, what your professional interests are, and what kind
            of a career you are looking for. Write a meaningful summary of more
            than 50 characters.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileSummarySection;
