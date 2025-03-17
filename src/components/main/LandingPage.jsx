import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Building2,
  Users,
  Briefcase,
  Award,
  TrendingUp,
  Zap,
  Star,
} from "lucide-react";
import job_hunt from "../../images/job-hunt.svg";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { requestNotificationPermission } from "../fields_hooks/requestNotificationPermission";

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    // Load city data and job data when component mounts
    loadCityData();
    loadJobData();
  }, []);

  // Function to load job titles data
  const loadJobData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/jobtype`,
        {
          headers: {
            "content-Type": "application/json",
          },
        }
      );

      const jobTitles = response.data;

      // Add seniority levels to job titles
      const jobsWithSeniority = [];
      const seniorityLevels = [
        "Junior",
        "Senior",
        "Lead",
        "Principal",
        "Staff",
      ];

      // For each job title, create variations with different seniority levels
      jobTitles.forEach((job) => {
        // Add the base job title
        jobsWithSeniority.push(job);

        // Add seniority variations for most jobs (exclude C-level and some others)
        if (
          !["CTO", "CEO", "CFO", "Creative Director", "Physician"].includes(
            job.title
          )
        ) {
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

  // Function to load city data from the library
  const loadCityData = async () => {
    try {
      // Import the City, State, and Country modules from country-state-city
      const { City, State, Country } = await import("country-state-city");

      // Get all countries
      const countries = Country.getAllCountries();

      // Create an array to store all cities with their country and state info
      let citiesData = [];

      // For each country, get its cities
      countries.forEach((country) => {
        const countryCities = City.getCitiesOfCountry(country.isoCode);

        if (countryCities && countryCities.length > 0) {
          // Map cities to include country and state name for display
          const formattedCities = countryCities.map((city) => {
            const state = State.getStateByCodeAndCountry(
              city.stateCode,
              country.isoCode
            );
            return {
              name: city.name,
              displayName: `${city.name}, ${state?.name || "Unknown State"}, ${
                country.name
              }`,
              stateCode: city.stateCode,
              countryCode: country.isoCode,
            };
          });

          citiesData = [...citiesData, ...formattedCities];
        }
      });

      setAllCities(citiesData);
    } catch (error) {
      console.error("Error loading city data:", error);
      // Fallback to empty array if library fails to load
      setAllCities([]);
    }
  };

  // Real-time job search suggestions
  useEffect(() => {
    if (searchQuery.length > 1 && allJobs.length > 0) {
      const searchTerm = searchQuery.toLowerCase();

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
      setShowJobSuggestions(filteredJobs.length > 0);
    } else {
      setJobSuggestions([]);
      setShowJobSuggestions(false);
    }
  }, [searchQuery, allJobs]);

  // Real-time location suggestions using the library data
  useEffect(() => {
    if (location.length > 1 && allCities.length > 0) {
      const searchTerm = location.toLowerCase();

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
      setShowLocationSuggestions(filteredCities.length > 0);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  }, [location, allCities]);

  const selectJobSuggestion = (suggestion) => {
    setSearchQuery(suggestion.title);
    setShowJobSuggestions(false);
  };

  const selectLocationSuggestion = (suggestion) => {
    setLocation(suggestion.name);
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

  const stats = [
    {
      icon: Building2,
      count: "4M+",
      label: "Companies",
      color: "text-primary-500",
    },
    {
      icon: Users,
      count: "16M+",
      label: "Job Seekers",
      color: "text-success-500",
    },
    {
      icon: Briefcase,
      count: "93K+",
      label: "Job Posts",
      color: "text-accent-500",
    },
    {
      icon: Award,
      count: "200+",
      label: "Countries",
      color: "text-warning-500",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Smart algorithms that understand your unique skills",
      color: "bg-primary-500",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Personalized career path recommendations",
      color: "bg-primary-500",
    },
    {
      icon: Star,
      title: "Premium Jobs",
      description: "Exclusive opportunities from top companies",
      color: "bg-primary-500",
    },
  ];

  const findJob = () => {
    if (localStorage.getItem("token")) {
      navigate(`/joblist?job=${searchQuery}&location=${location}`);
    } else {
      enqueueSnackbar("Please login to find jobs", {
        variant: "warning",
        autoHideDuration: 3000,
      });
    }
  };

  useEffect(() => {
    requestNotificationPermission().then((token) => {
      if (token) {
        alert("Your FCM Token: " + token);
      }
    });
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-7xl w-full mt-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center py-10 md:py-20">
            {/* Left Side */}
            <div
              className={`md:col-span-7 pt-8 transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-5"
              }`}
            >
              <div className="inline-block">
                <span className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6 inline-block">
                  🚀 #1 Job Platform
                </span>
              </div>
              <h1
                className={`text-4xl sm:text-6xl font-bold text-text-primary dark:text-text-dark_primary mb-6 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                Find Your Dream Job With{" "}
                <span className="text-primary-600 dark:text-primary-dark">
                  AI-Powered
                </span>{" "}
                Recommendations
              </h1>
              <p
                className={`text-lg sm:text-xl text-text-secondary dark:text-text-dark_secondary mb-8 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                Discover personalized job opportunities tailored to your skills,
                experience, and career goals using our advanced AI
                recommendation system.
              </p>

              {/* Search Section */}
              <div className="space-y-4 bg-surface dark:bg-surface-dark p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Job Search Input with Suggestions */}
                  <div className="relative group">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-text-muted dark:text-text-dark_muted group-hover:text-primary-500 dark:group-hover:text-primary-dark transition-colors duration-200" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() =>
                        searchQuery.length > 1 && setShowJobSuggestions(true)
                      }
                      onBlur={handleJobInputBlur}
                      className="w-full px-4 pl-10 py-3 rounded-lg border border-border dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark_primary"
                    />
                    {/* Job Suggestions Dropdown */}
                    {showJobSuggestions && jobSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {jobSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer text-text-primary dark:text-text-dark_primary"
                            onClick={() => selectJobSuggestion(suggestion)}
                          >
                            <div className="font-medium">
                              {suggestion.title}
                            </div>
                            <div className="text-xs text-text-secondary dark:text-text-dark_secondary">
                              {suggestion.category}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Location Input with Suggestions */}
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-text-muted dark:text-text-dark_muted group-hover:text-primary-500 dark:group-hover:text-primary-dark transition-colors duration-200" />
                    <input
                      type="text"
                      placeholder="City, state, or remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onFocus={() =>
                        location.length > 1 && setShowLocationSuggestions(true)
                      }
                      onBlur={handleLocationInputBlur}
                      className="w-full px-4 pl-10 py-3 rounded-lg border border-border dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-dark bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark_primary"
                    />
                    {/* Location Suggestions Dropdown */}
                    {showLocationSuggestions &&
                      locationSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          {locationSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-primary-50 dark:hover:bg-primary-900/30 cursor-pointer text-text-primary dark:text-text-dark_primary"
                              onClick={() =>
                                selectLocationSuggestion(suggestion)
                              }
                            >
                              <div className="font-medium">
                                {suggestion.name}
                              </div>
                              <div className="text-xs text-text-secondary dark:text-text-dark_secondary">
                                {suggestion.displayName}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
                <button
                  onClick={() => findJob()}
                  className="w-full py-4 px-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-dark dark:hover:bg-primary-dark_hover text-text-dark_primary rounded-lg text-lg font-medium transition-all duration-200"
                >
                  Find Jobs
                </button>
              </div>

              {/* Popular Searches */}
              <div className="mt-8 text-text-secondary dark:text-text-dark_secondary">
                <p className="mb-2 font-medium">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "🌐 Remote Jobs",
                    "💻 Software Engineer",
                    "📈 Marketing",
                    "🎨 Design",
                    "💼 Sales",
                  ].map((tag, index) => (
                    <span
                      key={tag}
                      className={`px-4 py-2 bg-surface-100 dark:bg-surface-dark hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-full text-sm cursor-pointer transition-all duration-700 ease-in-out hover:scale-105`}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transitionDelay: `${index * 100}ms`,
                      }}
                      onClick={() =>
                        setSearchQuery(tag.split(" ").slice(1).join(" "))
                      }
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div
              className={`md:col-span-5 flex justify-center ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={job_hunt}
                alt="Job Search Illustration"
                className="hidden md:block lg:block w-full max-w-md md:max-w-lg object-contain"
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-surface dark:bg-surface-dark p-6 rounded-lg shadow-lg"
              >
                <div
                  className={`${feature.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-text-dark_primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-text-primary dark:text-text-dark_primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary dark:text-text-dark_secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-surface dark:bg-surface-dark py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-3 bg-surface-50 dark:bg-surface-dark p-4 sm:p-6 rounded-lg hover:shadow-md"
              >
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-text-primary dark:text-text-dark_primary">
                    {stat.count}
                  </div>
                  <div className="text-text-secondary dark:text-text-dark_secondary text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
