import React, { useState } from "react";
import { X, Loader } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const ApplyNowModal = ({ job, isVisible, onClose, formConfig }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    yearsExperience: "",
    careerGoals: "",
    certifications: "",
    learningGoal: "",
    problemSolving: "",
    projects: "",
    teamworkExperience: "",
    github: "",
    openSource: "",
    remoteSetup: "",
    roleInterest: "",
    salaryExpectation: "",
    techStack: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Check each field based on formConfig
    if (formConfig.askYearsExperience && !formData.yearsExperience.trim()) {
      errors.yearsExperience = true;
      isValid = false;
    }
    if (formConfig.askCareerGoals && !formData.careerGoals.trim()) {
      errors.careerGoals = true;
      isValid = false;
    }
    if (formConfig.askCertifications && !formData.certifications.trim()) {
      errors.certifications = true;
      isValid = false;
    }
    if (formConfig.askLearningGoal && !formData.learningGoal.trim()) {
      errors.learningGoal = true;
      isValid = false;
    }
    if (formConfig.askProblemSolving && !formData.problemSolving.trim()) {
      errors.problemSolving = true;
      isValid = false;
    }
    if (formConfig.askProjects && !formData.projects.trim()) {
      errors.projects = true;
      isValid = false;
    }
    if (
      formConfig.askTeamworkExperience &&
      !formData.teamworkExperience.trim()
    ) {
      errors.teamworkExperience = true;
      isValid = false;
    }
    if (formConfig.askGitHub && !formData.github.trim()) {
      errors.github = true;
      isValid = false;
    }
    if (formConfig.askOpenSourceContribution && !formData.openSource.trim()) {
      errors.openSource = true;
      isValid = false;
    }
    if (formConfig.askRemoteSetup && !formData.remoteSetup.trim()) {
      errors.remoteSetup = true;
      isValid = false;
    }
    if (formConfig.askRoleInterest && !formData.roleInterest.trim()) {
      errors.roleInterest = true;
      isValid = false;
    }
    if (formConfig.askSalaryExpectation && !formData.salaryExpectation.trim()) {
      errors.salaryExpectation = true;
      isValid = false;
    }
    if (formConfig.askTechStack && !formData.techStack.trim()) {
      errors.techStack = true;
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      const userId = decodedToken?.user_id;

      // Prepare the data for API call - include all fields in the answers object
      const payload = {
        userId,
        userJobId: job.userJobId,
        answers: {
          experienceYears: formConfig.askYearsExperience
            ? formData.yearsExperience
            : null,
          careerGoals: formConfig.askCareerGoals ? formData.careerGoals : null,
          certifications: formConfig.askCertifications
            ? formData.certifications
            : null,
          learningGoal: formConfig.askLearningGoal
            ? formData.learningGoal
            : null,
          problemSolving: formConfig.askProblemSolving
            ? formData.problemSolving
            : null,
          projects: formConfig.askProjects ? formData.projects : null,
          teamworkExperience: formConfig.askTeamworkExperience
            ? formData.teamworkExperience
            : null,
          github: formConfig.askGitHub ? formData.github : null,
          openSource: formConfig.askOpenSourceContribution
            ? formData.openSource
            : null,
          remoteSetup: formConfig.askRemoteSetup ? formData.remoteSetup : null,
          roleInterest: formConfig.askRoleInterest
            ? formData.roleInterest
            : null,
          salaryExpectation: formConfig.askSalaryExpectation
            ? formData.salaryExpectation
            : null,
          techStack: formConfig.askTechStack ? formData.techStack : null,
        },
      };

      // Make API call
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/job-applications/quick-apply`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
        // Reset form data
        setFormData({
          yearsExperience: "",
          careerGoals: "",
          certifications: "",
          learningGoal: "",
          problemSolving: "",
          projects: "",
          teamworkExperience: "",
          github: "",
          openSource: "",
          remoteSetup: "",
          roleInterest: "",
          salaryExpectation: "",
          techStack: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Application submission error:", error);
      setSubmitError(
        error.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  // Helper function to determine input className based on validation state
  const getInputClassName = (fieldName) => {
    const baseClass =
      "w-full p-3 border h-14 max-h-40 rounded-lg bg-white dark:bg-hover-dark border-border-DEFAULT dark:border-border-dark text-text-primary dark:text-text-dark_primary focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent";
    return validationErrors[fieldName]
      ? `${baseClass} border-red-500 dark:border-red-500`
      : baseClass;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 mt-16">
      <div className="bg-white dark:bg-background-dark w-full max-w-2xl rounded-lg shadow-lg max-h-[90vh] overflow-y-auto p-4">
        <div className="p-6 border-b border-border-DEFAULT dark:border-border-dark flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary dark:text-text-dark_primary">
            Apply for {job.title} at {job.companyName}
          </h2>
          <button onClick={onClose} className="p-1">
            <X className="w-6 h-6 text-text-tertiary dark:text-text-dark_tertiary hover:text-text-primary dark:hover:text-text-dark_primary" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-6 text-center">
            <div className="bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-dark p-4 rounded-lg mb-4">
              <p className="font-medium">Application submitted successfully!</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {submitError && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-4 rounded-lg mb-4">
                <p>{submitError}</p>
              </div>
            )}

            {/* Years of Experience */}
            {formConfig.askYearsExperience && (
              <div>
                <label
                  htmlFor="yearsExperience"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Years of Experience*
                </label>
                <input
                  type="text"
                  id="yearsExperience"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  className={getInputClassName("yearsExperience")}
                  placeholder="Enter your years of experience"
                />
              </div>
            )}

            {/* Career Goals */}
            {formConfig.askCareerGoals && (
              <div>
                <label
                  htmlFor="careerGoals"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Career Goals*
                </label>
                <textarea
                  id="careerGoals"
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleChange}
                  rows={3}
                  className={getInputClassName("careerGoals")}
                  placeholder="Describe your career goals for the next few years"
                />
              </div>
            )}

            {/* Certifications */}
            {formConfig.askCertifications && (
              <div>
                <label
                  htmlFor="certifications"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Certifications*
                </label>
                <textarea
                  id="certifications"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleChange}
                  rows={2}
                  className={getInputClassName("certifications")}
                  placeholder="List your relevant certifications"
                />
              </div>
            )}

            {/* GitHub */}
            {formConfig.askGitHub && (
              <div>
                <label
                  htmlFor="github"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  GitHub Profile*
                </label>
                <input
                  type="text"
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  className={getInputClassName("github")}
                  placeholder="Enter your GitHub profile URL"
                />
              </div>
            )}

            {/* Learning Goal */}
            {formConfig.askLearningGoal && (
              <div>
                <label
                  htmlFor="learningGoal"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Learning Goal*
                </label>
                <textarea
                  id="learningGoal"
                  name="learningGoal"
                  value={formData.learningGoal}
                  onChange={handleChange}
                  rows={2}
                  className={getInputClassName("learningGoal")}
                  placeholder="What are you currently learning or want to learn?"
                />
              </div>
            )}

            {/* Open Source Contribution */}
            {formConfig.askOpenSourceContribution && (
              <div>
                <label
                  htmlFor="openSource"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Open Source Contributions*
                </label>
                <textarea
                  id="openSource"
                  name="openSource"
                  value={formData.openSource}
                  onChange={handleChange}
                  rows={2}
                  className={getInputClassName("openSource")}
                  placeholder="Describe your open source contributions"
                />
              </div>
            )}

            {/* Problem Solving */}
            {formConfig.askProblemSolving && (
              <div>
                <label
                  htmlFor="problemSolving"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Problem Solving Experience*
                </label>
                <textarea
                  id="problemSolving"
                  name="problemSolving"
                  value={formData.problemSolving}
                  onChange={handleChange}
                  rows={3}
                  className={getInputClassName("problemSolving")}
                  placeholder="Describe your problem-solving approach and experience"
                />
              </div>
            )}

            {/* Projects */}
            {formConfig.askProjects && (
              <div>
                <label
                  htmlFor="projects"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Projects*
                </label>
                <textarea
                  id="projects"
                  name="projects"
                  value={formData.projects}
                  onChange={handleChange}
                  rows={3}
                  className={getInputClassName("projects")}
                  placeholder="Describe your relevant projects"
                />
              </div>
            )}

            {/* Remote Setup */}
            {formConfig.askRemoteSetup && (
              <div>
                <label
                  htmlFor="remoteSetup"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Remote Work Setup*
                </label>
                <textarea
                  id="remoteSetup"
                  name="remoteSetup"
                  value={formData.remoteSetup}
                  onChange={handleChange}
                  rows={2}
                  className={getInputClassName("remoteSetup")}
                  placeholder="Describe your remote work setup and experience"
                />
              </div>
            )}

            {/* Role Interest */}
            {formConfig.askRoleInterest && (
              <div>
                <label
                  htmlFor="roleInterest"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Why are you interested in this role?*
                </label>
                <textarea
                  id="roleInterest"
                  name="roleInterest"
                  value={formData.roleInterest}
                  onChange={handleChange}
                  rows={3}
                  className={getInputClassName("roleInterest")}
                  placeholder="Explain why you are interested in this role"
                />
              </div>
            )}

            {/* Salary Expectation */}
            {formConfig.askSalaryExpectation && (
              <div>
                <label
                  htmlFor="salaryExpectation"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Salary Expectation*
                </label>
                <input
                  type="text"
                  id="salaryExpectation"
                  name="salaryExpectation"
                  value={formData.salaryExpectation}
                  onChange={handleChange}
                  className={getInputClassName("salaryExpectation")}
                  placeholder="Enter your salary expectation"
                />
              </div>
            )}

            {/* Tech Stack */}
            {formConfig.askTechStack && (
              <div>
                <label
                  htmlFor="techStack"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Tech Stack*
                </label>
                <textarea
                  id="techStack"
                  name="techStack"
                  value={formData.techStack}
                  onChange={handleChange}
                  rows={2}
                  className={getInputClassName("techStack")}
                  placeholder="List technologies you're proficient with"
                />
              </div>
            )}

            {/* Teamwork Experience */}
            {formConfig.askTeamworkExperience && (
              <div>
                <label
                  htmlFor="teamworkExperience"
                  className="block mb-2 text-sm font-medium text-text-primary dark:text-text-dark_primary"
                >
                  Teamwork Experience*
                </label>
                <textarea
                  id="teamworkExperience"
                  name="teamworkExperience"
                  value={formData.teamworkExperience}
                  onChange={handleChange}
                  rows={3}
                  className={getInputClassName("teamworkExperience")}
                  placeholder="Describe your experience working in teams"
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-border-DEFAULT dark:border-border-dark rounded-lg text-text-primary dark:text-text-dark_primary hover:bg-hover-DEFAULT dark:hover:bg-hover-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark_hover text-white rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyNowModal;
