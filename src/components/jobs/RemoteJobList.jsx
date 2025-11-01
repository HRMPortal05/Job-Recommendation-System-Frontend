import React, { useState, useEffect } from "react";
import {
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { use } from "react";

// In-memory cache for session storage
const sessionCache = {
  userProfile: null,
  jobsData: null,
  lastFetched: null,
  cacheExpiry: 10 * 60 * 1000, // 10 minutes
};

const RemoteJobList = () => {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usingCachedData, setUsingCachedData] = useState(false);

  // Check if cached data is still valid
  const isCacheValid = () => {
    if (!sessionCache.lastFetched) return false;
    return Date.now() - sessionCache.lastFetched < sessionCache.cacheExpiry;
  };

  // Load data from cache
  const loadFromCache = () => {
    if (sessionCache.userProfile && sessionCache.jobsData && isCacheValid()) {
      setUserProfile(sessionCache.userProfile);
      setJobsData(sessionCache.jobsData);
      setUsingCachedData(true);
      setLoading(false);
      return true;
    }
    return false;
  };

  // Save data to cache
  const saveToCache = (userData, jobs) => {
    sessionCache.userProfile = userData;
    sessionCache.jobsData = jobs;
    sessionCache.lastFetched = Date.now();
  };

  // Clear cache
  const clearCache = () => {
    sessionCache.userProfile = null;
    sessionCache.jobsData = null;
    sessionCache.lastFetched = null;
  };

  // Get user ID and token from your auth system
  const getUserData = () => {
    // Replace with your actual method to get user ID and token
    const token = localStorage.getItem("token");
    const uid = jwtDecode(token).user_id;
    return { uid, token };
  };

  // Fetch user career preferences
  const fetchUserProfile = async () => {
    try {
      const { uid, token } = getUserData();

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

      setUserProfile(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user profile");
      return null;
    }
  };

  // Fetch job recommendations from transformer API
  const fetchJobRecommendations = async (userData, isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      if (!userData) {
        throw new Error("Unable to transform user data");
      }

      const response = await axios.post(
        "https://recomtransformer.onrender.com/api/recommend",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response);

      if (response.data && response.data.recommendations) {
        setJobsData(response.data.recommendations);
        // Save to cache
        saveToCache(userData, response.data.recommendations);
        setUsingCachedData(false);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch job recommendations");
      console.error("Error fetching job recommendations:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    if (userProfile) {
      clearCache(); // Clear cache before refresh
      await fetchJobRecommendations(userProfile, true);
    }
  };

  // Initial load with cache check
  useEffect(() => {
    const loadData = async () => {
      // First, try to load from cache
      const cacheLoaded = loadFromCache();

      if (cacheLoaded) {
        // Cache loaded successfully, but still fetch fresh data in background
        console.log("Loading from cache...");

        // Fetch fresh data in background if user profile exists in cache
        if (sessionCache.userProfile) {
          try {
            const freshUserData = await fetchUserProfile();
            if (freshUserData) {
              await fetchJobRecommendations(freshUserData);
            }
          } catch (err) {
            console.log("Background refresh failed, using cached data");
          }
        }
      } else {
        // No valid cache, fetch fresh data
        console.log("No valid cache, fetching fresh data...");
        const userData = await fetchUserProfile();
        if (userData) {
          await fetchJobRecommendations(userData);
        }
      }
    };

    loadData();
  }, []);

  // Get unique categories from jobs data
  const categories = [
    "All",
    ...new Set(jobsData.map((job) => job.category).filter(Boolean)),
  ];

  // Filter jobs based on search term and category
  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || job.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Toggle job description expansion
  const toggleJobExpansion = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Improved HTML description parsing
  const parseDescription = (htmlDescription) => {
    if (!htmlDescription) return "";

    try {
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlDescription;

      // Remove tracking images and unwanted elements
      const unwantedElements = tempDiv.querySelectorAll(
        'img[src*="track"], img[src*="blank.gif"], script, style, .tracking'
      );
      unwantedElements.forEach((el) => el.remove());

      // Clean up empty paragraphs and line breaks
      const emptyPs = tempDiv.querySelectorAll("p:empty, br + br");
      emptyPs.forEach((el) => el.remove());

      // Ensure links open in new tab
      const links = tempDiv.querySelectorAll("a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });

      return tempDiv.innerHTML;
    } catch (error) {
      console.error("Error parsing HTML description:", error);
      return htmlDescription;
    }
  };

  // Get plain text from HTML for preview
  const getPlainTextPreview = (htmlDescription, maxLength = 200) => {
    if (!htmlDescription) return "";

    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlDescription;
      const text = tempDiv.textContent || tempDiv.innerText || "";

      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    } catch (error) {
      console.error("Error extracting text preview:", error);
      return htmlDescription.substring(0, maxLength) + "...";
    }
  };

  // Parse tags from array or string
  const parseTags = (tags) => {
    if (!tags) return [];

    if (Array.isArray(tags)) {
      return tags.flatMap((tagGroup) =>
        typeof tagGroup === "string"
          ? tagGroup
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : []
      );
    }

    if (typeof tags === "string") {
      return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    return [];
  };

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen">
      {/* Hero section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-surface dark:bg-surface-dark rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-dark_primary mb-2 mt-16">
                Find Your Perfect Remote Opportunity
              </h2>
              <p className="text-sm md:text-base text-text-secondary dark:text-text-dark_secondary mb-4">
                Discover roles that match your profile, skills, and experience
              </p>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="mt-16 flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              <RefreshCw
                size={16}
                className={isRefreshing ? "animate-spin" : ""}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Cache Status Indicator */}
          {usingCachedData && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center text-blue-700 dark:text-blue-300 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                <span>
                  Showing cached recommendations • Fresh data loading in
                  background
                </span>
              </div>
            </div>
          )}

          {/* Enhanced "Based on your profile details" text */}
          <div className="flex items-center mb-8">
            <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
            <p className="text-lg font-medium text-primary dark:text-primary-dark">
              AI-powered recommendations{" "}
              <span className="text-text-secondary dark:text-text-dark_secondary font-normal">
                {userProfile
                  ? `for ${userProfile.users.firstName}`
                  : "based on your profile"}
              </span>
            </p>
          </div>

          {/* Enhanced Search bar in hero */}
          <div className="bg-surface dark:bg-surface-dark rounded-xl p-5 shadow-lg border border-border dark:border-border-dark">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-primary" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs by title, company or keyword..."
                  className="w-full pl-10 pr-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark_primary focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-primary" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-3 border border-border-light dark:border-border-dark rounded-lg bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark_primary appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <ChevronDown size={18} className="text-text-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar with loading state */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-surface dark:bg-surface-dark p-5 rounded-lg shadow-sm mb-6 flex flex-wrap justify-between items-center border-l-4 border-primary">
          <div>
            {loading && !usingCachedData ? (
              <div className="flex items-center">
                <Loader2 size={20} className="animate-spin text-primary mr-2" />
                <p className="text-text-secondary dark:text-text-dark_secondary font-medium">
                  Getting your personalized recommendations...
                </p>
              </div>
            ) : error && !usingCachedData ? (
              <p className="text-red-600 dark:text-red-400 font-medium">
                Error: {error}
              </p>
            ) : (
              <>
                <p className="text-text-secondary dark:text-text-dark_secondary font-medium">
                  <span className="text-primary dark:text-primary-dark font-bold text-lg">
                    {filteredJobs.length}
                  </span>{" "}
                  personalized job recommendations found
                  {usingCachedData && (
                    <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                      Cached
                    </span>
                  )}
                </p>
                <p className="text-sm text-text-tertiary dark:text-text-dark_tertiary mt-1">
                  Matched based on your skills: {userProfile?.keySkills}
                </p>
                {sessionCache.lastFetched && (
                  <p className="text-xs text-text-tertiary dark:text-text-dark_tertiary mt-1">
                    Last updated:{" "}
                    {new Date(sessionCache.lastFetched).toLocaleTimeString()}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
              <span className="text-sm text-text-secondary dark:text-text-dark_secondary">
                AI Powered
              </span>
            </div>
            {isRefreshing && (
              <div className="flex items-center">
                <Loader2 size={16} className="animate-spin text-primary mr-2" />
                <span className="text-sm text-primary">Updating...</span>
              </div>
            )}
          </div>
        </div>

        {/* Job listing layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Job cards */}
          <div className="lg:col-span-2 space-y-4">
            {loading && !usingCachedData ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={32} className="animate-spin text-blue-600" />
              </div>
            ) : error && !usingCachedData ? (
              <div className="text-center py-12 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 mb-4">
                  Failed to load recommendations
                </p>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredJobs.length > 0 ? (
              <>
                {filteredJobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => toggleJobExpansion(job.job_id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
                            {job.company?.charAt(0) || "C"}
                          </span>
                        </div>

                        <div className="flex-grow">
                          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {job.title}
                          </h2>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                            <span>{job.company}</span>
                            {job.category && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{job.category}</span>
                              </>
                            )}
                          </div>

                          {/* Match Score Display */}
                          {job.match_score && (
                            <div className="mt-2 flex items-center">
                              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                                {Math.round(job.match_score * 100)}% Match
                              </span>
                              {job.rank && (
                                <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                                  Rank #{job.rank}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            {job.category && (
                              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                                {job.category}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                            {getPlainTextPreview(job.description, 120)}
                          </div>

                          {/* Match explanation */}
                          {job.explanation && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 italic">
                              {job.explanation}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="flex items-center text-gray-500 dark:text-gray-500 text-sm">
                            <Calendar size={14} className="mr-1" />
                            <span>
                              {formatDate(job.publication_date)
                                ? formatDate(job.publication_date)
                                : "N/A"}
                            </span>
                          </div>

                          <button className="mt-2 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                            <span className="mr-1 text-sm">
                              {expandedJobId === job.job_id
                                ? "Hide details"
                                : "See details"}
                            </span>
                            {expandedJobId === job.job_id ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {expandedJobId === job.job_id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-hidden"
                        >
                          <div className="px-5 py-4">
                            {/* Description with improved HTML formatting */}
                            <div className="mb-4">
                              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                                Job Description
                              </h3>
                              <div
                                className="text-gray-600 dark:text-gray-400 text-sm prose prose-sm dark:prose-invert max-w-none job-description"
                                dangerouslySetInnerHTML={{
                                  __html: parseDescription(job.description),
                                }}
                                style={{
                                  wordBreak: "break-word",
                                  lineHeight: "1.6",
                                }}
                              />
                            </div>

                            {/* Tags */}
                            {job.tags && (
                              <div className="mb-4">
                                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                                  <Tag size={14} className="mr-2" />
                                  Skills & Technologies
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {parseTags(job.tags).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Match Details */}
                            {job.match_criteria && (
                              <div className="mb-4">
                                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                                  Why This Job Matches You
                                </h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-3 h-3 rounded-full mr-2 ${
                                        job.match_criteria.experience_match
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                    ></div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Experience Match
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <div
                                      className={`w-3 h-3 rounded-full mr-2 ${
                                        job.match_criteria.location_match
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                    ></div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Location Match
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <div
                                      className={`w-3 h-3 rounded-full mr-2 ${
                                        job.match_criteria.job_type_match
                                          ? "bg-green-500"
                                          : "bg-red-500"
                                      }`}
                                    ></div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Job Type Match
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      {job.match_criteria.skill_match_percent}%
                                      Skills Match
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Apply button */}
                            <div className="flex justify-end">
                              <a
                                href={"#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                              >
                                Apply Now
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">
                  No job recommendations found. Try updating your profile or
                  skills.
                </p>
              </div>
            )}
          </div>

          {/* Right column - Fixed Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-surface dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-5 sticky top-20">
              <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-4">
                Your Profile Summary
              </h3>

              {userProfile && (
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Preferred Role
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userProfile.preferedJobType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Location
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userProfile.preferedLocation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Key Skills
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userProfile.keySkills}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Availability
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userProfile.availabilityToWork}
                    </p>
                  </div>
                </div>
              )}

              <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-4">
                Job Categories
              </h3>

              {/* Scrollable Categories Container */}
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                <ul className="space-y-1 pr-2">
                  {categories.map(
                    (category) =>
                      category !== "All" && (
                        <li key={category}>
                          <button
                            className={`w-full text-left px-3 py-2.5 rounded-md transition text-sm ${
                              selectedCategory === category
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                            }`}
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </button>
                        </li>
                      )
                  )}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-4">
                  Recommendation Tips
                </h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5">
                      <span className="text-xs">1</span>
                    </div>
                    <span>
                      Higher match scores indicate better alignment with your
                      profile
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5">
                      <span className="text-xs">2</span>
                    </div>
                    <span>
                      Keep your skills and preferences updated for better
                      matches
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5">
                      <span className="text-xs">3</span>
                    </div>
                    <span>
                      AI considers your education, experience, and preferences
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-surface dark:bg-surface-dark border-t border-border dark:border-border-dark mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-text-tertiary dark:text-text-dark_tertiary text-sm">
            <p>© 2025 AI Job Recommender. All rights reserved.</p>
            <p className="mt-2">
              Powered by advanced machine learning for personalized job
              matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteJobList;
