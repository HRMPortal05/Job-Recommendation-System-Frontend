import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Building,
  MapPin,
  Search,
  DollarSign,
  Bookmark,
  ExternalLink,
  X,
  Loader,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

// const jobs = [
//   {
//     jobId: "1",
//     title: "Data Analyst",
//     company: "Norstella",
//     location: "Remote",
//     description:
//       "Each organization (Citeline, Evaluate, MMIT, Panalgo, The Dedham Group) delivers must-have answers for critical strategic and commercial decision-making.",
//     tasks: ["Evaluate – bring the right drugs to market."],
//     category: "Full-time",
//     benefits: [
//       "Health insurance",
//       "Life insurance",
//       "Provident Fund",
//       "Work from home",
//     ],
//     aboutCompany:
//       "At Norstella, our mission is simple: to help our clients bring life-saving therapies to market quicker—and help patients in need.",
//     tags: "Data Analysis, Healthcare, Remote",
//   },
//   {
//     jobId: "2",
//     title: "Business Analyst Track & Trace",
//     company: "Sandoz",
//     location: "India",
//     description:
//       "Keeps abreast with internal Technology systems and documentation requirements, standards (including quality management and IT security), regulatory environments / requirements (if applicable),...",
//     category: "Full-time",
//     salary: "Not disclosed",
//     postedAt: "Posted recently",
//     tags: "Business Analysis, Technology, Quality Management",
//   },
// ];

// const jobs = [
//   {
//     userJobId: "8649cac8-cb46-405e-af58-d368b1ba0989",
//     title: "UI/UX Developer",
//     companyName: "TAN Corp",
//     description:
//       '\u003Cp\u003EWe are seeking an innovative \u003Cstrong\u003EUI/UX Designer\u003C/strong\u003E with a minimum of 3 years of experience and a portfolio demonstrating user-centric design expertise. This role offers the flexibility to work from anywhere while contributing to meaningful digital experiences in a collaborative environment.\u003C/p\u003E\u003Cp\u003E\u003Cstrong\u003EKey Responsibilities:\u003C/strong\u003E\u003C/p\u003E\u003Cul style=""\u003E \u003Cli style=""\u003EDesign intuitive and visually appealing user interfaces for web and mobile applications.\u003C/li\u003E \u003Cli style=""\u003EConduct user research and create wireframes, prototypes, and mockups.\u003C/li\u003E \u003Cli style=""\u003ECollaborate with cross-functional teams to ensure seamless user experiences.\u003C/li\u003E \u003Cli style=""\u003EStay updated with UI/UX trends, tools, and best practices.\u003C/li\u003E \u003Cli style=""\u003EIterate designs based on user feedback and performance data.\u003C/li\u003E \u003C/ul\u003E\u003Cp\u003E\u003Cstrong\u003ERequirements:\u003C/strong\u003E\u003C/p\u003E\u003Cul style=""\u003E \u003Cli style=""\u003EProficiency in design tools such as Figma, Adobe XD, or Sketch.\u003C/li\u003E \u003Cli style=""\u003EStrong understanding of user-centered design principles.\u003C/li\u003E \u003Cli style=""\u003EExperience creating responsive designs for various devices.\u003C/li\u003E \u003Cli style=""\u003EExcellent communication and collaboration skills.\u003C/li\u003E \u003Cli style=""\u003EA portfolio showcasing UI/UX design projects.\u003C/li\u003E \u003C/ul\u003E\u003Cp\u003E\u003Cstrong\u003EBenefits:\u003C/strong\u003E\u003C/p\u003E\u003Cul style=""\u003E \u003Cli style=""\u003E \u003Cstrong\u003EWork from Anywhere:\u003C/strong\u003E Design in your preferred workspace, wherever that may be.\u003C/li\u003E \u003Cli style=""\u003E \u003Cstrong\u003EProfessional Growth:\u003C/strong\u003E Opportunities to refine your skills and explore innovative design techniques.\u003C/li\u003E \u003Cli style=""\u003E \u003Cstrong\u003ECreative Collaboration:\u003C/strong\u003E Join a team that values your insights and fosters innovation.\u003C/li\u003E \u003C/ul\u003E\u003Cimg src="https://remotive.com/job/track/1961332/blank.gif?source=public_api" alt=""/\u003E',
//     contactEmail: "contact@tancorp.com",
//     tags: "Figma, Wordpress",
//     companyUrl: "https://www.tancorp.com",
//     updatedAt: "2025-02-18T00:15:43.737214",
//     city: "Ahmedabad",
//     state: "Gujarat",
//   },
// ];

