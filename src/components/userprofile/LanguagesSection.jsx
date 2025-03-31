import React from "react";

const LanguagesSection = ({ languages, onEdit }) => {
  const languagesArray = languages
    ? languages.split(",").map((language) => language.trim())
    : [];

  return (
    <div className="bg-surface-DEFAULT p-6 rounded-lg shadow-sm dark:bg-surface-dark mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg text-text-primary dark:text-text-dark_primary font-medium">
          Languages
        </h2>
        <button
          className="text-primary-500 dark:text-primary-dark"
          onClick={onEdit}
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
        {languagesArray.length > 0 ? (
          languagesArray.map((language, index) => (
            <span
              key={index}
              className="bg-surface-100 rounded-full text-sm text-text-secondary dark:bg-border-dark dark:text-text-dark_secondary px-3 py-1"
            >
              {language}
            </span>
          ))
        ) : (
          <span className="text-text-tertiary dark:text-text-dark_tertiary">
            No languages added yet
          </span>
        )}
      </div>
    </div>
  );
};

export default LanguagesSection;
