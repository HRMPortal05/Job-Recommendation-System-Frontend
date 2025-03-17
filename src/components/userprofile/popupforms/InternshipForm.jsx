import React, { useState, useEffect } from "react";

const InternshipForm = ({
  onSave,
  onCancel,
  initialInternships,
  editIndex,
  onDelete,
}) => {
  // Reusable months array for dropdown options
  const months = [
    { value: "Jan", label: "January" },
    { value: "Feb", label: "February" },
    { value: "Mar", label: "March" },
    { value: "Apr", label: "April" },
    { value: "May", label: "May" },
    { value: "Jun", label: "June" },
    { value: "Jul", label: "July" },
    { value: "Aug", label: "August" },
    { value: "Sep", label: "September" },
    { value: "Oct", label: "October" },
    { value: "Nov", label: "November" },
    { value: "Dec", label: "December" },
  ];

  const [internship, setInternship] = useState({
    companyName: "",
    durationFrom: "",
    durationFromYear: "",
    durationTo: "",
    durationToYear: "",
    description: "",
  });

  const [charCount, setCharCount] = useState(0);
  const maxChars = 1000;

  // Add validation state
  const [errors, setErrors] = useState({
    companyName: false,
    durationFrom: false,
    durationFromYear: false,
    durationTo: false,
    durationToYear: false,
    description: false,
  });

  // Populate form when editing an existing internship
  useEffect(() => {
    if (initialInternships) {
      // Parse the date strings if they exist
      const parseDuration = (durationString) => {
        if (!durationString) return { month: "", year: "" };

        const parts = durationString.trim().split(" ");
        if (parts.length >= 2) {
          return { month: parts[0], year: parts[1] };
        }
        return { month: "", year: "" };
      };

      const fromDuration = parseDuration(initialInternships.durationFrom);
      const toDuration = parseDuration(initialInternships.durationTo);

      const updatedInternship = {
        companyName: initialInternships.companyName || "",
        durationFrom: fromDuration.month || "",
        durationFromYear: fromDuration.year || "",
        durationTo: toDuration.month || "",
        durationToYear: toDuration.year || "",
        description: initialInternships.description || "",
      };

      setInternship(updatedInternship);
      setCharCount(updatedInternship.description.length);
    }
  }, [initialInternships]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      setCharCount(value.length);
    }

    // Clear error for this field when user types
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));

    setInternship((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Check all required fields
    const newErrors = {
      companyName: !internship.companyName,
      durationFrom: !internship.durationFrom,
      durationFromYear: !internship.durationFromYear,
      durationTo: !internship.durationTo,
      durationToYear: !internship.durationToYear,
      description: !internship.description,
    };

    setErrors(newErrors);

    // Return true if no errors (all fields filled)
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      // Focus the first invalid field
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      const element = document.getElementById(firstErrorField);
      if (element) element.focus();
      return;
    }

    // Format the data to match your required structure
    const formattedData = {
      ...(initialInternships?.internship_id
        ? { internship_id: initialInternships.internship_id }
        : {}),
      companyName: internship.companyName,
      durationFrom:
        `${internship.durationFrom} ${internship.durationFromYear}`.trim(),
      durationTo:
        `${internship.durationTo} ${internship.durationToYear}`.trim(),
      description: internship.description,
    };

    // Call the onSave prop with the formatted data and edit index if applicable
    if (onSave) onSave(formattedData, editIndex);
  };

  const handleCancel = () => {
    setInternship({
      companyName: "",
      durationFrom: "",
      durationFromYear: "",
      durationTo: "",
      durationToYear: "",
      description: "",
    });
    setCharCount(0);
    setErrors({
      companyName: false,
      durationFrom: false,
      durationFromYear: false,
      durationTo: false,
      durationToYear: false,
      description: false,
    });

    // Call the onCancel prop if provided
    if (onCancel) onCancel();
  };

  const handleDelete = () => {
    if (onDelete && editIndex !== null && initialInternships?.internship_id) {
      onDelete(editIndex, initialInternships.internship_id);
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
              {editIndex !== null ? "Edit Internship" : "Add Internship"}
            </h2>
            <p className="text-gray-600">Show your professional learnings</p>
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
            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-text-primary font-medium mb-2"
              >
                Company name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={internship.companyName}
                onChange={handleChange}
                placeholder="Enter the name of the company"
                className={getInputClass("companyName")}
              />
            </div>

            {/* Internship Duration */}
            <div>
              <label className="block text-text-primary font-medium mb-2">
                Internship duration <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-1/4">
                  <select
                    id="durationFrom"
                    name="durationFrom"
                    value={internship.durationFrom}
                    onChange={handleChange}
                    className={getInputClass("durationFrom")}
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
                    value={internship.durationFromYear}
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
                    id="durationTo"
                    name="durationTo"
                    value={internship.durationTo}
                    onChange={handleChange}
                    className={getInputClass("durationTo")}
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
                    value={internship.durationToYear}
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
                htmlFor="description"
                className="block text-text-primary font-medium mb-2"
              >
                Describe what you did at internship{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={internship.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter the responsibilities you held, anything you accomplished or learned while serving in your internship"
                className={getInputClass("description")}
                maxLength={maxChars}
              ></textarea>
              <div className="flex justify-between mt-1">
                <div></div>
                <div
                  className={`text-right ${
                    errors.description ? "text-red-500" : "text-text-muted"
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

export default InternshipForm;
