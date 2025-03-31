import React from "react";

const ProjectsSection = ({ projects = [], onAdd, onEdit }) => {
  return (
    <div className="bg-surface-DEFAULT p-6 rounded-lg shadow-sm dark:bg-surface-dark mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg text-text-primary dark:text-text-dark_primary font-medium">
          Projects
        </h2>
        <button
          className="text-primary-500 dark:hover:text-primary-dark_hover dark:text-primary-dark hover:text-primary-hover"
          onClick={onAdd}
        >
          Add
        </button>
      </div>

      {!projects ||
      projects.length === 0 ||
      (projects.length === 1 && !projects[0].projectName) ? (
        <p className="text-base text-text-secondary dark:text-text-dark_secondary">
          Talk about your projects that made you proud and contributed to your
          learnings
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map(
            (project, index) =>
              project.projectName && (
                <div
                  key={project.projects_id || index}
                  className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-text-primary dark:text-text-dark_primary font-medium">
                        {project.projectName}
                      </h3>
                      <p className="text-sm text-text-secondary dark:text-text-dark_secondary">
                        {formatDate(project.projectDurationFrom)} to{" "}
                        {formatDate(project.projectDurationTo)}
                      </p>
                    </div>
                    <button
                      onClick={() => onEdit(index)}
                      className="p-1 rounded-full text-primary-500 dark:hover:bg-gray-700 dark:text-primary-dark hover:bg-gray-100"
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
                  {project.projectDescription && (
                    <p className="text-sm text-text-secondary dark:text-text-dark_secondary line-clamp-3 mt-2">
                      {project.projectDescription}
                    </p>
                  )}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to format dates as shown in the screenshot (Month'YY format)
const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);

    return `${month}'${year}`;
  } catch (error) {
    return "";
  }
};

export default ProjectsSection;
