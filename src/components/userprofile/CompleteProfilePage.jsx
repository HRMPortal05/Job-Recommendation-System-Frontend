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
import { Loader } from "lucide-react";

const CompleteProfilePage = () => {
  // Define profile sections with their weights for percentage calculation
  const profileSections = {
    careerPreferences: {
      weight: 15,
      fields: ["preferedJobType", "preferedLocation", "availabilityToWork"],
    },
    profileSummary: { weight: 10, fields: ["profileSummary"] },
    keySkills: { weight: 15, fields: ["keySkills"] },
    internships: { weight: 15, isArray: true },
    projects: { weight: 15, isArray: true },
    education: {
      weight: 30,
      nestedFields: {
        degrees: { isArray: true, weight: 15 },
        class12: {
          weight: 7.5,
          fields: ["board", "percentage", "passingYear"],
        },
        class10: {
          weight: 7.5,
          fields: ["board", "percentage", "passingYear"],
        },
      },
    },
  };

  const [profileCompletion, setProfileCompletion] = useState(46);
  const [missingDetails, setMissingDetails] = useState([]);

  const [mainData, setMainData] = useState({
    careerPreferences_id: "",
    preferedJobType: "",
    preferedLocation: "",
    profileSummary: "",
    keySkills: "",
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
    internships: [],
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

  // Calculate profile completion percentage
  useEffect(() => {
    calculateProfileCompletion(mainData);
  }, [mainData]);

  const calculateProfileCompletion = (data) => {
    let totalWeight = 0;
    let completedWeight = 0;
    const missingItems = [];

    // Helper function to check if a field is completed
    const isFieldCompleted = (value) => {
      if (Array.isArray(value)) {
        return (
          value.length > 0 &&
          value.some((item) =>
            Object.values(item).some(
              (val) => val && val.toString().trim() !== ""
            )
          )
        );
      }
      return value && value.toString().trim() !== "";
    };

    // Process each section
    Object.entries(profileSections).forEach(([sectionKey, sectionConfig]) => {
      totalWeight += sectionConfig.weight;

      // Handle nested fields (like education)
      if (sectionConfig.nestedFields) {
        let nestedTotalWeight = 0;
        let nestedCompletedWeight = 0;

        Object.entries(sectionConfig.nestedFields).forEach(
          ([nestedKey, nestedConfig]) => {
            nestedTotalWeight += nestedConfig.weight;

            if (nestedConfig.isArray) {
              if (
                data[sectionKey][nestedKey] &&
                data[sectionKey][nestedKey].length > 0
              ) {
                nestedCompletedWeight += nestedConfig.weight;
              } else {
                missingItems.push(
                  `Add ${nestedKey.replace(/([A-Z])/g, " $1").toLowerCase()}`
                );
              }
            } else {
              const nestedObj = data[sectionKey][nestedKey];
              const fieldsToCheck =
                nestedConfig.fields || Object.keys(nestedObj || {});
              let fieldCount = 0;
              let completedCount = 0;

              fieldsToCheck.forEach((field) => {
                fieldCount++;
                if (nestedObj && isFieldCompleted(nestedObj[field])) {
                  completedCount++;
                }
              });

              if (fieldCount > 0) {
                const completionRatio =
                  fieldCount > 0 ? completedCount / fieldCount : 0;
                nestedCompletedWeight += nestedConfig.weight * completionRatio;

                if (completionRatio < 1) {
                  missingItems.push(
                    `Add ${nestedKey
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()} details`
                  );
                }
              }
            }
          }
        );

        completedWeight +=
          sectionConfig.weight * (nestedCompletedWeight / nestedTotalWeight);
      }
      // Handle array fields (like internships, projects)
      else if (sectionConfig.isArray) {
        if (
          data[sectionKey] &&
          data[sectionKey].length > 0 &&
          data[sectionKey].some((item) =>
            Object.values(item).some(
              (val) => val && val.toString().trim() !== ""
            )
          )
        ) {
          completedWeight += sectionConfig.weight;
        } else {
          missingItems.push(
            `Add ${sectionKey.replace(/([A-Z])/g, " $1").toLowerCase()}`
          );
        }
      }
      // Handle regular fields
      else {
        const fieldsToCheck = sectionConfig.fields || [sectionKey];
        let fieldCount = 0;
        let completedCount = 0;

        fieldsToCheck.forEach((field) => {
          fieldCount++;
          if (isFieldCompleted(data[field])) {
            completedCount++;
          }
        });

        if (fieldCount > 0) {
          const completionRatio = completedCount / fieldCount;
          completedWeight += sectionConfig.weight * completionRatio;

          if (completionRatio < 1) {
            missingItems.push(
              `Add ${sectionKey.replace(/([A-Z])/g, " $1").toLowerCase()}`
            );
          }
        }
      }
    });

    const percentageCompleted = Math.round(
      (completedWeight / totalWeight) * 100
    );
    setProfileCompletion(percentageCompleted);
    setMissingDetails(missingItems.slice(0, 11));
  };

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

  const fetchMainData = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const uid = jwtDecode(token).user_id;
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/career-preferences/getByUserId/${uid}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setMainData(response.data);
    } catch (error) {
      console.error("Error fetching main data:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchMainData();
    }
  }, []);

  // Update career preferences
  const updateCareerPreferences = async (updatedPreferences) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const uid = jwtDecode(token).user_id;

    if (!token) {
      console.error("No token found");
      setIsLoading(false);
      return;
    } else {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/career-preferences/add/${uid}`,
        updatedPreferences,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    try {
      // API call commented out

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
      if (educationType === "classXII") {
        return {
          ...prevData,
          education: {
            ...prevData.education,
            class12: { ...prevData.education.class12, ...data },
          },
        };
      } else if (educationType === "classX") {
        return {
          ...prevData,
          education: {
            ...prevData.education,
            class10: { ...prevData.education.class10, ...data },
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

    console.log("Graduate data saved:", mainData.education.degrees);

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

  const handleDeleteInternship = (index, internshipId) => {
    const updatedInternships = [...mainData.internships];

    updatedInternships.splice(index, 1);

    // Update the state with the new array
    setMainData((prevData) => ({
      ...prevData,
      internships: updatedInternships,
    }));

    setShowInternshipsForm(false);
    setCurrentEditIndex(null);
  };

  const handleCancelInternship = () => {
    setCurrentEditIndex(null);
    setShowInternshipsForm(false);
  };

  // Determine profile strength level based on percentage
  const getProfileStrength = (percentage) => {
    if (percentage < 40) return "Basic";
    if (percentage < 70) return "Intermediate";
    return "Advanced";
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background-light dark:bg-background-dark bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-30">
        <div className="rounded-lg p-6 flex flex-col items-center gap-2">
          <Loader className="w-8 h-8 animate-spin text-primary dark:text-primary-dark" />
          <p className="text-text-secondary dark:text-text-dark_secondary">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

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
                      ↑ {Math.floor(5 + Math.random() * 5)}%
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-warning-500 hover:bg-warning-600 dark:bg-warning-dark dark:hover:bg-warning-600 text-white py-3 px-4 rounded-md font-medium">
                Add {missingDetails.length} missing details
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
                  educationType === "classXII"
                    ? "classXII"
                    : educationType === "classX"
                    ? "classX"
                    : educationType
                }
                onClose={handleCloseEducationPopup}
                onSave={handleSaveEducation}
                initialData={
                  educationType === "classXII"
                    ? mainData.education.class12
                    : educationType === "classX"
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
                onDelete={handleDeleteInternship}
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
