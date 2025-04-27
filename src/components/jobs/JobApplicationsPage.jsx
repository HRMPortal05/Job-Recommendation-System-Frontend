import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Loader } from "lucide-react";

const JobApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = jwtDecode(token).user_id;

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/job-applications/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background dark:bg-background-dark">
        <div className="flex flex-col items-center gap-2">
          <Loader className="w-8 h-8 animate-spin text-primary dark:text-primary-dark" />
          <p className="text-text-secondary dark:text-text-dark_secondary">
            Loading Applications...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background dark:bg-background-dark">
        <div className="text-warning-600 dark:text-warning-dark p-4 rounded-lg bg-warning-50 dark:bg-background-darker">
          Error: {error}
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = "";

    switch (status) {
      case "PENDING":
        badgeClass =
          "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300";
        break;
      case "CONTACTED":
        badgeClass =
          "bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-300";
        break;
      case "REJECTED":
        badgeClass =
          "bg-surface-200 text-text-secondary dark:bg-surface-dark dark:text-text-dark_secondary";
        break;
      default:
        badgeClass =
          "bg-surface-100 text-text-tertiary dark:bg-surface-dark dark:text-text-dark_tertiary";
    }

    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${badgeClass}`}
      >
        {status}
      </span>
    );
  };

  // Improved field rendering with consistent spacing and layout
  const renderField = (label, value) => {
    if (!value) return null;

    return (
      <div className="mb-4 border-b border-surface-200 dark:border-surface-400 pb-2">
        <span className="block text-text-tertiary dark:text-text-dark_tertiary text-sm font-medium mb-1">
          {label}
        </span>
        <span className="text-text-primary dark:text-text-dark_primary block">
          {value}
        </span>
      </div>
    );
  };

  // Application card component
  const ApplicationCard = ({ application }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="bg-surface dark:bg-surface-dark rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary dark:text-text-dark_primary">
                {application.jobTitle}
              </h2>
              <p className="text-text-secondary dark:text-text-dark_secondary text-lg">
                {application.companyName}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <StatusBadge status={application.status} />
            </div>
          </div>

          <div className="text-sm text-text-tertiary dark:text-text-dark_tertiary mb-6">
            Applied on {formatDate(application.appliedAt)} • Application ID:{" "}
            {application.applicationId.substring(0, 8)}...
          </div>

          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="text-primary-600 dark:text-primary-dark hover:underline text-sm font-medium"
            >
              Show Details
            </button>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-surface-50 dark:bg-surface-dark rounded-lg">
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark_primary p-4 border-b border-surface-200 dark:border-surface-400">
                    Applicant Details
                  </h3>
                  <div className="p-4">
                    {renderField("Name", application.applicantName)}
                    {renderField("Tech Stack", application.responses.techStack)}
                    {renderField("GitHub", application.responses.github)}
                    {renderField(
                      "Experience (Years)",
                      application.responses.experienceYears
                    )}

                    <div className="mb-2">
                      <span className="block text-text-tertiary dark:text-text-dark_tertiary text-sm font-medium mb-1">
                        Resume
                      </span>
                      {application.resumeUrl ? (
                        <a
                          href={application.resumeUrl}
                          className="text-primary-600 dark:text-primary-dark hover:underline block"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-text-muted dark:text-text-dark_muted block">
                          Not uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-surface-50 dark:bg-surface-dark rounded-lg">
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark_primary p-4 border-b border-surface-200 dark:border-surface-400">
                    Application Details
                  </h3>
                  <div className="p-4">
                    {renderField("Projects", application.responses.projects)}
                    {renderField(
                      "Certifications",
                      application.responses.certifications
                    )}
                    {renderField(
                      "Role Interest",
                      application.responses.roleInterest
                    )}
                    {renderField(
                      "Salary Expectation",
                      application.responses.salaryExpectation
                        ? `$${application.responses.salaryExpectation}`
                        : null
                    )}
                  </div>
                </div>
              </div>

              {(application.responses.teamworkExperience ||
                application.responses.remoteSetup ||
                application.responses.problemSolving ||
                application.responses.openSource) && (
                <div className="bg-surface-50 dark:bg-surface-dark rounded-lg mb-6">
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark_primary p-4 border-b border-surface-200 dark:border-surface-400">
                    Additional Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-4">
                    <div>
                      {renderField(
                        "Teamwork Experience",
                        application.responses.teamworkExperience
                      )}
                      {renderField(
                        "Problem Solving",
                        application.responses.problemSolving
                      )}
                    </div>
                    <div>
                      {renderField(
                        "Remote Setup",
                        application.responses.remoteSetup
                      )}
                      {renderField(
                        "Open Source",
                        application.responses.openSource
                      )}
                    </div>
                  </div>
                </div>
              )}

              {(application.responses.learningGoal ||
                application.responses.careerGoals) && (
                <div className="bg-surface-50 dark:bg-surface-dark rounded-lg">
                  <h3 className="text-lg font-medium text-text-primary dark:text-text-dark_primary p-4 border-b border-surface-200 dark:border-surface-400">
                    Career Goals
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 p-4">
                    <div>
                      {renderField(
                        "Learning Goals",
                        application.responses.learningGoal
                      )}
                    </div>
                    <div>
                      {renderField(
                        "Career Goals",
                        application.responses.careerGoals
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setExpanded(false)}
                className="text-primary-600 dark:text-primary-dark hover:underline text-sm font-medium mt-4"
              >
                Hide Details
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto mt-20 md:mt-14 lg:mt-14">
        <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark_primary mb-8">
          Your Job Applications
        </h1>

        {applications.length > 0 ? (
          applications.map((application) => (
            <ApplicationCard
              key={application.applicationId}
              application={application}
            />
          ))
        ) : (
          <div className="bg-surface-50 dark:bg-surface-dark p-6 rounded-lg text-center">
            <p className="text-text-primary dark:text-text-dark_primary">
              No job applications found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationsPage;
