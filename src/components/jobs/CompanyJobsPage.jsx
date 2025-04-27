import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Briefcase,
  MapPin,
  Clock,
  Tag,
  User,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  Mail,
  Loader,
  DollarSign,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { enqueueSnackbar } from "notistack";
import * as XLSX from "xlsx";

const CompanyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [expandedApplications, setExpandedApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.roles;

      if (role !== "COMPANY") {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Get user_id from localStorage or context
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const user_id = decodedToken.user_id;

        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/userjobs/all-jobs-based-of-company/${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setJobs(response.data);

        // Set company name if jobs exist
        if (response.data.length > 0) {
          setCompanyName(response.data[0].companyName);
        }

        // Fetch applications for each job
        const applicationsData = {};
        for (const job of response.data) {
          try {
            const appResponse = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/job-applications/job/${
                job.userJobId
              }`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            applicationsData[job.userJobId] = appResponse.data;
          } catch (err) {
            console.error(
              `Error fetching applications for job ${job.userJobId}:`,
              err
            );
            applicationsData[job.userJobId] = [];
          }
        }

        setApplications(applicationsData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch jobs. Please try again later.");
        setLoading(false);
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/userjobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Remove the deleted job from state
        setJobs(jobs.filter((job) => job.userJobId !== jobId));
      } catch (err) {
        console.error("Error deleting job:", err);
        enqueueSnackbar("Failed to delete job. Please try again.", {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    }
  };

  const toggleApplicationExpand = (jobId, applicationId) => {
    setExpandedApplications((prev) => {
      const key = `${jobId}-${applicationId}`;
      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/job-applications/${applicationId}/status?status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update applications state
      setApplications((prev) => {
        const updated = { ...prev };

        // Find which job contains this application and update its status
        Object.keys(updated).forEach((jobId) => {
          updated[jobId] = updated[jobId].map((app) =>
            app.applicationId === applicationId
              ? { ...app, status: newStatus }
              : app
          );
        });

        return updated;
      });
    } catch (err) {
      console.error("Error updating application status:", err);
      enqueueSnackbar(
        "Failed to update application status. Please try again.",
        {
          variant: "error",
          autoHideDuration: 3000,
        }
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const generateAndDownloadExcel = (jobId, applicationsData) => {
    try {
      console.log("Generating Excel file for job:", jobId);

      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Convert your data to worksheet format
      const worksheet = XLSX.utils.json_to_sheet(applicationsData);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Create blob and trigger download
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `applications-job-${jobId}.xlsx`);

      // Append to document, click and clean up
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      console.log("Excel file generated and download initiated");
    } catch (err) {
      console.error("Error generating Excel file:", err);
      enqueueSnackbar("Failed to generate Excel file. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const handleDownloadExcel = (jobId) => {
    try {
      // Get the applications data for this job
      const jobApplications = applications[jobId] || [];

      // If no applications, show a message and return
      if (jobApplications.length === 0) {
        enqueueSnackbar("No applications to download", {
          variant: "info",
          autoHideDuration: 3000,
        });
        return;
      }

      // Prepare data for Excel export - format the data appropriately
      const excelData = jobApplications.map((app) => {
        // Create a flattened structure for the Excel file
        const baseData = {
          "Applicant Name": app.applicantName,
          Status: app.status,
          "Applied Date": formatDate(app.appliedAt),
          "Resume URL": app.resumeUrl || "No resume provided",
        };

        // Add any custom responses to the data
        if (app.responses) {
          Object.entries(app.responses).forEach(([key, value]) => {
            // Format the key nicely (camelCase to Title Case)
            const formattedKey = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());

            baseData[formattedKey] = value || "";
          });
        }

        return baseData;
      });

      // Use the existing function to generate and download the Excel file
      generateAndDownloadExcel(jobId, excelData);

      // Show success message
      enqueueSnackbar("Applications downloaded successfully", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      console.error("Error downloading applications Excel:", err);
      enqueueSnackbar("Failed to download applications. Please try again.", {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  const renderJobTags = (tags) => {
    if (!tags) return null;

    return tags.split(",").map((tag, index) => (
      <span
        key={index}
        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100 mr-2 mb-2"
      >
        {tag.trim()}
      </span>
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-100";
      case "CONTACTED":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100";
      case "REJECTED":
        return "bg-surface-300 text-text-secondary dark:bg-surface-dark dark:text-text-dark_secondary";
      default:
        return "bg-surface-100 text-text-secondary dark:bg-surface-dark dark:text-text-dark_secondary";
    }
  };

  const StatusButton = ({ isActive, onClick, color, darkColor, children }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
        isActive
          ? `${color} ${darkColor} shadow-sm`
          : "bg-surface-100 text-text-tertiary dark:bg-hover-dark dark:text-text-dark_tertiary hover:bg-surface-200 dark:hover:bg-hover-darker"
      }`}
    >
      {children}
    </button>
  );

  const renderApplications = (jobId) => {
    const jobApplications = applications[jobId] || [];

    if (jobApplications.length === 0) {
      return (
        <div className="mt-6 p-8 bg-surface-50 dark:bg-hover-dark rounded-lg text-text-tertiary dark:text-text-dark_tertiary text-center border border-border dark:border-border-dark">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No applications yet for this job posting.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center px-8">
          <h3 className="text-xl font-semibold text-text-primary dark:text-text-dark_primary">
            Applications ({jobApplications.length})
          </h3>
          <button
            onClick={() => handleDownloadExcel(jobId)}
            className="inline-flex items-center px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-md hover:bg-primary-hover dark:hover:bg-primary-dark_hover transition-colors font-medium text-sm sm:text-base"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden md:inline lg:inline">
              Download Applications Excel
            </span>
            <span className="inline xs:hidden">Download</span>
          </button>
        </div>

        {jobApplications.map((application) => {
          const isExpanded =
            expandedApplications[`${jobId}-${application.applicationId}`];

          return (
            <div
              key={application.applicationId}
              className="border border-border dark:border-border-dark rounded-lg bg-surface dark:bg-surface-dark shadow-sm overflow-hidden"
            >
              <div
                className="p-5 cursor-pointer hover:bg-hover dark:hover:bg-hover-dark flex justify-between items-center transition-colors"
                onClick={() =>
                  toggleApplicationExpand(jobId, application.applicationId)
                }
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 bg-primary-50 dark:bg-primary-900 p-2 rounded-full">
                    <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary dark:text-text-dark_primary">
                      {application.applicantName}
                    </h4>
                    <div className="flex items-center text-sm text-text-tertiary dark:text-text-dark_tertiary mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Applied {formatDate(application.appliedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-text-tertiary dark:text-text-dark_tertiary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-text-tertiary dark:text-text-dark_tertiary" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-8 border-t border-border dark:border-border-dark bg-surface-50 dark:bg-hover-dark">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {application.resumeUrl && (
                      <div className="col-span-2 mb-3">
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-border dark:border-border-dark rounded-md text-sm font-medium text-text-primary dark:text-text-dark_primary bg-surface dark:bg-surface-dark hover:bg-hover dark:hover:bg-hover-dark transition-colors"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Resume
                        </a>
                      </div>
                    )}

                    {Object.entries(application.responses || {}).map(
                      ([key, value]) => {
                        if (!value) return null;

                        const formatKey = (key) => {
                          return key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase());
                        };

                        return (
                          <div key={key} className="mb-3">
                            <h5 className="text-sm font-medium text-text-tertiary dark:text-text-dark_tertiary mb-1">
                              {formatKey(key)}
                            </h5>
                            <p className="text-text-primary dark:text-text-dark_primary">
                              {value}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div className="border-t border-border dark:border-border-dark pt-6 mt-6">
                    <h5 className="text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-3">
                      Update Application Status
                    </h5>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <StatusButton
                          isActive={application.status === "PENDING"}
                          onClick={() =>
                            handleUpdateStatus(
                              application.applicationId,
                              "PENDING"
                            )
                          }
                          color="bg-warning-100 text-warning-800"
                          darkColor="dark:bg-warning-900 dark:text-warning-100"
                        >
                          Pending
                        </StatusButton>
                        <StatusButton
                          isActive={application.status === "CONTACTED"}
                          onClick={() =>
                            handleUpdateStatus(
                              application.applicationId,
                              "CONTACTED"
                            )
                          }
                          color="bg-primary-100 text-primary-800"
                          darkColor="dark:bg-primary-900 dark:text-primary-100"
                        >
                          Contacted
                        </StatusButton>
                        <StatusButton
                          isActive={application.status === "REJECTED"}
                          onClick={() =>
                            handleUpdateStatus(
                              application.applicationId,
                              "REJECTED"
                            )
                          }
                          color="bg-surface-300 text-text-secondary"
                          darkColor="dark:bg-surface-dark dark:text-text-dark_secondary"
                        >
                          Rejected
                        </StatusButton>
                      </div>
                      <div className="flex justify-end">
                        <button className="inline-flex items-center px-4 py-2 border border-primary dark:border-primary-dark text-primary dark:text-primary-dark bg-surface dark:bg-surface-dark rounded-md text-sm font-medium hover:bg-primary hover:text-white dark:hover:bg-primary-dark dark:hover:text-white transition-colors">
                          <Mail className="mr-2 h-4 w-4" />
                          Contact Applicant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background dark:bg-background-dark">
        <div className="flex flex-col items-center gap-2">
          <Loader className="w-8 h-8 animate-spin text-primary dark:text-primary-dark" />
          <p className="text-text-secondary dark:text-text-dark_secondary">
            Loading jobs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background dark:bg-background-dark">
        <div className="text-center p-8 bg-surface dark:bg-surface-dark rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-text-primary dark:text-text-dark_primary mb-3">
            Error
          </h2>
          <p className="text-text-secondary dark:text-text-dark_secondary mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-md hover:bg-primary-hover dark:hover:bg-primary-dark_hover transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="flex items-center mb-10 mt-16">
          <button
            onClick={() => window.history.back()}
            className="mr-4 p-2 rounded-full hover:bg-hover dark:hover:bg-hover-dark transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-text-primary dark:text-text-dark_primary" />
          </button>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark_primary">
            {companyName
              ? `${companyName} Job Postings`
              : "Company Job Postings"}
          </h1>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-md p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto text-text-tertiary dark:text-text-dark_tertiary mb-6 opacity-70" />
            <h2 className="text-2xl font-semibold text-text-primary dark:text-text-dark_primary mb-4">
              No Jobs Posted
            </h2>
            <p className="text-text-secondary dark:text-text-dark_secondary mb-8 max-w-md mx-auto">
              You haven't posted any jobs yet. Create your first job posting to
              start receiving applications.
            </p>
            <Link
              to="/postjob"
              className="inline-flex items-center px-5 py-3 bg-primary dark:bg-primary-dark text-white rounded-md hover:bg-primary-hover dark:hover:bg-primary-dark_hover transition-colors font-medium"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-text-primary dark:text-text-dark_primary font-medium text-lg">
                  Active Job Postings
                </p>
                <p className="text-text-tertiary dark:text-text-dark_tertiary">
                  {jobs.length} {jobs.length === 1 ? "job" : "jobs"} posted
                </p>
              </div>
              <Link
                to="/postjob"
                className="px-5 py-3 bg-primary dark:bg-primary-dark text-white rounded-md hover:bg-primary-hover dark:hover:bg-primary-dark_hover transition-colors font-medium"
              >
                Post New Job
              </Link>
            </div>

            {jobs.map((job) => (
              <div
                key={job.userJobId}
                className="bg-surface dark:bg-surface-dark rounded-lg shadow-md overflow-hidden mb-8 border border-border dark:border-border-dark"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-text-primary dark:text-text-dark_primary">
                        {job.title}
                      </h2>
                      <p className="text-text-secondary dark:text-text-dark_secondary mt-1">
                        {job.companyName}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <a
                        href={`/edit-job/${job.userJobId}`}
                        className="p-2 text-text-tertiary dark:text-text-dark_tertiary hover:text-primary dark:hover:text-primary-dark rounded-full hover:bg-hover dark:hover:bg-hover-dark transition-colors"
                        aria-label="Edit job"
                      >
                        <Edit className="h-5 w-5" />
                      </a>
                      <button
                        onClick={() => handleDeleteJob(job.userJobId)}
                        className="p-2 text-text-tertiary dark:text-text-dark_tertiary hover:text-warning-600 dark:hover:text-warning-400 rounded-full hover:bg-hover dark:hover:bg-hover-dark transition-colors"
                        aria-label="Delete job"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap mt-5 text-text-tertiary dark:text-text-dark_tertiary text-sm">
                    {job.city && job.state && (
                      <div className="flex items-center mr-6 mb-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>
                          {job.city}, {job.state}
                        </span>
                      </div>
                    )}

                    {job.jobType && (
                      <div className="flex items-center mr-6 mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{job.jobType}</span>
                      </div>
                    )}

                    {job.salary && (
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                  </div>

                  <div
                    className="mt-6 prose dark:prose-invert max-w-none text-text-primary dark:text-text-dark_primary"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />

                  <div className="mt-6">
                    <div className="flex flex-wrap items-center">
                      <Tag className="h-4 w-4 mr-2 text-text-tertiary dark:text-text-dark_tertiary" />
                      <div className="flex flex-wrap">
                        {renderJobTags(job.tags)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border dark:border-border-dark text-sm">
                    <div className="text-text-tertiary dark:text-text-dark_tertiary">
                      Updated {formatDate(job.updatedAt)}
                    </div>
                  </div>
                </div>

                {/* Applications Section */}
                {renderApplications(job.userJobId)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyJobsPage;