const formatJobDescription = (description) => {
  // Replace escaped HTML entities
  let formattedDesc = description
    .replace(/\\u003C/g, "<")
    .replace(/\\u003E/g, ">")
    .replace(/\\"/g, '"');

  // First, handle section headers consistently - including those created with different methods
  formattedDesc = formattedDesc
    // Convert div with class h3 to headers
    .replace(
      /<div class="h3">([^<]+)<\/div>/g,
      '<h3 class="text-white font-bold text-xl mt-8 mb-4">$1</h3>'
    )
    // Make standalone section titles bold (like "Key Responsibilities:")
    .replace(
      /<p>([A-Za-z\s]+:)<\/p>/g,
      '<h3 class="text-white font-bold text-xl mt-8 mb-4">$1</h3>'
    )
    // Handle strong tags that are section headers
    .replace(
      /<p><strong>([A-Za-z\s]+:)<\/strong><\/p>/g,
      '<h3 class="font-bold mt-8 mb-4">$1</h3>'
    );

  // Ensure bullet points have dots and proper spacing
  formattedDesc = formattedDesc
    .replace(/<li style="">/g, '<li class="list-disc ml-5 mt-2 mb-2">')
    .replace(/<li>/g, '<li class="list-disc ml-5 mt-2 mb-2">');

  // Ensure proper list styling
  formattedDesc = formattedDesc
    .replace(/<ul style="">/g, '<ul class="my-4 space-y-2">')
    .replace(/<ul>/g, '<ul class="my-4 space-y-2">');

  // Add spacing between paragraphs
  formattedDesc = formattedDesc.replace(/<p>/g, '<p class="my-3">');

  return formattedDesc;
};

const JobDetailView = ({ job, isVisible, onClose }) => (
  <div
    className={`fixed md:relative inset-0 w-full md:inset-auto z-50 md:z-0 ${
      isVisible ? "block" : "hidden md:block"
    }`}
  >
    <div className="flex-1 h-full md:h-auto overflow-y-auto bg-white dark:bg-background-dark p-4 md:p-6 md:rounded-lg shadow-sm">
      <div className="md:hidden flex justify-end mb-4">
        <button onClick={onClose} className="p-2">
          <X className="w-6 h-6 text-text-primary dark:text-text-dark_primary" />
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-background-dark p-6 rounded-lg shadow-sm">
        <div className="max-w-3xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark_primary">
                {job.title}
              </h1>
              <div className="flex items-center mt-2">
                <span className="text-primary dark:text-primary-dark">
                  {job.companyName}
                </span>
                <span className="mx-2 text-text-tertiary dark:text-text-dark_tertiary">
                  •
                </span>
                <span className="flex items-center text-text-secondary dark:text-text-dark_secondary">
                  <MapPin className="w-4 h-4 mr-1" />
                  {`${job.city} ${job.state}`}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg border border-border-DEFAULT hover:bg-hover-DEFAULT dark:border-border-dark dark:hover:bg-hover-dark">
                <Bookmark className="w-5 h-5 text-text-primary dark:text-text-dark_primary" />
              </button>
              <button className="p-2 rounded-lg border border-border-DEFAULT hover:bg-hover-DEFAULT dark:border-border-dark dark:hover:bg-hover-dark">
                <ExternalLink className="w-5 h-5 text-text-primary dark:text-text-dark_primary" />
              </button>
            </div>
          </div>

          <button
            onClick={() => window.open(job.companyUrl, "_blank")}
            className="mt-6 bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark_hover text-white px-6 py-3 rounded-lg"
          >
            Apply now
          </button>

          <div className="mt-8 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-2 text-text-primary dark:text-text-dark_primary">
                Job details
              </h2>
              <div className="bg-surface-100 dark:bg-hover-dark p-4 rounded-lg">
                <span className="text-text-tertiary dark:text-text-dark_tertiary">
                  Job type
                </span>
                {job.jobType && (
                  <div className="font-medium mt-1 text-text-primary dark:text-text-dark_primary">
                    {job.jobType}
                  </div>
                )}
              </div>
            </section>

            {job.benefits && (
              <section>
                <h2 className="text-lg font-semibold mb-2 text-text-primary dark:text-text-dark_primary">
                  Benefits
                </h2>
                <div className="bg-surface-100 dark:bg-hover-dark p-4 rounded-lg">
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="text-text-tertiary dark:text-text-dark_tertiary"
                      >
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-lg font-semibold mb-2 text-text-primary dark:text-text-dark_primary">
                Full job description
              </h2>
              <div className="bg-surface-100 dark:bg-hover-dark p-4 rounded-lg">
                {job.aboutCompany && (
                  <>
                    <h3 className="font-medium mb-2 text-text-primary dark:text-text-dark_primary">
                      About {job.company}
                    </h3>
                    <p className="mb-4 text-text-tertiary dark:text-text-dark_tertiary">
                      {job.aboutCompany}
                    </p>
                  </>
                )}
                <div className="text-text-tertiary dark:text-text-dark_tertiary">
                  <div
                    className="prose max-w-none text-text-primary dark:text-text-dark_primary"
                    dangerouslySetInnerHTML={{
                      __html: formatJobDescription(job.description),
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const JobCard = ({ job, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`border rounded-lg cursor-pointer transition-all duration-100 ${
      isSelected
        ? "border-primary dark:border-primary-dark bg-primary-50 dark:bg-primary-900"
        : "border-border-DEFAULT dark:border-border-dark bg-white dark:bg-background-dark hover:bg-hover-DEFAULT dark:hover:bg-hover-dark"
    }`}
  >
    <div className="p-5">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-surface-100 dark:bg-hover-dark rounded-lg">
            <Building className="w-6 h-6 text-primary dark:text-primary-dark" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-text-primary dark:text-text-dark_primary">
              {job.title}
            </h3>
            <p className="text-text-secondary dark:text-text-dark_secondary flex items-center mt-1">
              {job.companyName} <span className="mx-2">•</span>
              <MapPin className="w-4 h-4 mr-1" /> {`${job.city} , ${job.state}`}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 text-text-tertiary dark:text-text-dark_tertiary line-clamp-2">
        <div
          className="prose max-w-none text-text-primary dark:text-text-dark_primary"
          dangerouslySetInnerHTML={{
            __html: formatJobDescription(job.description),
          }}
        />
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {job.tags?.split(",").map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-surface-100 dark:bg-hover-dark rounded-full text-sm text-text-tertiary dark:text-text-dark_tertiary"
          >
            {tag.trim()}
          </span>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border-DEFAULT dark:border-border-dark flex justify-between items-center">
        {job.category && (
          <span className="flex items-center text-text-tertiary dark:text-text-dark_tertiary">
            <Briefcase className="w-4 h-4 mr-1" /> {job.category}
          </span>
        )}

        <span className="flex items-center text-text-tertiary dark:text-text-dark_tertiary">
          <DollarSign className="w-4 h-4 mr-1" />{" "}
          {job.salary || "Not disclosed"}
        </span>
        {job.updatedAt ? (
          <span className="text-text-tertiary dark:text-text-dark_tertiary">
            {(() => {
              const now = new Date();
              const updatedDate = new Date(job.updatedAt);
              const diffTime = Math.abs(now - updatedDate);
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              const diffMonths = Math.floor(diffDays / 30);
              const diffYears = Math.floor(diffDays / 365);

              // Show relative time based on elapsed time
              if (diffDays < 2) {
                return "recently posted";
              } else if (diffDays < 30) {
                return `${diffDays} days ago`;
              } else if (diffMonths < 12) {
                return `${diffMonths} ${
                  diffMonths === 1 ? "month" : "months"
                } ago`;
              } else {
                return `${diffYears} ${diffYears === 1 ? "year" : "years"} ago`;
              }
            })()}
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  </div>
);

const JobList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const job = searchParams.get("job");
  const location = searchParams.get("location");

  // State for input fields
  const [jobInput, setJobInput] = useState(job || "");
  const [locationInput, setLocationInput] = useState(location || "");

  // State for suggestions
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Load city and job data when component mounts
  useEffect(() => {
    loadCityData();
    loadJobData();
  }, []);

  // Function to load job titles data
  const loadJobData = async () => {
    try {
      // In a real application, this would be an API call to your backend
      // Using the same sample data as in LandingPage
      const jobTitles = [
        // Technology
        { title: "Software Engineer", category: "Technology" },
        { title: "Frontend Developer", category: "Technology" },
        { title: "Backend Developer", category: "Technology" },
        { title: "Full Stack Developer", category: "Technology" },
        { title: "Mobile App Developer", category: "Technology" },
        { title: "DevOps Engineer", category: "Technology" },
        { title: "Data Engineer", category: "Technology" },
        { title: "QA Engineer", category: "Technology" },

        // Data Science
        { title: "Data Scientist", category: "Data Science" },
        { title: "Machine Learning Engineer", category: "Data Science" },
        { title: "Data Analyst", category: "Data Science" },

        // Design
        { title: "UX Designer", category: "Design" },
        { title: "UI/UX Designer", category: "Design" },
        { title: "Product Designer", category: "Design" },
        { title: "Graphic Designer", category: "Design" },

        // Marketing
        { title: "Marketing Manager", category: "Marketing" },
        { title: "Digital Marketing Specialist", category: "Marketing" },
        { title: "Content Strategist", category: "Marketing" },
        { title: "Social Media Manager", category: "Marketing" },

        // Sales
        { title: "Sales Representative", category: "Sales" },
        { title: "Account Executive", category: "Sales" },
        { title: "Sales Manager", category: "Sales" },

        // Finance
        { title: "Financial Analyst", category: "Finance" },
        { title: "Accountant", category: "Finance" },

        // HR
        { title: "HR Manager", category: "Human Resources" },
        { title: "Recruiter", category: "Human Resources" },
      ];

      // Add seniority levels
      const jobsWithSeniority = [];
      const seniorityLevels = ["Junior", "Senior", "Lead"];

      // For each job title, create variations with different seniority levels
      jobTitles.forEach((job) => {
        // Add the base job title
        jobsWithSeniority.push(job);

        // Add seniority variations
        if (!["CTO", "CEO", "CFO"].includes(job.title)) {
          seniorityLevels.forEach((level) => {
            jobsWithSeniority.push({
              title: `${level} ${job.title}`,
              category: job.category,
            });
          });
        }
      });

      setAllJobs(jobsWithSeniority);
    } catch (error) {
      console.error("Error loading job data:", error);
      setAllJobs([]);
    }
  };

  // Function to load city data
  const loadCityData = async () => {
    try {
      // Import the City and Country modules from country-state-city
      const { City, Country } = await import("country-state-city");

      // Get all countries
      const countries = Country.getAllCountries();

      // Create an array to store all cities with their country info
      let citiesData = [];

      // For each country, get its cities
      countries.forEach((country) => {
        const countryCities = City.getCitiesOfCountry(country.isoCode);
        if (countryCities && countryCities.length > 0) {
          // Map cities to include country name for display
          const formattedCities = countryCities.map((city) => ({
            name: city.name,
            displayName: `${city.name}, ${country.name}`,
            countryCode: country.isoCode,
          }));
          citiesData = [...citiesData, ...formattedCities];
        }
      });

      setAllCities(citiesData);
    } catch (error) {
      console.error("Error loading city data:", error);
      setAllCities([]);
    }
  };

  // Real-time job search suggestions
  useEffect(() => {
    if (jobInput.length > 1 && allJobs.length > 0) {
      const searchTerm = jobInput.toLowerCase();

      // Filter jobs based on input
      const filteredJobs = allJobs
        .filter((job) => job.title.toLowerCase().includes(searchTerm))
        // Sort by relevance (exact matches first)
        .sort((a, b) => {
          const aStartsWith = a.title.toLowerCase().startsWith(searchTerm);
          const bStartsWith = b.title.toLowerCase().startsWith(searchTerm);

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return 0;
        })
        // Limit to 10 results for performance
        .slice(0, 10);

      setJobSuggestions(filteredJobs);
    } else {
      setJobSuggestions([]);
      setShowJobSuggestions(false);
    }
  }, [jobInput, allJobs]);

  // Real-time location suggestions
  useEffect(() => {
    if (locationInput.length > 1 && allCities.length > 0) {
      const searchTerm = locationInput.toLowerCase();

      // Filter cities based on input
      const filteredCities = allCities
        .filter((city) => city.displayName.toLowerCase().includes(searchTerm))
        // Sort by relevance (city name matches first)
        .sort((a, b) => {
          const aNameMatch = a.name.toLowerCase().includes(searchTerm);
          const bNameMatch = b.name.toLowerCase().includes(searchTerm);

          if (aNameMatch && !bNameMatch) return -1;
          if (!aNameMatch && bNameMatch) return 1;
          return 0;
        })
        // Limit to 10 results for performance
        .slice(0, 10);

      setLocationSuggestions(filteredCities);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  }, [locationInput, allCities]);

  const selectJobSuggestion = (suggestion) => {
    setJobInput(suggestion.title);
    setShowJobSuggestions(false);
  };

  const selectLocationSuggestion = (suggestion) => {
    setLocationInput(suggestion.name);
    setShowLocationSuggestions(false);
  };

  const handleJobInputBlur = () => {
    // Delay hiding suggestions to allow click to register
    setTimeout(() => setShowJobSuggestions(false), 200);
  };

  const handleLocationInputBlur = () => {
    // Delay hiding suggestions to allow click to register
    setTimeout(() => setShowLocationSuggestions(false), 200);
  };

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setSelectedJob(null);
      setError(null);

      const params = new URLSearchParams();
      if (job) params.append("value1", job);
      if (location) params.append("value2", location);

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/userjobs/search-jobs?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const fetchedJobs = response.data;

      setJobs(fetchedJobs);

      // Set the first job as selected if jobs exist
      if (fetchedJobs.length > 0) {
        setSelectedJob(fetchedJobs[0]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchJobs();
    } else {
      navigate("/");
    }
  }, [job, location]);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    setShowDetail(true);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

    // Update the URL params which will trigger the useEffect
    const newParams = new URLSearchParams();
    if (jobInput) newParams.set("job", jobInput);
    if (locationInput) newParams.set("location", locationInput);

    setSearchParams(newParams);
  };

  const LoadingSpinner = () => (
    <div className="fixed top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-2">
        <Loader className="w-8 h-8 animate-spin text-primary dark:text-primary-dark" />
        <p className="text-text-secondary dark:text-text-dark_secondary">
          Loading jobs...
        </p>
      </div>
    </div>
  );

  const ErrorMessage = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-red-500 dark:text-red-400 mb-2">
          {error || "Something went wrong"}
        </p>
        <button
          onClick={fetchJobs}
          className="text-primary dark:text-primary-dark hover:underline"
        >
          Try again
        </button>
      </div>
    </div>
  );

  const NoJobsFound = () => (
    <div className="flex items-center justify-center h-64">
      <p className="text-text-secondary dark:text-text-dark_secondary">
        No jobs found matching your criteria
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background-DEFAULT dark:bg-background-darker">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm p-4 md:p-6 mb-6 mt-10">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-dark_primary mb-2">
              Find your next opportunity
            </h2>
            <p className="text-sm md:text-base text-text-secondary dark:text-text-dark_secondary">
              Search jobs that match your skills and experience
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 mb-6"
          >
            {/* Job search input with suggestions */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-hover-dark border-border-DEFAULT dark:border-border-dark text-text-primary dark:text-text-dark_primary placeholder-text-muted dark:placeholder-text-dark_muted focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent transition-all"
                value={jobInput}
                onChange={(e) => setJobInput(e.target.value)}
                onFocus={() =>
                  jobInput.length > 1 && setShowJobSuggestions(true)
                }
                onBlur={handleJobInputBlur}
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-dark_muted" />

              {/* Job Suggestions Dropdown */}
              {showJobSuggestions && jobSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-hover-dark border border-border-DEFAULT dark:border-border-dark rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {jobSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-text-primary dark:text-text-dark_primary"
                      onClick={() => selectJobSuggestion(suggestion)}
                    >
                      <div className="font-medium">{suggestion.title}</div>
                      <div className="text-xs text-text-secondary dark:text-text-dark_secondary">
                        {suggestion.category}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location input with suggestions */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Location"
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-white dark:bg-hover-dark border-border-DEFAULT dark:border-border-dark text-text-primary dark:text-text-dark_primary placeholder-text-muted dark:placeholder-text-dark_muted focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent transition-all"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onFocus={() =>
                  locationInput.length > 1 && setShowLocationSuggestions(true)
                }
                onBlur={handleLocationInputBlur}
              />
              <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-text-dark_muted" />

              {/* Location Suggestions Dropdown */}
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-hover-dark border border-border-DEFAULT dark:border-border-dark rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-text-primary dark:text-text-dark_primary"
                      onClick={() => selectLocationSuggestion(suggestion)}
                    >
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-xs text-text-secondary dark:text-text-dark_secondary">
                        {suggestion.displayName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark_hover text-white rounded-lg font-medium transition-colors"
            >
              Find jobs
            </button>
          </form>

          <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-border-DEFAULT dark:border-border-dark">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-4 md:mb-0">
              <div>
                <p className="text-text-secondary dark:text-text-dark_secondary text-sm">
                  Resume status
                </p>
                <p className="text-text-tertiary dark:text-text-dark_tertiary text-xs mt-1">
                  Add your resume to get better jobs opportunities
                </p>
              </div>
              <div>
                <p className="text-text-secondary dark:text-text-dark_secondary text-sm">
                  Job alerts
                </p>
                <p className="text-text-tertiary dark:text-text-dark_tertiary text-xs mt-1">
                  Get notified for similar jobs
                </p>
              </div>
            </div>
            <button className="text-primary dark:text-primary-dark hover:text-primary-hover dark:hover:text-primary-dark_hover text-sm font-medium">
              Upload/Update Resume →
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            {isLoading ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorMessage />
            ) : jobs.length === 0 ? (
              <NoJobsFound />
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.userJobId}
                    job={job}
                    isSelected={selectedJob?.userJobId === job.userJobId}
                    onClick={() => handleJobSelect(job)}
                  />
                ))}
              </div>
            )}
          </div>
          {selectedJob && (
            <JobDetailView
              job={selectedJob}
              isVisible={showDetail}
              onClose={() => setShowDetail(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
