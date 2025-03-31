import React, { useState, useEffect } from "react";

const AddProjectsForm = ({
  onCancel,
  onSave,
  onDelete,
  initialProjects = null,
  editIndex = null,
}) => {
  // Reusable months array for dropdown options
  const months = [
    { value: "Jan", label: "January", number: "01" },
    { value: "Feb", label: "February", number: "02" },
    { value: "Mar", label: "March", number: "03" },
    { value: "Apr", label: "April", number: "04" },
    { value: "May", label: "May", number: "05" },
    { value: "Jun", label: "June", number: "06" },
    { value: "Jul", label: "July", number: "07" },
    { value: "Aug", label: "August", number: "08" },
    { value: "Sep", label: "September", number: "09" },
    { value: "Oct", label: "October", number: "10" },
    { value: "Nov", label: "November", number: "11" },
    { value: "Dec", label: "December", number: "12" },
  ];

  const [formData, setFormData] = useState({
    projects_id: "",
    projectName: "",
    projectDescription: "",
    durationFromMonth: "",
    durationFromYear: "",
    durationToMonth: "",
    durationToYear: "",
  });

  const [charCount, setCharCount] = useState(0);
  const maxChars = 1000;

  // Add validation state
  const [errors, setErrors] = useState({
    projectName: false,
    projectDescription: false,
    durationFromMonth: false,
    durationFromYear: false,
    durationToMonth: false,
    durationToYear: false,
  });

  useEffect(() => {
    if (initialProjects) {
      // Parse dates in YYYY-MM-DD format to month and year
      const parseISODate = (dateString) => {
        if (!dateString) return { month: "", year: "" };

        try {
          // Parse the date string
          const dateParts = dateString.split("-");
          if (dateParts.length === 3) {
            const year = dateParts[0];
            const monthNum = dateParts[1];

            // Find the month abbreviation from the number
            const month =
              months.find((m) => m.number === monthNum)?.value || "";

            return { month, year };
          }
        } catch (error) {
          console.error("Error parsing date:", error);
        }

        return { month: "", year: "" };
      };

      const fromDuration = parseISODate(initialProjects.projectDurationFrom);
      const toDuration = parseISODate(initialProjects.projectDurationTo);

      setFormData({
        projects_id: initialProjects.projects_id || "",
        projectName: initialProjects.projectName || "",
        projectDescription: initialProjects.projectDescription || "",
        durationFromMonth: fromDuration.month || "",
        durationFromYear: fromDuration.year || "",
        durationToMonth: toDuration.month || "",
        durationToYear: toDuration.year || "",
      });

      setCharCount(initialProjects.projectDescription?.length || 0);
    }
  }, [initialProjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "projectDescription") {
      setCharCount(value.length);
    }

    // Clear error for this field when user types
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Check all required fields
    const newErrors = {
      projectName: !formData.projectName.trim(),
      projectDescription: !formData.projectDescription.trim(),
      durationFromMonth: !formData.durationFromMonth,
      durationFromYear: !formData.durationFromYear,
      durationToMonth: !formData.durationToMonth,
      durationToYear: !formData.durationToYear,
    };

    setErrors(newErrors);

    // Return true if no errors (all fields filled)
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      // Focus the first invalid field
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      const element = document.getElementById(firstErrorField);
      if (element) element.focus();
      return;
    }

    // Convert month abbreviations to month numbers for the backend format
    const getMonthNumber = (monthAbbr) => {
      const month = months.find((m) => m.value === monthAbbr);
      return month ? month.number : "01"; // Default to 01 if not found
    };

    // Format the data to match your required backend structure (YYYY-MM-DD)
    const formattedData = {
      ...(formData.projects_id ? { projects_id: formData.projects_id } : {}),
      projectName: formData.projectName,
      projectDescription: formData.projectDescription,
      projectDurationFrom: `${formData.durationFromYear}-${getMonthNumber(
        formData.durationFromMonth
      )}-01`,
      projectDurationTo: `${formData.durationToYear}-${getMonthNumber(
        formData.durationToMonth
      )}-01`,
    };

    // Call the onSave prop with the formatted data
    if (onSave) onSave(formattedData);
  };

  const handleCancel = () => {
    setFormData({
      projects_id: "",
      projectName: "",
      projectDescription: "",
      durationFromMonth: "",
      durationFromYear: "",
      durationToMonth: "",
      durationToYear: "",
    });
    setCharCount(0);
    setErrors({
      projectName: false,
      projectDescription: false,
      durationFromMonth: false,
      durationFromYear: false,
      durationToMonth: false,
      durationToYear: false,
    });

    // Call the onCancel prop if provided
    if (onCancel) onCancel();
  };

  const handleDelete = () => {
    if (onDelete && editIndex !== null && formData.projects_id) {
      onDelete(editIndex, formData.projects_id);
    }
  };

  // Helper function to get input class based on error state
  const getInputClass = (fieldName) => {
    return `w-full p-3 border ${
      errors[fieldName]
        ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500"
        : "border-border-DEFAULT bg-surface-DEFAULT focus:border-blue-500 focus:ring-blue-500"
    } rounded-lg text-text-primary`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl p-10 bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {editIndex !== null ? "Edit Project" : "Add Project"}
            </h2>
            <p className="text-gray-600">
              Showcase your talent with the best projects you have worked on
            </p>
          </div>
          <div className="flex items-center gap-3">
            {editIndex !== null && (
              <button
                className="text-red-500 hover:text-red-700"
                onClick={handleDelete}
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
            )}
            <button className="text-text-tertiary" onClick={handleCancel}>
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
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label
                htmlFor="projectName"
                className="block text-text-primary font-medium mb-2"
              >
                Project name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter the name of the project you worked on"
                className={getInputClass("projectName")}
              />
            </div>

            {/* Project Duration - with Month/Year dropdowns */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Project duration <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-1/4">
                  <select
                    id="durationFromMonth"
                    name="durationFromMonth"
                    value={formData.durationFromMonth}
                    onChange={handleChange}
                    className={getInputClass("durationFromMonth")}
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-1/4">
                  <select
                    id="durationFromYear"
                    name="durationFromYear"
                    value={formData.durationFromYear}
                    onChange={handleChange}
                    className={getInputClass("durationFromYear")}
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => 2025 - i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <span className="text-text-secondary">to</span>

                <div className="relative w-1/4">
                  <select
                    id="durationToMonth"
                    name="durationToMonth"
                    value={formData.durationToMonth}
                    onChange={handleChange}
                    className={getInputClass("durationToMonth")}
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative w-1/4">
                  <select
                    id="durationToYear"
                    name="durationToYear"
                    value={formData.durationToYear}
                    onChange={handleChange}
                    className={getInputClass("durationToYear")}
                  >
                    <option value="">Year</option>
                    {Array.from({ length: 10 }, (_, i) => 2025 - i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="projectDescription"
                className="block text-text-primary font-medium mb-2"
              >
                Describe what the project was about{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows="4"
                placeholder="Enter your learnings throughout the process of making the project and what you liked the most about it"
                className={getInputClass("projectDescription")}
                maxLength={maxChars}
              ></textarea>
              <div className="flex justify-between mt-1">
                <div></div>
                <div
                  className={`text-right ${
                    errors.projectDescription
                      ? "text-red-500"
                      : "text-text-muted"
                  }`}
                >
                  {charCount}/{maxChars}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {editIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectsForm;
