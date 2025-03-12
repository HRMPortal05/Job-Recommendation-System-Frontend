import React from "react";

const EducationSection = ({
  educationData,
  handleAddEducation,
  handleEditEducation,
  handleAddEducationForm,
}) => {
  return (
    <div className="bg-surface-DEFAULT dark:bg-surface-dark rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-text-primary dark:text-text-dark_primary">
          Education
        </h2>
        <button
          className="text-primary-500 dark:text-primary-dark"
          onClick={handleAddEducationForm}
        >
          Add
        </button>
      </div>

      <div className="mb-6">
        {/* Graduate Section */}
        <div className="p-4 border border-border-DEFAULT dark:border-border-dark rounded-md mb-6">
          <h4 className="font-medium text-text-primary dark:text-text-dark_primary mb-3">
            Graduate Education
          </h4>

          {educationData.graduate && educationData.graduate.length > 0 ? (
            <div>
              {educationData.graduate.map((grad, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start mb-4"
                >
                  <div>
                    <h5 className="font-medium text-text-primary dark:text-text-dark_primary mb-1">
                      {grad.degreeName || ""}
                      {grad.courseName && ` in ${grad.courseName}`}
                    </h5>
                    <p className="text-text-secondary dark:text-text-dark_secondary mb-1">
                      {grad.university} {grad.cgpa && `• CGPA: ${grad.cgpa}`}
                    </p>
                    <p className="text-text-tertiary dark:text-text-dark_tertiary">
                      {grad.courseDurationFrom} - {grad.courseDurationTo}
                      {grad.courseType && `, ${grad.courseType}`}
                    </p>
                  </div>
                  <button
                    className="text-primary-500 dark:text-primary-dark"
                    onClick={() => handleEditEducation("graduate", index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                className="text-primary-500 dark:text-primary-dark font-medium text-sm"
                onClick={() => handleAddEducation("graduate")}
              >
                + Add Another Degree
              </button>
            </div>
          ) : (
            <div>
              <button
                className="text-primary-500 dark:text-primary-dark font-medium text-sm mb-2"
                onClick={() => handleAddEducation("graduate")}
              >
                Add Graduate Details
              </button>
              <p className="text-text-tertiary dark:text-text-dark_tertiary text-sm">
                Degree, Course, University, Duration, CGPA
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class XII Details */}
          <div className="p-4 border border-border-DEFAULT dark:border-border-dark rounded-md">
            {educationData.classXII &&
            educationData.classXII.board &&
            educationData.classXII.mediumOfStudy &&
            educationData.classXII.percentage &&
            educationData.classXII.passingYear ? (
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-text-dark_primary mb-1">
                    Class XII
                  </h4>
                  <p className="text-text-secondary dark:text-text-dark_secondary mb-1">
                    {educationData.classXII.board},{" "}
                    {educationData.classXII.mediumOfStudy}
                  </p>
                  <p className="text-text-tertiary dark:text-text-dark_tertiary">
                    Scored {educationData.classXII.percentage}%, Passed out in{" "}
                    {educationData.classXII.passingYear}
                  </p>
                </div>
                <button
                  className="text-primary-500 dark:text-primary-dark"
                  onClick={() => handleAddEducation("classXII")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="text-primary-500 dark:text-primary-dark font-medium text-sm mb-2"
                  onClick={() => handleAddEducation("classXII")}
                >
                  Add Class XII Details
                </button>
                <p className="text-text-tertiary dark:text-text-dark_tertiary text-sm">
                  Scored Percentage, Passed out in Passing Year
                </p>
              </div>
            )}
          </div>

          {/* Class X Details */}
          <div className="p-4 border border-border-DEFAULT dark:border-border-dark rounded-md">
            {educationData.classX &&
            educationData.classX.board &&
            educationData.classX.mediumOfStudy &&
            educationData.classX.percentage &&
            educationData.classX.passingYear ? (
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-text-primary dark:text-text-dark_primary mb-1">
                    Class X
                  </h4>
                  <p className="text-text-secondary dark:text-text-dark_secondary mb-1">
                    {educationData.classX.board},{" "}
                    {educationData.classX.mediumOfStudy}
                  </p>
                  <p className="text-text-tertiary dark:text-text-dark_tertiary">
                    Scored {educationData.classX.percentage}%, Passed out in{" "}
                    {educationData.classX.passingYear}
                  </p>
                </div>
                <button
                  className="text-primary-500 dark:text-primary-dark"
                  onClick={() => handleAddEducation("classX")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="text-primary-500 dark:text-primary-dark font-medium text-sm mb-2"
                  onClick={() => handleAddEducation("classX")}
                >
                  Add Class X Details
                </button>
                <p className="text-text-tertiary dark:text-text-dark_tertiary text-sm">
                  Scored Percentage, Passed out in Passing Year
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationSection;
