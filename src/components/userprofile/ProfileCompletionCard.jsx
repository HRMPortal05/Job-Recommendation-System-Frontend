import React from "react";

const ProfileCompletionCard = ({
  profileCompletion,
  missingDetails,
  handleAddMissingDetails,
  sectionWeights,
}) => {
  // Determine profile strength level based on percentage
  const getProfileStrength = (percentage) => {
    if (percentage < 40) return "Basic";
    if (percentage < 70) return "Intermediate";
    return "Advanced";
  };

  // Calculate the potential percentage increase for each missing detail
  const calculatePotentialIncrease = (detail) => {
    // Map each missing detail to its corresponding section weight
    if (detail.toLowerCase().includes("career")) {
      return sectionWeights.careerPreferences || 5;
    } else if (
      detail.toLowerCase().includes("education") ||
      detail.toLowerCase().includes("degree") ||
      detail.toLowerCase().includes("class")
    ) {
      return sectionWeights.education || 5;
    } else if (detail.toLowerCase().includes("skills")) {
      return sectionWeights.keySkills || 5;
    } else if (detail.toLowerCase().includes("internship")) {
      return sectionWeights.internships || 5;
    } else if (detail.toLowerCase().includes("project")) {
      return sectionWeights.projects || 5;
    } else if (detail.toLowerCase().includes("summary")) {
      return sectionWeights.profileSummary || 5;
    } else if (detail.toLowerCase().includes("resume")) {
      return sectionWeights.resume || 5;
    }
    return 5; // Default increase if no specific section is matched
  };

  // Updated to use consistent 20px offset instead of 70px
  const handleLinkClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Get the element's position relative to the viewport
      const elementPosition = element.getBoundingClientRect().top;
      // Get the current scroll position
      const scrollPosition =
        window.pageYOffset || document.documentElement.scrollTop;
      // Calculate the target position (current position + element position - 20px padding)
      const targetPosition = scrollPosition + elementPosition - 70;

      // Scroll to the target position smoothly
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-warning-50 dark:bg-surface-dark rounded-lg border border-warning-100 dark:border-border-dark p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-text-primary dark:text-text-dark_primary mb-2 md:mb-0">
          Complete your profile
        </h2>
        <div className="flex items-center">
          <div className="w-16 h-16 relative mr-4">
            <svg className="w-16 h-16" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f1f1f1"
                strokeWidth="6"
                className="dark:stroke-border-darker"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f97316"
                strokeWidth="6"
                strokeDasharray={`${profileCompletion * 2.83} 283`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-warning-500 font-medium">
              {profileCompletion}%
            </div>
          </div>
          <div className="text-text-primary dark:text-text-dark_primary">
            <div className="text-sm mb-1">Profile strength</div>
            <div className="font-medium">
              {getProfileStrength(profileCompletion)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {missingDetails.slice(0, 3).map((detail, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-surface-DEFAULT dark:bg-surface-dark rounded-md border border-border-DEFAULT dark:border-border-dark"
          >
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-text-tertiary dark:text-text-dark_tertiary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <span className="text-text-secondary dark:text-text-dark_secondary">
                {detail}
              </span>
            </div>
            <span className="text-success-500 dark:text-success-dark text-sm">
              ↑ {calculatePotentialIncrease(detail)}%
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddMissingDetails}
        className="w-full bg-warning-500 hover:bg-warning-600 dark:bg-warning-dark dark:hover:bg-warning-600 text-white py-3 px-4 rounded-md font-medium"
      >
        Add {missingDetails.length} missing details
      </button>
    </div>
  );
};

export default ProfileCompletionCard;
