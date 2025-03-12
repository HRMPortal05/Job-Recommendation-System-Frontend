import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import CareerPreferencesPopup from "./popupforms/CareerPreferencesPopup";
import EducationPopup from "./popupforms/EducationPopup";
import AddEducationForm from "./popupforms/AddEducationForm";
import EducationSection from "./EducationSection";
import CareerPreferencesSection from "./CareerPreferencesSection";
import SkillsSection from "./SkillsSection";
import KeySkillsForm from "./popupforms/KeySkillsForm";
import ProfileSummaryForm from "./popupforms/ProfileSummaryForm";
import ProfileSummarySection from "./ProfileSummarySection";
import InternshipSection from "./InternshipSection";
import InternshipForm from "./popupforms/InternshipForm";
import ProfileSidebar from "./ProfileSidebar";

const CompleteProfilePage = () => {
  const [profileCompletion, setProfileCompletion] = useState(46);

  const [mainData, setMainData] = useState({
    careerPreferences_id: "",
    preferedJobType: "",
    preferedLocation: "",
    profileSummary: "",
    keySkills: "Java, Spring Boot, PostgreSQL, React",
    language: "",
    users: {
      user_id: "",
      username: "",
      email: "",
      phone: "",
      address: "",
      resumeUrl:
        "https://res.cloudinary.com/duzoeq3dw/image/upload/v1740208672/Odoo_x_Charusat_Hackathon_2025.pdf",
    },
    internships: [
      {
        internship_id: "",
        companyName: "ui corp",
        durationFrom: "may 2025",
        durationTo: "june 2026",
        description: "dsjbadsaskdjhabsd",
      },
    ],
    projects: [
      {
        projects_id: "",
        projectName: "",
        projectDescription: "",
        projectDuration: "",
      },
    ],
    education: {
      education_id: "",
      degrees: [],
      class12: {
        class12_id: "",
        board: "",
        mediumOfStudy: "",
        percentage: "",
        passingYear: "",
      },
      class10: {
        class12_id: "",
        board: "",
        mediumOfStudy: "",
        percentage: "",
        passingYear: "",
      },
    },
  });

  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showCareerPopup, setShowCareerPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEducationPopup, setShowEducationPopup] = useState(false);
  const [showKeySkillsForm, setShowKeySkillsForm] = useState(false);
  const [showProfileSummaryForm, setShowProfileSummaryForm] = useState(false);
  const [showInternshipsForm, setShowInternshipsForm] = useState(false);
  const [showProjectsForm, setShowProjectsForm] = useState(false);

  const [educationType, setEducationType] = useState(null);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  // Update career preferences
  const updateCareerPreferences = async (updatedPreferences) => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user_id;

    setIsLoading(true);

    try {
      // API call commented out
      console.log("Updated career preferences:", updatedPreferences);

      // Update mainData instead of separate careerPreferences state
      setMainData((prevData) => ({
        ...prevData,
        preferedJobType: updatedPreferences.preferedJobType,
        preferedLocation: updatedPreferences.preferedLocation,
        availabilityToWork: updatedPreferences.availabilityToWork,
      }));

      setShowCareerPopup(false);
    } catch (error) {
      console.error("Error updating career preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Handle edit button click for career preferences
  const handleEditCareer = () => {
    setShowCareerPopup(true);
  };

  // Handle any "Add" button click for career preferences
  const handleAddCareer = () => {
    setShowCareerPopup(true);
  };

  // Handle adding a new education entry
  const handleAddEducation = (type) => {
    setEducationType(type);

    // Use AddEducationForm for graduate entries, EducationPopup for others
    if (type === "graduate") {
      setShowEducationForm(true);
    } else {
      setShowEducationPopup(true);
    }
  };

  // Handle closing the education popup
  const handleCloseEducationPopup = () => {
    setShowEducationPopup(false);
    setCurrentEditIndex(null);
  };

  // Handle saving education data
  const handleSaveEducation = (data) => {
    setMainData((prevData) => {
      if (educationType === "class12") {
        return {
          ...prevData,
          education: {
            ...prevData.education,
            class12: data,
          },
        };
      } else if (educationType === "class10") {
        return {
          ...prevData,
          education: {
            ...prevData.education,
            class10: data,
          },
        };
      }
      return prevData;
    });

    setShowEducationPopup(false);
  };

  // Special handler for graduate entries
  const handleSaveGraduate = (formData, editIndex) => {
    // Extract just the graduate object from the nested structure
    const { cgpaSystem, ...graduateData } = formData.graduate;

    setMainData((prevData) => {
      const degrees = [...prevData.education.degrees];

      if (editIndex !== null && editIndex !== undefined) {
        // Update existing entry
        degrees[editIndex] = graduateData;
      } else {
        // Add new entry
        degrees.push(graduateData);
      }

      return {
        ...prevData,
        education: {
          ...prevData.education,
          degrees,
        },
      };
    });

    // Reset UI states
    setShowEducationForm(false);
    setCurrentEditIndex(null);
  };

  // Handle canceling the education form
  const handleCancelEducation = () => {
    setShowEducationForm(false);
    setCurrentEditIndex(null);
  };

  // Handle editing an existing entry
  const handleEditEducation = (type, index) => {
    setEducationType(type);
    setCurrentEditIndex(index);

    if (type === "graduate") {
      setShowEducationForm(true);
    } else {
      setShowEducationPopup(true);
    }
  };

  const handleAddEducationForm = () => {
    setShowEducationForm(true);
  };

  //handle edit skills
  const handleEditSkills = () => {
    setShowKeySkillsForm(!showKeySkillsForm);
  };

  const handleSaveKeySkills = (skills) => {
    setMainData((prevData) => ({
      ...prevData,
      keySkills: skills.join(", "),
    }));
    setShowKeySkillsForm(false);
  };

  // Handle edit profile summary
  const handleEditProfileSummary = () => {
    setShowProfileSummaryForm(!showProfileSummaryForm);
  };

  const handleSaveProfileSummary = (summary) => {
    setMainData((prevData) => ({
      ...prevData,
      profileSummary: summary,
    }));
    handleEditProfileSummary();
  };

  const handleDeleteProfileSummary = () => {
    setMainData((prevData) => ({
      ...prevData,
      profileSummary: "",
    }));
    handleEditProfileSummary();
  };

  // Separate functions for adding and editing internships
  const handleAddInternship = () => {
    setCurrentEditIndex(null);
    setShowInternshipsForm(true);
  };

  const handleEditInternship = (index) => {
    setCurrentEditIndex(index);
    setShowInternshipsForm(true);
  };

  const handleSaveInternships = (internshipData, editIndex = null) => {
    setMainData((prevData) => {
      const updatedInternships = [...prevData.internships];

      if (editIndex !== null && editIndex !== undefined) {
        // Update existing internship
        updatedInternships[editIndex] = internshipData;
      } else {
        // Add new internship
        updatedInternships.push(internshipData);
      }

      return {
        ...prevData,
        internships: updatedInternships,
      };
    });

    setCurrentEditIndex(null);
    setShowInternshipsForm(false);
  };

  const handleCancelInternship = () => {
    setCurrentEditIndex(null);
    setShowInternshipsForm(false);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-6xl mx-auto p-6 pt-24">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info - Now using the ProfileSidebar component */}
          <ProfileSidebar
            userData={mainData}
            profileCompletion={profileCompletion}
          />

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs Navigation */}
            <div className="mb-6 border-b border-border-DEFAULT dark:border-border-dark">
              <div className="flex space-x-8">
                <button className="pb-2 text-primary-500 dark:text-primary-dark font-medium border-b-2 border-primary-500 dark:border-primary-dark">
                  View & Edit
                </button>
                {/* <button className="pb-2 text-text-tertiary dark:text-text-dark_tertiary">
                  Activity insights
                </button> */}
              </div>
            </div>
            {/* Profile Completion Card - Moved from sidebar to prominent position */}
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
                    <div className="font-medium">Basic</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center justify-between p-3 bg-surface-DEFAULT dark:bg-surface-dark rounded-md border border-border-DEFAULT dark:border-border-dark">
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
                      Add details
                    </span>
                  </div>
                  <span className="text-success-500 dark:text-success-dark text-sm">
                    ↑ 8%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-DEFAULT dark:bg-surface-dark rounded-md border border-border-DEFAULT dark:border-border-dark">
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
                      Add details
                    </span>
                  </div>
                  <span className="text-success-500 dark:text-success-dark text-sm">
                    ↑ 7%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-DEFAULT dark:bg-surface-dark rounded-md border border-border-DEFAULT dark:border-border-dark">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-text-tertiary dark:text-text-dark_tertiary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-text-secondary dark:text-text-dark_secondary">
                      Add competitive exam
                    </span>
                  </div>
                  <span className="text-success-500 dark:text-success-dark text-sm">
                    ↑ 6%
                  </span>
                </div>
              </div>

              <button className="w-full bg-warning-500 hover:bg-warning-600 dark:bg-warning-dark dark:hover:bg-warning-600 text-white py-3 px-4 rounded-md font-medium">
                Add 11 missing details
              </button>
            </div>

            <div id="career-preferences-section"></div>
            <CareerPreferencesSection
              careerPreferences={mainData}
              handleAddCareer={handleAddCareer}
              handleEditCareer={handleEditCareer}
              showCareerPopup={showCareerPopup}
              setShowCareerPopup={setShowCareerPopup}
              updateCareerPreferences={updateCareerPreferences}
              isLoading={isLoading}
            />

            {/* Career Preferences Popup */}
            {showCareerPopup && (
              <CareerPreferencesPopup
                initialPreferences={mainData}
                onClose={() => setShowCareerPopup(false)}
                onSave={updateCareerPreferences}
                isLoading={isLoading}
              />
            )}

            {/* Education Section */}
            <div id="education-section">
              <EducationSection
                educationData={mainData.education}
                handleAddEducation={handleAddEducation}
                handleEditEducation={handleEditEducation}
                handleAddEducationForm={handleAddEducationForm}
              />
            </div>

            {showEducationPopup && (
              <EducationPopup
                educationType={
                  educationType === "class12"
                    ? "classXII"
                    : educationType === "class10"
                    ? "classX"
                    : educationType
                }
                onClose={handleCloseEducationPopup}
                onSave={handleSaveEducation}
                initialData={
                  educationType === "class12"
                    ? mainData.education.class12
                    : educationType === "class10"
                    ? mainData.education.class10
                    : null
                }
              />
            )}

            {showEducationForm && (
              <AddEducationForm
                onCancel={handleCancelEducation}
                onSave={handleSaveGraduate}
                initialData={
                  currentEditIndex !== null
                    ? mainData.education.degrees[currentEditIndex]
                    : null
                }
                educationType="graduate"
                editIndex={currentEditIndex}
              />
            )}

            {/* Skills Section */}
            <div id="skills-section">
              <SkillsSection
                keySkills={mainData.keySkills}
                onEdit={handleEditSkills}
              />
            </div>

            {showKeySkillsForm && (
              <KeySkillsForm
                onCancel={handleEditSkills}
                onSave={handleSaveKeySkills}
                initialSkills={mainData.keySkills}
              />
            )}

            {/* Profile Summary Section */}
            <div id="profile-summary-section">
              <ProfileSummarySection
                profileSummary={mainData.profileSummary}
                onEdit={handleEditProfileSummary}
              />
            </div>

            {showProfileSummaryForm && (
              <ProfileSummaryForm
                onCancel={handleEditProfileSummary}
                onSave={handleSaveProfileSummary}
                onDelete={handleDeleteProfileSummary}
                initialSummary={mainData.profileSummary}
              />
            )}

            {/* Internships Section */}
            <div id="internships-section">
              <InternshipSection
                internships={mainData.internships}
                onEdit={handleEditInternship}
                onAdd={handleAddInternship}
              />
            </div>

            {showInternshipsForm && (
              <InternshipForm
                onCancel={handleCancelInternship}
                onSave={handleSaveInternships}
                initialInternships={
                  currentEditIndex !== null
                    ? mainData.internships[currentEditIndex]
                    : null
                }
                editIndex={currentEditIndex}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
