import React, { useState, useEffect } from "react";
import universitiesData from "./universities.json";
import courses from "./courses.json";

const AddEducationForm = ({
  onCancel,
  onSave,
  initialData,
  educationType,
  editIndex,
}) => {
  const [step, setStep] = useState(1);
  const [selectedDegree, setSelectedDegree] = useState("");
  const [universitySuggestions, setUniversitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    graduate: {
      degreeName: "",
      courseName: "",
      university: "",
      cgpa: "",
      courseDurationFrom: "",
      courseDurationTo: "",
      courseType: "",
    },
  });
  // Add validation state
  const [validationErrors, setValidationErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // University data from the JSON file
  const universities = universitiesData;

  const degreeCourses = courses;

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData && educationType) {
      if (educationType === "graduate") {
        setFormData({
          graduate: { ...initialData },
        });
        // If we have initial graduate data, we can set the degree and move to step 2
        if (initialData.degreeName || initialData.courseName) {
          setSelectedDegree(initialData.degreeName || "Graduate/Diploma");
          setStep(2);
        }
      }
    }
  }, [initialData, educationType]);

  const handleDegreeSelect = (degree) => {
    setSelectedDegree(degree);
    setFormData({
      graduate: { ...formData.graduate, degreeName: degree, courseName: "" },
    });
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleCancel = () => {
    onCancel();
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleChange = (field, value) => {
    // Clear validation error when field is changed
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: false,
      });
    }

    if (field === "cgpaValue") {
      // When changing CGPA value, update the cgpa field with the value
      setFormData({
        graduate: {
          ...formData.graduate,
          cgpa: formData.graduate.cgpaSystem
            ? `${value} ${formData.graduate.cgpaSystem}`
            : value,
        },
      });
    } else if (field === "cgpa") {
      // When selecting grading system
      setFormData({
        graduate: {
          ...formData.graduate,
          cgpaSystem: value,
          // Reset or set the combined cgpa value when changing system
          cgpa: value === "Course requires a pass" ? value : "",
        },
      });
    } else {
      // For all other fields, handle normally
      setFormData({
        graduate: {
          ...formData.graduate,
          [field]: value,
        },
      });
    }

    // If the field is university, filter suggestions
    if (field === "university") {
      handleUniversityInputChange(value);
    }
  };

  const handleUniversityInputChange = (value) => {
    if (value.trim() === "") {
      setUniversitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filteredSuggestions = universities.filter((uni) =>
      uni.Name.toLowerCase().includes(value.toLowerCase())
    );
    setUniversitySuggestions(filteredSuggestions);
    setShowSuggestions(true);
  };

  const handleUniversitySelect = (university) => {
    setFormData({
      graduate: {
        ...formData.graduate,
        university: university.Name,
      },
    });
    setShowSuggestions(false);

    // Clear validation error for university field
    if (validationErrors.university) {
      setValidationErrors({
        ...validationErrors,
        university: false,
      });
    }
  };

  // Update validate function
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      "courseName",
      "university",
      "courseDurationFrom",
      "courseDurationTo",
      "courseType",
    ];

    // Check if grading system requires input
    if (
      shouldShowCgpaInput() &&
      (!formData.graduate.cgpa ||
        formData.graduate.cgpa.split(" ")[0].trim() === "")
    ) {
      errors.cgpaValue = true;
    }

    // Check all required fields
    requiredFields.forEach((field) => {
      if (!formData.graduate[field]) {
        errors[field] = true;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Updated save handler
  const handleSave = () => {
    setFormSubmitted(true);
    const isValid = validateForm();

    if (isValid) {
      // Call the parent component's onSave with the form data and edit index if provided
      onSave(formData, editIndex);
    }
  };

  // Replace shouldShowCgpaInput function
  const shouldShowCgpaInput = () => {
    return (
      formData.graduate.cgpaSystem === "GPA out of 10" ||
      formData.graduate.cgpaSystem === "GPA out of 4" ||
      formData.graduate.cgpaSystem === "Percentage"
    );
  };

  const getCgpaPlaceholder = () => {
    if (formData.graduate.cgpaSystem === "GPA out of 10") {
      return "Enter your GPA (e.g., 8.5)";
    } else if (formData.graduate.cgpaSystem === "GPA out of 4") {
      return "Enter your GPA (e.g., 3.7)";
    } else if (formData.graduate.cgpaSystem === "Percentage") {
      return "Enter your percentage (e.g., 85)";
    }
    return "Enter your grade";
  };

  // Helper function to get input field class
  const getInputFieldClass = (fieldName) => {
    return validationErrors[fieldName] && formSubmitted
      ? "w-full p-3 border border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500 rounded-md"
      : "w-full p-3 border border-border rounded-md";
  };

  //scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-10 max-w-xl mx-auto max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-bold text-text-primary">
            {editIndex !== null ? "Edit Education" : "Add Education"}
          </h2>
          <button className="text-gray-500" onClick={handleCancel}>
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

        <p className="text-text-tertiary mb-4">
          Adding your educational details help recruiters know your value as a
          potential candidate
        </p>

        {/* Added scrollable container */}
        <div className="overflow-y-auto flex-grow mb-4 pr-2">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-4">Qualification/Degree</h3>

            {step === 1 ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-8">
                  <button
                    className={`px-6 py-2 rounded-full border ${
                      selectedDegree === "Diploma"
                        ? "border-primary-600 text-primary-600"
                        : "border-border text-text-secondary"
                    }`}
                    onClick={() => handleDegreeSelect("Diploma")}
                  >
                    Diploma
                  </button>
                  <button
                    className={`px-6 py-2 rounded-full border ${
                      selectedDegree === "Under Graduate"
                        ? "border-primary-600 text-primary-600"
                        : "border-border text-text-secondary"
                    }`}
                    onClick={() => handleDegreeSelect("Under Graduate")}
                  >
                    Under Graduate
                  </button>
                  <button
                    className={`px-6 py-2 rounded-full border ${
                      selectedDegree === "Post Graduate"
                        ? "border-primary-600 text-primary-600"
                        : "border-border text-text-secondary"
                    }`}
                    onClick={() => handleDegreeSelect("Post Graduate")}
                  >
                    Post Graduate
                  </button>
                  <button
                    className={`px-6 py-2 rounded-full border ${
                      selectedDegree === "Doctorate"
                        ? "border-primary-600 text-primary-600"
                        : "border-border text-text-secondary"
                    }`}
                    onClick={() => handleDegreeSelect("Doctorate")}
                  >
                    Doctorate
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center mb-6">
                  <span className="px-6 py-2 rounded-full border border-border text-text-secondary flex items-center">
                    {selectedDegree}
                    <button
                      className="ml-2 text-text-tertiary"
                      onClick={handlePrevious}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
                  </span>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium">Course name</label>
                  <div className="relative">
                    <select
                      className={
                        validationErrors.courseName && formSubmitted
                          ? "w-full p-3 border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500 rounded-md appearance-none"
                          : "w-full p-3 border border-border rounded-md appearance-none bg-white text-text-tertiary"
                      }
                      onChange={(e) =>
                        handleChange("courseName", e.target.value)
                      }
                      value={formData.graduate.courseName}
                    >
                      <option value="">Select course from the list</option>
                      {degreeCourses[selectedDegree]?.map((course, index) => (
                        <option key={index} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {degreeCourses[selectedDegree]
                        ?.slice(0, 3)
                        .map((course) => (
                          <button
                            key={course}
                            className={`px-4 py-2 rounded-full border ${
                              formData.graduate.courseName === course
                                ? "border-primary-600 text-primary-600"
                                : "border-border text-text-secondary"
                            }`}
                            onClick={() => handleChange("courseName", course)}
                          >
                            {course}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium">College name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className={getInputFieldClass("university")}
                      placeholder="Start typing to search for your university..."
                      value={formData.graduate.university}
                      onChange={(e) =>
                        handleChange("university", e.target.value)
                      }
                      onFocus={() => {
                        if (formData.graduate.university) {
                          handleUniversityInputChange(
                            formData.graduate.university
                          );
                        }
                      }}
                    />
                    {showSuggestions && universitySuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {universitySuggestions.map((uni, index) => (
                          <div
                            key={uni["Aishe Code"] || index}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                            onClick={() => handleUniversitySelect(uni)}
                          >
                            <div className="font-medium">{uni.Name}</div>
                            <div className="text-sm text-gray-500">
                              {uni.District}, {uni.State} • Est.{" "}
                              {uni["Year Of Establishment"]}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {showSuggestions &&
                      universitySuggestions.length === 0 &&
                      formData.graduate.university && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3">
                          No universities found. Please enter a different name.
                        </div>
                      )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    Grading system
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      className={`px-4 py-2 rounded-full border ${
                        formData.graduate.cgpaSystem === "GPA out of 10"
                          ? "border-primary-600 text-primary-600"
                          : "border-border text-text-secondary"
                      }`}
                      onClick={() => handleChange("cgpa", "GPA out of 10")}
                    >
                      GPA out of 10
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border ${
                        formData.graduate.cgpaSystem === "GPA out of 4"
                          ? "border-primary-600 text-primary-600"
                          : "border-border text-text-secondary"
                      }`}
                      onClick={() => handleChange("cgpa", "GPA out of 4")}
                    >
                      GPA out of 4
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border ${
                        formData.graduate.cgpaSystem === "Percentage"
                          ? "border-primary-600 text-primary-600"
                          : "border-border text-text-secondary"
                      }`}
                      onClick={() => handleChange("cgpa", "Percentage")}
                    >
                      Percentage
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border ${
                        formData.graduate.cgpaSystem ===
                        "Course requires a pass"
                          ? "border-primary-600 text-primary-600"
                          : "border-border text-text-secondary"
                      }`}
                      onClick={() =>
                        handleChange("cgpa", "Course requires a pass")
                      }
                    >
                      Course requires a pass
                    </button>
                  </div>

                  {shouldShowCgpaInput() && (
                    <div className="mt-3">
                      <input
                        type="text"
                        className={
                          validationErrors.cgpaValue && formSubmitted
                            ? "w-full p-3 border border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500 rounded-md"
                            : "w-full p-3 border border-border rounded-md"
                        }
                        placeholder={getCgpaPlaceholder()}
                        value={formData.graduate.cgpa.split(" ")[0] || ""}
                        onChange={(e) =>
                          handleChange("cgpaValue", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    Course duration
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <select
                        className={
                          validationErrors.courseDurationFrom && formSubmitted
                            ? "w-full p-3 border border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500 rounded-md appearance-none"
                            : "w-full p-3 border border-border rounded-md appearance-none"
                        }
                        value={formData.graduate.courseDurationFrom}
                        onChange={(e) =>
                          handleChange("courseDurationFrom", e.target.value)
                        }
                      >
                        <option value="">Starting year</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                    <span className="text-text-secondary">to</span>
                    <div className="relative flex-1">
                      <select
                        className={
                          validationErrors.courseDurationTo && formSubmitted
                            ? "w-full p-3 border border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500 rounded-md appearance-none"
                            : "w-full p-3 border border-border rounded-md appearance-none"
                        }
                        value={formData.graduate.courseDurationTo}
                        onChange={(e) =>
                          handleChange("courseDurationTo", e.target.value)
                        }
                      >
                        <option value="">Ending year</option>
                        <option value="2028">2028</option>
                        <option value="2027">2027</option>
                        <option value="2026">2026</option>
                        <option value="2025">2025</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block mb-2 font-medium">Course type</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`px-4 py-2 rounded-full border ${
                        formData.graduate.courseType === "Full Time"
                          ? "border-primary-600 text-primary-600"
                          : validationErrors.courseType && formSubmitted
                          ? "border-red-500 bg-red-50"
                          : "border-border text-text-secondary"
                      }`}
                      onClick={() => handleChange("courseType", "Full Time")}
                    >
                      Full Time
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border ${
                        formData.graduate.courseType === "Part Time"
                          ? "border-primary-600 text-primary-600"
                          : validationErrors.courseType && formSubmitted
                          ? "border-red-500 bg-red-50"
                          : "border-border text-text-secondary"
                      }`}
                      onClick={() => handleChange("courseType", "Part Time")}
                    >
                      Part Time
                    </button>
                    <button
                      className={`px-4 py-2 rounded-full border ${
                        formData.graduate.courseType === "Correspondence"
                          ? "border-primary-600 text-primary-600"
                          : validationErrors.courseType && formSubmitted
                          ? "border-red-500 bg-red-50"
                          : "border-border text-text-secondary"
                      }`}
                      onClick={() =>
                        handleChange("courseType", "Correspondence")
                      }
                    >
                      Correspondence
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with buttons - fixed at bottom */}
        <div className="flex justify-end space-x-2 mt-auto pt-2 border-t border-gray-100">
          <button
            className="px-6 py-2 text-primary-600 font-medium"
            onClick={handleCancel}
          >
            Cancel
          </button>

          {step === 1 ? (
            <button
              className={`px-6 py-2 rounded-md font-medium ${
                selectedDegree
                  ? "bg-primary-600 text-white"
                  : "bg-primary-200 text-white cursor-not-allowed"
              }`}
              onClick={handleNext}
              disabled={!selectedDegree}
            >
              Next
            </button>
          ) : (
            <button
              className="px-6 py-2 rounded-md bg-primary-600 text-white font-medium"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEducationForm;
