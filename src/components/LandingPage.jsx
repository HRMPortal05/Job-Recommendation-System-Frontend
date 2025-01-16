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
import job_hunt from "../images/job-hunt.svg";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    {
      icon: Building2,
      count: "4M+",
      label: "Companies",
      color: "text-blue-500",
    },
    {
      icon: Users,
      count: "16M+",
      label: "Job Seekers",
      color: "text-green-500",
    },
    {
      icon: Briefcase,
      count: "93K+",
      label: "Job Posts",
      color: "text-purple-500",
    },
    {
      icon: Award,
      count: "200+",
      label: "Countries",
      color: "text-orange-500",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Smart algorithms that understand your unique skills",
      color: "bg-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Personalized career path recommendations",
      color: "bg-blue-500",
    },
    {
      icon: Star,
      title: "Premium Jobs",
      description: "Exclusive opportunities from top companies",
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="flex flex-col mt-5">
      {/* Hero Section */}
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-7xl w-full">
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
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 inline-block">
                  🚀 #1 Job Platform
                </span>
              </div>
              <h1
                className={`text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                Find Your Dream Job With{" "}
                <span className="text-blue-600">AI-Powered</span>{" "}
                Recommendations
              </h1>
              <p
                className={`text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                Discover personalized job opportunities tailored to your skills,
                experience, and career goals using our advanced AI
                recommendation system.
              </p>

              {/* Search Section */}
              <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    <input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 pl-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                    <input
                      type="text"
                      placeholder="City, state, or remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 pl-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <button className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium transition-all duration-200">
                  Find Jobs
                </button>
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
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <div
                  className={`${feature.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-3 bg-gray-50 dark:bg-gray-700 p-4 sm:p-6 rounded-lg hover:shadow-md"
              >
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.count}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
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
