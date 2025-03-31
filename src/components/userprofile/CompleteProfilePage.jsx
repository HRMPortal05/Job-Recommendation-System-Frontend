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
import ProjectsSection from "./ProjectsSection";
import AddProjectsForm from "./popupforms/AddProjectsForm";
import ProfileCompletionCard from "./ProfileCompletionCard";
import LanguagesSection from "./LanguagesSection";
import ResumeSection from "./ResumeSection";
import ResumeUploadForm from "./popupforms/ResumeUploadForm";
import LanguageForm from "./popupforms/LanguageForm";

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
    resume: { weight: 5, fields: ["resumeUrl"] },
    education: {
      weight: 25, // Reduced from 30 to make room for resume
      nestedFields: {
        degrees: { isArray: true, weight: 15 },
        class12: {
          weight: 5, // Reduced from 7.5
          fields: ["board", "percentage", "passingYear"],
        },
        class10: {
          weight: 5, // Reduced from 7.5
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
    resumeUrl: "",
    users: {
      user_id: "",
      username: "",
      email: "",
      phone: "",
      address: "",
      resumeUrl: "",
    },
    internships: [],
    projects: [],
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
  const [showLanguagesForm, setShowLanguagesForm] = useState(false);
  const [showResumeUploadForm, setShowResumeUploadForm] = useState(false);

  const [educationType, setEducationType] = useState(null);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  const token = localStorage.getItem("token");
  const uid = jwtDecode(token).user_id;

  const fetchMainData = async () => {
    setIsLoading(true);

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
      console.log("Main data response:", response.data);
      calculateProfileCompletion(response.data);
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

    // Special check for resume URL
    if (data.users && data.users.resumeUrl) {
      const resumeUrl = data.users.resumeUrl;
      if (isFieldCompleted(resumeUrl)) {
        completedWeight += profileSections.resume.weight;
      } else {
        missingItems.push("Add resume");
      }
      totalWeight += profileSections.resume.weight;
    }

    // Process each section
    Object.entries(profileSections).forEach(([sectionKey, sectionConfig]) => {
      // Skip resume section as it's handled separately
      if (sectionKey === "resume") return;

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

  // Add this new function inside CompleteProfilePage component
  const handleAddMissingDetails = () => {
    // You can implement logic to focus on or scroll to the first missing section
    const firstMissing = missingDetails[0]?.toLowerCase() || "";
    let sectionId = null;

    if (
      firstMissing.includes("education") ||
      firstMissing.includes("degree") ||
      firstMissing.includes("class")
    ) {
      sectionId = "education-section";
    } else if (firstMissing.includes("career")) {
      sectionId = "career-preferences-section";
    } else if (firstMissing.includes("skills")) {
      sectionId = "skills-section";
    } else if (firstMissing.includes("internship")) {
      sectionId = "internships-section";
    } else if (firstMissing.includes("project")) {
      sectionId = "projects-section";
    } else if (firstMissing.includes("summary")) {
      sectionId = "profile-summary-section";
    } else if (firstMissing.includes("resume")) {
      sectionId = "resume-section"; // Changed from profile-sidebar
    }

    // Apply custom scrolling with offset if we found a section
    if (sectionId) {
      const element = document.getElementById(sectionId);
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
    }
  };

  const getSectionWeights = () => {
    return {
      careerPreferences: profileSections.careerPreferences.weight,
      education: profileSections.education.weight,
      keySkills: profileSections.keySkills.weight,
      internships: profileSections.internships.weight,
      projects: profileSections.projects.weight,
      profileSummary: profileSections.profileSummary.weight,
      resume: profileSections.resume.weight,
    };
  };

  // Update career preferences
  const updateCareerPreferences = async (updatedPreferences) => {
    setIsLoading(true);
    const uid = jwtDecode(token).user_id;

    if (!token) {
      console.error("No token found");
      setIsLoading(false);
      return;
    }

    try {
      const updatedData = {
        preferedJobType: updatedPreferences.preferedJobType,
        preferedLocation: updatedPreferences.preferedLocation,
        availabilityToWork: updatedPreferences.availabilityToWork,
        profileSummary: mainData.profileSummary,
        keySkills: mainData.keySkills,
        language: mainData.language,
        resumeUrl: mainData.resumeUrl,
      };

      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/career-preferences/update/${uid}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    setMainData(async (prevData) => {
      if (educationType === "classXII") {
        setIsLoading(true);

        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/class12/update/${
            mainData.education.class12.class12_id
          }`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchMainData();

        return {
          ...prevData,
          education: {
            ...prevData.education,
            class12: { ...prevData.education.class12, ...data },
          },
        };
      } else if (educationType === "classX") {
        setIsLoading(true);

        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/class10/update/${
            mainData.education.class10.class10_id
          }`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchMainData();

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
    const { cgpaSystem, degree_id, ...graduateData } = formData.graduate;

    setMainData(async (prevData) => {
      const degrees = [...prevData.education.degrees];

      if (editIndex !== null && editIndex !== undefined) {
        setIsLoading(true);
        // Update existing entry
        console.log(graduateData);
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/degree/update/${
            mainData.education.degrees[editIndex].degree_id
          }`,
          graduateData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchMainData();

        degrees[editIndex] = graduateData;
      } else {
        setIsLoading(true);

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/degree/add/${
            mainData.education.education_id
          }`,
          graduateData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchMainData();

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

  const handleSaveKeySkills = async (skills) => {
    const updatedData = {
      preferedJobType: mainData.preferedJobType,
      preferedLocation: mainData.preferedLocation,
      availabilityToWork: mainData.availabilityToWork,
      profileSummary: mainData.profileSummary,
      keySkills: skills.join(", "),
      language: mainData.language,
      resumeUrl: mainData.resumeUrl,
    };

    const response = await axios.put(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/career-preferences/update/${uid}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMainData((prevData) => ({
      ...prevData,
      keySkills: skills.join(", "),
    }));
    setShowKeySkillsForm(false);
  };

  // Handle edit languages
  const handleEditLanguages = () => {
    setShowLanguagesForm(!showLanguagesForm);
  };

  const handleSaveLanguages = async (languages) => {
    const updatedData = {
      preferedJobType: mainData.preferedJobType,
      preferedLocation: mainData.preferedLocation,
      availabilityToWork: mainData.availabilityToWork,
      profileSummary: mainData.profileSummary,
      keySkills: mainData.keySkills,
      language: languages.join(", "),
      resumeUrl: mainData.resumeUrl,
    };

    const response = await axios.put(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/career-preferences/update/${uid}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMainData((prevData) => ({
      ...prevData,
      language: languages.join(", "),
    }));
    setShowLanguagesForm(false);
  };

  // Handle edit profile summary
  const handleEditProfileSummary = () => {
    setShowProfileSummaryForm(!showProfileSummaryForm);
  };

  const handleSaveProfileSummary = async (summary) => {
    const updatedData = {
      preferedJobType: mainData.preferedJobType,
      preferedLocation: mainData.preferedLocation,
      availabilityToWork: mainData.availabilityToWork,
      profileSummary: summary,
      keySkills: mainData.keySkills,
      language: mainData.language,
      resumeUrl: mainData.resumeUrl,
    };

    const response = await axios.put(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/career-preferences/update/${uid}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMainData((prevData) => ({
      ...prevData,
      profileSummary: summary,
    }));

    handleEditProfileSummary();
  };

  const handleDeleteProfileSummary = async () => {
    const updatedData = {
      preferedJobType: mainData.preferedJobType,
      preferedLocation: mainData.preferedLocation,
      availabilityToWork: mainData.availabilityToWork,
      profileSummary: "",
      keySkills: mainData.keySkills,
      language: mainData.language,
      resumeUrl: mainData.resumeUrl,
    };

    const response = await axios.put(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/career-preferences/update/${uid}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
    setMainData(async (prevData) => {
      const updatedInternships = [...prevData.internships];

      if (editIndex !== null && editIndex !== undefined) {
        // Update existing internship
        setIsLoading(true);

        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/internships/update/${
            mainData.internships[editIndex].internship_id
          }`,
          internshipData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchMainData();

        updatedInternships[editIndex] = response.data;
      } else {
        // Add new internship
        setIsLoading(true);

        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/internships/add/${
            mainData.careerPreferences_id
          }`,
          internshipData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchMainData();

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

  // Separate functions for adding and editing projects
  // Project handling functions
  const handleAddProject = () => {
    setCurrentEditIndex(null);
    setShowProjectsForm(true);
  };

  const handleCancelProject = () => {
    setShowProjectsForm(false);
    setCurrentEditIndex(null);
  };

  const handleSaveProjects = (projectData) => {
    setMainData(async (prevData) => {
      const updatedProjects = [...prevData.projects];

      const { projects_id, ...projectsData } = projectData;

      if (currentEditIndex !== null) {
        setIsLoading(true);
        // Update existing project
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/project/update/${
            mainData.projects[currentEditIndex].projects_id
          }`,
          projectsData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchMainData();

        updatedProjects[currentEditIndex] = projectData;
      } else {
        setIsLoading(true);
        // Add new project with generated ID
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/project/add/${
            mainData.careerPreferences_id
          }`,
          projectData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchMainData();

        updatedProjects.push({
          ...projectData,
          projects_id: Date.now().toString(),
        });
      }

      return {
        ...prevData,
        projects: updatedProjects,
      };
    });

    setShowProjectsForm(false);
    setCurrentEditIndex(null);
  };

  const handleDeleteProject = (index) => {
    setMainData((prevData) => {
      const updatedProjects = [...prevData.projects];
      updatedProjects.splice(index, 1);

      return {
        ...prevData,
        projects: updatedProjects,
      };
    });

    setShowProjectsForm(false);
    setCurrentEditIndex(null);
  };

  const handleEditProject = (index) => {
    setCurrentEditIndex(index);
    setShowProjectsForm(true);
  };

  // Handle edit resume
  const handleEditResume = () => {
    setShowResumeUploadForm(!showResumeUploadForm);
  };

  const handleSaveResume = async (resumeUrl) => {
    // Update the mainData state with the new resume URL
    const updatedData = {
      preferedJobType: mainData.preferedJobType,
      preferedLocation: mainData.preferedLocation,
      // availabilityToWork: mainData.availabilityToWork,
      profileSummary: mainData.profileSummary,
      keySkills: mainData.keySkills,
      language: mainData.language,
      resumeUrl: resumeUrl,
    };

    const response = await axios.put(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/career-preferences/update/${uid}`,
      updatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMainData((prevData) => ({
      ...prevData,
      users: {
        ...prevData.users,
        resumeUrl: resumeUrl,
      },
    }));

    // Close the form
    setShowResumeUploadForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex bg-background-light justify-center dark:bg-background-dark fixed inset-0 items-center z-30">
        <div className="flex flex-col p-6 rounded-lg gap-2 items-center">
          <Loader className="h-8 text-primary w-8 animate-spin dark:text-primary-dark text-lg" />
          <p className="text-text-secondary dark:text-text-dark_secondary font-normal text-2xl">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <div className="p-6 max-w-6xl mx-auto pt-24">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Info - Now using the ProfileSidebar component */}
          <ProfileSidebar
            userData={mainData}
            profileCompletion={profileCompletion}
          />

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs Navigation */}
            <div className="border-b border-border-DEFAULT dark:border-border-dark mb-6">
              <div className="flex space-x-8">
                <button className="border-b-2 border-primary-500 text-primary-500 dark:border-primary-dark dark:text-primary-dark font-medium pb-2">
                  View & Edit
                </button>
                {/* <button className="text-text-tertiary dark:text-text-dark_tertiary pb-2">
                  Activity insights
                </button> */}
              </div>
            </div>
            {/* Profile Completion Card */}
            <ProfileCompletionCard
              profileCompletion={profileCompletion}
              missingDetails={missingDetails}
              handleAddMissingDetails={handleAddMissingDetails}
              sectionWeights={getSectionWeights()}
            />

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
                educationData={mainData.education || {}}
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

            {/* Languages Section */}
            <div id="languages-section">
              <LanguagesSection
                languages={mainData.language}
                onEdit={handleEditLanguages}
              />
            </div>

            {showLanguagesForm && (
              <LanguageForm
                onCancel={handleEditLanguages}
                onSave={handleSaveLanguages}
                initialLanguages={mainData.language}
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

            {/* Projects Section */}
            <div id="projects-section">
              <ProjectsSection
                projects={mainData.projects}
                onAdd={handleAddProject}
                onEdit={handleEditProject}
              />
            </div>

            {showProjectsForm && (
              <AddProjectsForm
                onCancel={handleCancelProject}
                onSave={handleSaveProjects}
                onDelete={handleDeleteProject}
                initialProjects={
                  currentEditIndex !== null
                    ? mainData.projects[currentEditIndex]
                    : null
                }
                editIndex={currentEditIndex}
              />
            )}

            <ResumeSection
              resumelink={mainData.resumeUrl}
              onEdit={handleEditResume}
            />

            {showResumeUploadForm && (
              <ResumeUploadForm
                onCancel={() => setShowResumeUploadForm(false)}
                onSave={handleSaveResume}
                initialResumeUrl={mainData.resumeUrl}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
