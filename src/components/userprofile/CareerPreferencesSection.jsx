import React from "react";

const CareerPreferencesSection = ({
  careerPreferences,
  handleAddCareer,
  handleEditCareer,
  showCareerPopup,
  setShowCareerPopup,
  updateCareerPreferences,
  isLoading,
}) => {
  // Check if all preferences are empty
  const arePreferencesEmpty = () => {
    return (
      !careerPreferences.preferedJobType &&
      !careerPreferences.preferedLocation &&
      !careerPreferences.availabilityToWork
    );
  };

  return (
    <div className="bg-surface-DEFAULT dark:bg-surface-dark rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-text-primary dark:text-text-dark_primary">
          Your career preferences
        </h2>
        {arePreferencesEmpty() ? (
          <button
            className="text-primary-500 dark:text-primary-dark"
            onClick={handleAddCareer}
          >
            Add
          </button>
        ) : (
          <button
            className="text-primary-500 dark:text-primary-dark"
            onClick={handleEditCareer}
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
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-text-tertiary dark:text-text-dark_tertiary text-sm mb-1">
            Preferred job type
          </p>
          {careerPreferences.preferedJobType ? (
            <p className="text-text-primary dark:text-text-dark_primary">
              {careerPreferences.preferedJobType}
            </p>
          ) : (
            <button
              className="text-blue-500 dark:text-blue-400"
              onClick={handleAddCareer}
            >
              Add desired job type
            </button>
          )}
        </div>
        <div>
          <p className="text-text-tertiary dark:text-text-dark_tertiary text-sm mb-1">
            Availability to work
          </p>
          {careerPreferences.availabilityToWork ? (
            <p className="text-text-primary dark:text-text-dark_primary">
              {careerPreferences.availabilityToWork}
            </p>
          ) : (
            <button
              className="text-blue-500 dark:text-blue-400"
              onClick={handleAddCareer}
            >
              Add availability
            </button>
          )}
        </div>
        <div>
          <p className="text-text-tertiary dark:text-text-dark_tertiary text-sm mb-1">
            Preferred location
          </p>
          {careerPreferences.preferedLocation ? (
            <p className="text-text-primary dark:text-text-dark_primary">
              {careerPreferences.preferedLocation}
            </p>
          ) : (
            <button
              className="text-blue-500 dark:text-blue-400"
              onClick={handleAddCareer}
            >
              Add preferred work location
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerPreferencesSection;
