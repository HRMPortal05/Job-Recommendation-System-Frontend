import React, { useEffect, useState } from "react";

const EducationPopup = ({
  educationType,
  onClose,
  onSave,
  initialData = {},
}) => {
  // Set up state for form fields based on education type
  const [formData, setFormData] = useState(() => {
    switch (educationType) {
      case "classXII":
      case "classX":
        return {
          board: initialData?.board || "",
          mediumOfStudy: initialData?.mediumOfStudy || "",
          percentage: initialData?.percentage || "",
          passingYear: initialData?.passingYear || "",
        };
      default:
        return {
          board: initialData?.board || "",
          mediumOfStudy: initialData?.mediumOfStudy || "",
          percentage: initialData?.percentage || "",
          passingYear: initialData?.passingYear || "",
        };
    }
  });

  // Add state to track validation
  const [touchedFields, setTouchedFields] = useState({
    board: false,
    mediumOfStudy: false,
    percentage: false,
    passingYear: false,
  });

  //scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Mark field as touched when user interacts with it
    setTouchedFields((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  // Helper to determine field styling based on validation
  const getFieldStyles = (fieldName) => {
    const isEmpty = !formData[fieldName];
    const isTouched = touchedFields[fieldName];

    if (isEmpty && isTouched) {
      return "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500";
    }
    return "border-border-DEFAULT bg-surface-DEFAULT";
  };

  const getFormFields = () => {
    switch (educationType) {
      case "classXII":
      case "classX":
        return (
          <>
            <div>
              <label
                htmlFor="board"
                className="block text-text-primary font-medium mb-2"
              >
                Board
              </label>
              <div className="relative">
                <select
                  id="board"
                  className={`w-full p-3 border rounded-lg text-text-primary appearance-none pr-10 ${getFieldStyles(
                    "board"
                  )}`}
                  value={formData.board}
                  onChange={handleInputChange}
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, board: true }))
                  }
                >
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="mediumOfStudy"
                className="block text-text-primary font-medium mb-2"
              >
                Medium of study
              </label>
              <div className="relative">
                <select
                  id="mediumOfStudy"
                  className={`w-full p-3 border rounded-lg text-text-primary appearance-none pr-10 ${getFieldStyles(
                    "mediumOfStudy"
                  )}`}
                  value={formData.mediumOfStudy}
                  onChange={handleInputChange}
                  onBlur={() =>
                    setTouchedFields((prev) => ({
                      ...prev,
                      mediumOfStudy: true,
                    }))
                  }
                >
                  <option value="">Select Medium</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="percentage"
                className="block text-text-primary font-medium mb-2"
              >
                Percentage
              </label>
              <input
                type="text"
                id="percentage"
                className={`w-full p-3 border rounded-lg text-text-primary ${getFieldStyles(
                  "percentage"
                )}`}
                value={formData.percentage}
                onChange={handleInputChange}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, percentage: true }))
                }
                placeholder="E.g., 92.5"
              />
            </div>

            <div>
              <label
                htmlFor="passingYear"
                className="block text-text-primary font-medium mb-2"
              >
                Passing year
              </label>
              <div className="relative">
                <select
                  id="passingYear"
                  className={`w-full p-3 border rounded-lg text-text-primary appearance-none pr-10 ${getFieldStyles(
                    "passingYear"
                  )}`}
                  value={formData.passingYear}
                  onChange={handleInputChange}
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, passingYear: true }))
                  }
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => 2015 + i).map(
                    (year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    )
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return (
          <>
            <div>
              <label
                htmlFor="board"
                className="block text-text-primary font-medium mb-2"
              >
                Board
              </label>
              <div className="relative">
                <select
                  id="board"
                  className={`w-full p-3 border rounded-lg text-text-primary appearance-none pr-10 ${getFieldStyles(
                    "board"
                  )}`}
                  value={formData.board}
                  onChange={handleInputChange}
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, board: true }))
                  }
                >
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="mediumOfStudy"
                className="block text-text-primary font-medium mb-2"
              >
                Medium of study
              </label>
              <div className="relative">
                <select
                  id="mediumOfStudy"
                  className={`w-full p-3 border rounded-lg text-text-primary appearance-none pr-10 ${getFieldStyles(
                    "mediumOfStudy"
                  )}`}
                  value={formData.mediumOfStudy}
                  onChange={handleInputChange}
                  onBlur={() =>
                    setTouchedFields((prev) => ({
                      ...prev,
                      mediumOfStudy: true,
                    }))
                  }
                >
                  <option value="">Select Medium</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="percentage"
                className="block text-text-primary font-medium mb-2"
              >
                Percentage
              </label>
              <input
                type="text"
                id="percentage"
                className={`w-full p-3 border rounded-lg text-text-primary ${getFieldStyles(
                  "percentage"
                )}`}
                value={formData.percentage}
                onChange={handleInputChange}
                onBlur={() =>
                  setTouchedFields((prev) => ({ ...prev, percentage: true }))
                }
                placeholder="E.g., 92.5"
              />
            </div>

            <div>
              <label
                htmlFor="passingYear"
                className="block text-text-primary font-medium mb-2"
              >
                Passing year
              </label>
              <div className="relative">
                <select
                  id="passingYear"
                  className={`w-full p-3 border rounded-lg text-text-primary appearance-none pr-10 ${getFieldStyles(
                    "passingYear"
                  )}`}
                  value={formData.passingYear}
                  onChange={handleInputChange}
                  onBlur={() =>
                    setTouchedFields((prev) => ({ ...prev, passingYear: true }))
                  }
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => 2015 + i).map(
                    (year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    )
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-text-tertiary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const getPopupTitle = () => {
    switch (educationType) {
      case "classXII":
        return "Class XII Details";
      case "classX":
        return "Class X Details";
      default:
        return "Class X Details";
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Mark all fields as touched to trigger validation styling
    setTouchedFields({
      board: true,
      mediumOfStudy: true,
      percentage: true,
      passingYear: true,
    });

    // Check if any required fields are empty
    const hasEmptyFields = Object.values(formData).some(
      (value) => value === ""
    );

    if (!hasEmptyFields) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg max-h-[90vh] flex flex-col">
        <div className="p-10 border-b border-border-DEFAULT">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium text-text-primary">
              {getPopupTitle()}
            </h2>
            <button
              className="text-text-tertiary hover:text-text-primary"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <p className="text-text-secondary mt-2">
            Adding your educational details helps recruiters understand your
            academic background
          </p>
        </div>

        <div className="overflow-y-auto p-6 flex-grow">
          <form onSubmit={handleSave} className="space-y-5">
            {getFormFields()}
          </form>
        </div>

        <div className="p-6 border-t border-border-DEFAULT flex justify-end space-x-3">
          <button
            type="button"
            className="px-6 py-2.5 text-text-primary bg-surface-DEFAULT border border-border-DEFAULT rounded-lg hover:bg-hover-light"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-white bg-primary rounded-lg hover:bg-primary-hover dark:hover:bg-primary-dark_hover"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationPopup;
