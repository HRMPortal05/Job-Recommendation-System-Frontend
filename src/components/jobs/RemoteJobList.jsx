import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RemoteJobList = () => {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 20;

  // Fetch jobs from API
  const fetchJobs = async (page = 0, size = 1000, append = false) => {
    try {
      if (page === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      // Replace with your actual backend URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(
        `${backendUrl}/api/jobs?page=${page}&size=${size}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newJobs = data.content || [];

      if (append) {
        setJobsData((prevJobs) => [...prevJobs, ...newJobs]);
      } else {
        setJobsData(newJobs);
      }

      setTotalElements(data.totalElements || 0);
      setCurrentPage(page);
      setHasMorePages(page < data.totalPages - 1);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs(0, pageSize);
  }, []);

  // Infinite scroll handler
  // Replace your current handleScroll function with this improved version:

  const handleScroll = useCallback(() => {
    // Calculate how close we are to the bottom of the page
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;

    // Trigger when user is within 1000px of the bottom
    const threshold = 200;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    // Only fetch if we're near bottom, not already loading, and have more pages
    if (isNearBottom && !loadingMore && hasMorePages && !loading) {
      fetchJobs(currentPage + 1, pageSize, true);
    }
  }, [currentPage, loadingMore, hasMorePages, loading]);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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

  // Parse tags from string
  const parseTags = (tagsString) => {
    if (!tagsString) return [];
    try {
      return tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    } catch (error) {
      console.error("Error parsing tags:", error);
      return [];
    }
  };

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen">
      {/* Hero section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-surface dark:bg-surface-dark rounded-lg p-6 shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-dark_primary mb-2 mt-16">
            Find Your Perfect Remote Opportunity
          </h2>
          <p className="text-sm md:text-base text-text-secondary dark:text-text-dark_secondary mb-4">
            Discover roles that match your profile, skills, and experience
          </p>

          {/* Enhanced "Based on your profile details" text */}
          <div className="flex items-center mb-8">
            <div className="w-1 h-6 bg-primary rounded-full mr-3"></div>
            <p className="text-lg font-medium text-primary dark:text-primary-dark">
              Personalized recommendations{" "}
              <span className="text-text-secondary dark:text-text-dark_secondary font-normal">
                based on your profile
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
            {loading ? (
              <div className="flex items-center">
                <Loader2 size={20} className="animate-spin text-primary mr-2" />
                <p className="text-text-secondary dark:text-text-dark_secondary font-medium">
                  Loading jobs...
                </p>
              </div>
            ) : error ? (
              <p className="text-red-600 dark:text-red-400 font-medium">
                Error loading jobs: {error}
              </p>
            ) : (
              <>
                <p className="text-text-secondary dark:text-text-dark_secondary font-medium">
                  <span className="text-primary dark:text-primary-dark font-bold text-lg">
                    {filteredJobs.length}
                  </span>{" "}
                  of <span className="font-bold">{totalElements}</span> jobs
                  found
                </p>
                <p className="text-sm text-text-tertiary dark:text-text-dark_tertiary mt-1">
                  {hasMorePages
                    ? "Scroll down to load more jobs"
                    : "All jobs loaded"}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
              <span className="text-sm text-text-secondary dark:text-text-dark_secondary">
                Updated today
              </span>
            </div>
          </div>
        </div>

        {/* Job listing layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Job cards */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-12 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 mb-4">
                  Failed to load jobs
                </p>
                <button
                  onClick={() => fetchJobs(0, pageSize)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : filteredJobs.length > 0 ? (
              <>
                {filteredJobs.map((job) => (
                  <div
                    key={job.jobId}
                    className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() => toggleJobExpansion(job.jobId)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-surface-100 dark:bg-surface-dark rounded-md flex items-center justify-center flex-shrink-0">
                          <span className="text-lg font-bold text-text-tertiary dark:text-text-dark_tertiary">
                            {job.company?.charAt(0) || "C"}
                          </span>
                        </div>

                        <div className="flex-grow">
                          <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark_primary">
                            {job.title}
                          </h2>
                          <div className="flex items-center text-text-secondary dark:text-text-dark_secondary text-sm mt-1">
                            <span>{job.company}</span>
                            {job.category && (
                              <>
                                <span className="mx-2">•</span>
                                <span>{job.category}</span>
                              </>
                            )}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {job.category && (
                              <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                                {job.category}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 text-text-secondary dark:text-text-dark_secondary text-sm">
                            {getPlainTextPreview(job.description, 120)}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="flex items-center text-text-tertiary dark:text-text-dark_tertiary text-sm">
                            <Calendar size={14} className="mr-1" />
                            <span>{formatDate(job.updatedAt)}</span>
                          </div>

                          <button className="mt-2 flex items-center text-primary dark:text-primary-dark hover:text-primary-hover dark:hover:text-primary-dark_hover">
                            <span className="mr-1 text-sm">
                              {expandedJobId === job.jobId
                                ? "Hide details"
                                : "See details"}
                            </span>
                            {expandedJobId === job.jobId ? (
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
                      {expandedJobId === job.jobId && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="border-t border-border dark:border-border-dark bg-surface-50 dark:bg-surface-dark/50 overflow-hidden"
                        >
                          <div className="px-5 py-4">
                            {/* Description with improved HTML formatting */}
                            <div className="mb-4">
                              <h3 className="text-md font-semibold text-text-primary dark:text-text-dark_primary mb-2">
                                Job Description
                              </h3>
                              <div
                                className="text-text-secondary dark:text-text-dark_secondary text-sm prose prose-sm dark:prose-invert max-w-none job-description"
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
                                <h3 className="text-md font-semibold text-text-primary dark:text-text-dark_primary mb-2 flex items-center">
                                  <Tag size={14} className="mr-2" />
                                  Skills & Technologies
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {parseTags(job.tags).map((tag, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300 text-xs font-medium rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Apply button */}
                            <div className="flex justify-end">
                              <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors duration-200 font-medium"
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

                {/* Loading more indicator */}
                {loadingMore && (
                  <div className="flex justify-center items-center py-8">
                    <Loader2
                      size={24}
                      className="animate-spin text-primary mr-2"
                    />
                    <span className="text-text-secondary dark:text-text-dark_secondary">
                      Loading more jobs...
                    </span>
                  </div>
                )}

                {/* End of results indicator */}
                {!hasMorePages && !loadingMore && filteredJobs.length > 0 && (
                  <div className="text-center py-8 border-t border-border dark:border-border-dark">
                    <p className="text-text-tertiary dark:text-text-dark_tertiary">
                      You've reached the end! No more jobs to load.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 border border-border dark:border-border-dark rounded-lg bg-surface dark:bg-surface-dark">
                <p className="text-text-secondary dark:text-text-dark_secondary">
                  No jobs found matching your criteria. Try adjusting your
                  search.
                </p>
              </div>
            )}
          </div>

          {/* Right column - Fixed Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-surface dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg p-5 sticky top-20">
              <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-4">
                Popular Job Categories
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
                  Job Search Tips
                </h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5">
                      <span className="text-xs">1</span>
                    </div>
                    <span>
                      Update your resume with relevant skills and experiences
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5">
                      <span className="text-xs">2</span>
                    </div>
                    <span>Use specific keywords from the job description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5">
                      <span className="text-xs">3</span>
                    </div>
                    <span>
                      Research companies before applying to tailor your
                      application
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
            <p>© 2025 Remote Job Board. All rights reserved.</p>
            <p className="mt-2">
              Find the best remote opportunities worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteJobList;
