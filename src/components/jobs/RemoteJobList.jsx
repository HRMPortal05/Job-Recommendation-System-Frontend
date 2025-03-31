import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RemoteJobList = () => {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Sample data based on the provided job object structure
  const jobsData = [
    {
      id: 1963367,
      url: "https://remotive.com/remote-jobs/design/mid-to-senior-ux-ui-designer-1963367",
      title: "Mid to Senior UX/UI Designer",
      company_name: "Zemogajobs",
      company_logo: "https://remotive.com/job/1591692/logo",
      category: "Design",
      tags: [
        "UI/UX",
        "agile",
        "product strategy",
        "research",
        "responsive",
        "travel",
        "digital products",
      ],
      job_type: "full_time",
      publication_date: "2025-01-14T14:50:11",
      candidate_required_location: "Colombia",
      salary: "",
      description:
        "Zemoga is the groundbreaking and industry-leading design and technology firm that was the first to offer the world's leading brands the amazing talent from Colombia and has been doing so for over 18 years. Our teams are the top 5% of the workforce, and if you can make it here, you can make it anywhere. Zemoga might be the perfect place for you if you're driven by new ideas, international travel, and working directly with the leaders of some of the smartest companies in the world. We are looking for a Senior UX/UI Designer with a good understanding of the end-to-end product design process, well-developed design craft, and strong problem-solving skills.",
    },
    {
      id: 1963368,
      url: "https://remotive.com/remote-jobs/software-dev/senior-frontend-developer-1963368",
      title: "Senior Frontend Developer",
      company_name: "RemoteCo",
      company_logo: "https://remotive.com/job/1963368/logo",
      category: "Software Development",
      tags: ["React", "TypeScript", "Next.js", "UI", "Frontend"],
      job_type: "full_time",
      publication_date: "2025-02-20T10:30:00",
      candidate_required_location: "Worldwide",
      salary: "$90,000 - $120,000",
      description:
        "We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for developing and implementing user interface components using React.js concepts and workflows. You will work with the design team to ensure the technical feasibility of UI/UX designs and optimize application for maximum speed and scalability.",
    },
    {
      id: 1963369,
      url: "https://remotive.com/remote-jobs/marketing/digital-marketing-specialist-1963369",
      title: "Digital Marketing Specialist",
      company_name: "GlobalMarket",
      company_logo: "https://remotive.com/job/1963369/logo",
      category: "Marketing",
      tags: ["SEO", "Content Marketing", "Social Media", "Analytics", "PPC"],
      job_type: "full_time",
      publication_date: "2025-03-01T09:15:00",
      candidate_required_location: "Europe",
      salary: "€45,000 - €60,000",
      description:
        "We are seeking a Digital Marketing Specialist to develop and implement marketing strategies that increase brand awareness, generate leads, and drive website traffic. The ideal candidate will have experience in SEO, content marketing, social media management, and PPC campaigns.",
    },
    {
      id: 1963370,
      url: "https://remotive.com/remote-jobs/design/product-designer-1963370",
      title: "Product Designer",
      company_name: "DesignBox",
      company_logo: "https://remotive.com/job/1963370/logo",
      category: "Design",
      tags: [
        "UI/UX",
        "Figma",
        "Product Design",
        "Prototyping",
        "User Research",
      ],
      job_type: "contract",
      publication_date: "2025-02-25T11:45:00",
      candidate_required_location: "USA, Canada",
      salary: "$75 - $95 hourly",
      description:
        "We're looking for a Product Designer to help us create intuitive and engaging user experiences. You will work closely with product managers and engineers to design solutions that address user needs while meeting business goals. Strong portfolio showcasing end-to-end design process required.",
    },
  ];

  const categories = ["All", ...new Set(jobsData.map((job) => job.category))];

  // Filter jobs based on search term and category
  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Shutter segments - more segments for a more realistic shutter effect
  const shutterSegments = 1;

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen">
      {/* Hero section */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-background-dark rounded-lg p-6">
          <h2 className="text-xl md:text-2xl font-bold text-text-primary dark:text-text-dark_primary mb-2 mt-20">
            Find Your Perfect Remote Opportunity
          </h2>
          <p className="text-sm md:text-base text-text-secondary dark:text-text-dark_secondary mb-4">
            Discover roles that match your profile, skills, and experience
          </p>
          {/* Enhanced "Based on your profile details" text */}
          <div className="flex items-center mb-8">
            <div className="w-1 h-6 bg-primary dark:bg-primary-dark rounded-full mr-3"></div>
            <p className="text-lg font-medium text-primary dark:text-primary-dark">
              Personalized recommendations{" "}
              <span className="text-text-secondary dark:text-text-dark_secondary font-normal">
                based on your profile
              </span>
            </p>
          </div>

          {/* Enhanced Search bar in hero */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search
                    size={18}
                    className="text-primary dark:text-primary-dark"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs by title, company or keyword..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Filter
                    size={18}
                    className="text-primary dark:text-primary-dark"
                  />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 appearance-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
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
                  <ChevronDown
                    size={18}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Added profile-based suggestions */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Recommended based on your profile:
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-primary-700 dark:text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm transition-colors">
                  Frontend Development
                </button>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-primary-700 dark:text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm transition-colors">
                  React.js
                </button>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-primary-700 dark:text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm transition-colors">
                  Full Stack
                </button>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-primary-700 dark:text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm transition-colors">
                  Remote (Worldwide)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Stats bar */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm mb-6 flex flex-wrap justify-between items-center border-l-4 border-primary dark:border-primary-dark">
          <div>
            <p className="text-text-secondary dark:text-gray-300 font-medium">
              <span className="text-primary dark:text-primary-dark font-bold text-lg">
                {filteredJobs.length}
              </span>{" "}
              {filteredJobs.length === 1 ? "job" : "jobs"} found matching your
              profile
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Based on your education, skills, and past projects
            </p>
          </div>

          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Updated today
              </span>
            </div>
            <div className="hidden md:flex items-center">
              <Briefcase
                size={16}
                className="text-primary dark:text-primary-dark mr-2"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                85% match with your profile
              </span>
            </div>
          </div>
        </div>

        {/* Job listing layout - 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Job cards */}
          <div className="lg:col-span-2 space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-surface dark:bg-background-dark border border-border-DEFAULT dark:border-border-dark rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => toggleJobExpansion(job.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-hover-dark rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                        {job.company_logo ? (
                          <img
                            src={
                              job.company_logo ||
                              "https://via.placeholder.com/150"
                            }
                            alt={`${job.company_name} logo`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-lg font-bold text-gray-500">
                            {job.company_name.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div className="flex-grow">
                        <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark_primary">
                          {job.title}
                        </h2>
                        <div className="flex items-center text-text-secondary dark:text-text-dark_secondary text-sm mt-1">
                          <span>{job.company_name}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            {job.candidate_required_location || "Remote"}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-text-dark_tertiary text-xs font-medium rounded-full">
                            {job.category}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 dark:bg-hover-dark text-gray-700 dark:text-text-dark_secondary text-xs font-medium rounded-full capitalize">
                            {job.job_type.replace("_", " ")}
                          </span>
                        </div>

                        {job.salary && (
                          <div className="mt-3 text-success-700 dark:text-success-dark text-sm font-medium">
                            {job.salary}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center text-gray-500 dark:text-text-dark_tertiary text-sm">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(job.publication_date)}</span>
                        </div>

                        <button className="mt-2 flex items-center text-primary dark:text-primary-dark hover:text-primary-hover dark:hover:text-primary-dark_hover">
                          <span className="mr-1 text-sm">
                            {expandedJobId === job.id
                              ? "Hide details"
                              : "See details"}
                          </span>
                          {expandedJobId === job.id ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Metal shutter effect for expanded content */}
                  <AnimatePresence>
                    {expandedJobId === job.id && (
                      <div className="relative overflow-hidden">
                        {/* Shutter segments */}
                        {[...Array(shutterSegments)].map((_, index) => (
                          <motion.div
                            key={`shutter-${index}`}
                            initial={{
                              x: 0,
                              y: -10,
                              opacity: 0,
                              height: 0,
                            }}
                            animate={{
                              x: 0,
                              y: 0,
                              opacity: 1,
                              height: "auto",
                            }}
                            exit={{
                              x: 0,
                              y: -10,
                              opacity: 0,
                              height: 0,
                            }}
                            transition={{
                              duration: 0.4,
                              ease: "easeInOut",
                              delay: index * 0.05, // Staggered animation
                            }}
                            className="border-t border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                            style={{
                              boxShadow: "0 2px 3px rgba(0,0,0,0.1)",
                              transformOrigin: "top",
                              height:
                                index === shutterSegments - 1 ? "auto" : "8px",
                            }}
                          >
                            {/* Shutter segment content - only visible in the last segment */}
                            {index === shutterSegments - 1 && (
                              <div className="px-5 py-4">
                                {/* Description */}
                                <div className="mb-4">
                                  <h3 className="text-md font-semibold text-text-primary dark:text-text-dark_primary mb-2">
                                    Job Description
                                  </h3>
                                  <p className="text-text-secondary dark:text-text-dark_secondary text-sm">
                                    {job.description}
                                  </p>
                                </div>
                                {/* Tags */}
                                {job.tags && job.tags.length > 0 && (
                                  <div className="mb-4">
                                    <h3 className="text-md font-semibold text-text-primary dark:text-text-dark_primary mb-2 flex items-center">
                                      <Tag size={14} className="mr-2" />
                                      Skills & Technologies
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {job.tags.map((tag, index) => (
                                        <span
                                          key={index}
                                          className="px-3 py-1 bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-dark text-xs font-medium rounded-full"
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
                                    className="px-5 py-2 bg-primary hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark_hover text-white rounded-lg transition-colors duration-200 font-medium"
                                  >
                                    Apply Now
                                  </a>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border border-gray-200 rounded-lg bg-white dark:bg-surface-dark">
                <p className="text-text-secondary dark:text-text-dark_secondary">
                  No jobs found matching your criteria. Try adjusting your
                  search.
                </p>
              </div>
            )}
          </div>

          {/* Right column - Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white dark:bg-background-dark border border-border-DEFAULT dark:border-border-dark rounded-lg p-5 sticky top-4">
              <h3 className="text-surface-dark dark:text-white font-semibold text-lg mb-4">
                Popular Job Categories
              </h3>
              <ul className="space-y-2">
                {categories.map(
                  (category) =>
                    category !== "All" && (
                      <li key={category}>
                        <button
                          className={`w-full text-left px-3 py-2 rounded-md transition ${
                            selectedCategory === category
                              ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-dark"
                              : "hover:bg-gray-100 dark:hover:bg-hover-dark text-gray-700 dark:text-gray-300"
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </button>
                      </li>
                    )
                )}
              </ul>

              <div className="mt-8 pt-6 border-t border-border-DEFAULT dark:border-border-dark border-gray-200">
                <h3 className="text-surface-dark dark:text-white font-semibold text-lg mb-4">
                  Job Search Tips
                </h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-dark flex-shrink-0 mt-0.5">
                      <span className="text-xs">1</span>
                    </div>
                    <span>
                      Update your resume with relevant skills and experiences
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-dark flex-shrink-0 mt-0.5">
                      <span className="text-xs">2</span>
                    </div>
                    <span>Use specific keywords from the job description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-700 dark:text-primary-dark flex-shrink-0 mt-0.5">
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
      <div className="bg-white dark:bg-surface-dark border-t border-border-DEFAULT dark:border-border-dark mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
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
