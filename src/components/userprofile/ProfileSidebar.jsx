import React from "react";

const ProfileSidebar = ({ userData, profileCompletion }) => {
  // Create a mapping of section names to their corresponding IDs
  const quickLinks = [
    { name: "Career Preferences", id: "career-preferences-section" },
    { name: "Education", id: "education-section" },
    { name: "Key skills", id: "skills-section" },
    { name: "Languages", id: "languages-section" },
    { name: "Internships", id: "internships-section" },
    { name: "Projects", id: "projects-section" },
    { name: "Profile summary", id: "profile-summary-section" },
    { name: "Resume", id: "resume-section" },
  ];

  // Function to handle smooth scrolling to sections
  const handleLinkClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="lg:col-span-1">
      {/* Profile Image Section */}
      <div className="bg-surface-DEFAULT dark:bg-surface-dark rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col items-center">
          {/* Profile Image with Completion Ring */}
          <div className="relative mb-6">
            <div className="w-40 h-40 rounded-full bg-surface-200 dark:bg-border-darker flex items-center justify-center overflow-hidden">
              <div className="text-text-tertiary dark:text-text-dark_tertiary text-sm font-medium">
                Add photo
              </div>
              <div className="absolute -top-2 -right-2">
                <button className="w-8 h-8 rounded-full bg-surface-DEFAULT dark:bg-surface-dark shadow flex items-center justify-center border border-border-DEFAULT dark:border-border-dark">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-text-tertiary dark:text-text-dark_tertiary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* Completion Ring */}
            <div className="absolute inset-0">
              <svg className="w-40 h-40" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f1f1f1"
                  strokeWidth="4"
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
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-surface-DEFAULT dark:bg-surface-dark text-warning-500 font-medium text-xs py-0.5 px-2 rounded-full border border-border-light dark:border-border-dark">
                {profileCompletion}%
              </div>
            </div>
          </div>

          {/* Basic Profile Info */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-text-primary dark:text-text-dark_primary">
                {userData?.users?.username || "Mirav Savaliya"}
              </h1>
              <button className="text-primary-500 dark:text-primary-dark">
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
            <p className="text-text-secondary dark:text-text-dark_secondary mb-1">
              B.Tech/B.E.
            </p>
            <p className="text-text-tertiary dark:text-text-dark_tertiary">
              Charotar University of Science and Technology, Anand
            </p>
          </div>

          {/* Contact Details */}
          <div className="w-full space-y-4">
            {/* Location */}
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-text-tertiary dark:text-text-dark_tertiary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-text-secondary dark:text-text-dark_secondary">
                {userData?.users?.address || "Rajkot"}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-text-tertiary dark:text-text-dark_tertiary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-text-secondary dark:text-text-dark_secondary flex items-center gap-1">
                {userData?.users?.phone || "7016867493"}
                <span className="text-success-500 dark:text-success-dark">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-text-tertiary dark:text-text-dark_tertiary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-text-secondary dark:text-text-dark_secondary flex items-center gap-1">
                {userData?.users?.email
                  ? userData.users.email.length > 20
                    ? `${userData.users.email.substring(0, 20)}...`
                    : userData.users.email
                  : "miravsavaliya2004@..."}
                <span className="text-success-500 dark:text-success-dark">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </span>
            </div>

            {/* Gender (Add) */}
            <div className="flex items-center gap-3 text-primary-500 dark:text-primary-dark cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Add Gender</span>
            </div>

            {/* Birthday (Add) */}
            <div className="flex items-center gap-3 text-primary-500 dark:text-primary-dark cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Add birthday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-surface-DEFAULT dark:bg-surface-dark rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-text-primary dark:text-text-dark_primary mb-4">
          Quick links
        </h2>
        <ul className="space-y-3">
          {quickLinks.map((link, index) => (
            <li key={index}>
              <a
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`block py-1 ${
                  // link.name === "Profile summary" && !userData.profileSummary
                  //   ? "text-primary-500 dark:text-primary-dark"
                  "text-text-secondary dark:text-text-dark_secondary"
                } hover:text-primary-500 dark:hover:text-primary-dark`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileSidebar;
