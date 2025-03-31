import React from "react";

const InternshipSection = ({ internships, onEdit, onAdd }) => {
  return (
    <div className="bg-surface-DEFAULT dark:bg-surface-dark rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-text-primary dark:text-text-dark_primary">
          Internships
        </h2>
        <button
          className="text-primary-500 dark:text-primary-dark hover:text-primary-hover dark:hover:text-primary-dark_hover"
          onClick={onAdd}
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-4">
        {internships && internships.length > 0 ? (
          internships.map((internship, index) => (
            <div
              key={internship.internship_id || index}
              onClick={() => onEdit(index)}
              className="flex items-center justify-between border border-border-DEFAULT dark:border-border-dark rounded-lg p-2 pr-4 bg-surface-DEFAULT dark:bg-surface-dark cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-darker transition-colors"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 flex-shrink-0 mr-3 bg-surface-100 dark:bg-border-darker rounded flex items-center justify-center">
                  {/* Company logo or first letter of company name if no logo */}
                  {internship.logoUrl ? (
                    <img
                      src={internship.logoUrl}
                      alt={`${internship.companyName} logo`}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <span className="text-text-secondary dark:text-text-dark_secondary font-medium">
                      {internship.companyName
                        ? internship.companyName.charAt(0)
                        : "C"}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-text-primary dark:text-text-dark_primary">
                    {internship.companyName || "Company Name"}
                  </div>
                  <div className="text-sm text-text-tertiary dark:text-text-dark_tertiary">
                    {formatDateRange(
                      internship.durationFrom,
                      internship.durationTo
                    )}
                  </div>
                </div>
              </div>

              {/* Pencil icon for edit */}
              <div className="flex-shrink-0 ml-3 text-text-tertiary dark:text-text-dark_tertiary">
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
                  className="opacity-50 group-hover:opacity-100"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full text-center py-4 text-text-tertiary dark:text-text-dark_tertiary">
            No internships added yet
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format date range from ISO dates to readable format
const formatDateRange = (fromDate, toDate) => {
  if (!fromDate) return "No date specified";

  const formatDate = (dateString) => {
    if (!dateString) return "Present";

    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().substr(-2); // Get last 2 digits

    return `${month}'${year}`;
  };

  return `${formatDate(fromDate)} to ${formatDate(toDate)}`;
};

export default InternshipSection;
