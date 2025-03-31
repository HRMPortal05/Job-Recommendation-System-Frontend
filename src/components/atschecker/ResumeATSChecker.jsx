import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Upload,
  Check,
  AlertCircle,
  Clock,
  Layout,
  BrainCircuit,
  FileText,
  Eye,
  Settings,
  Award,
  CheckCircle,
} from "lucide-react";

const ResumeATSChecker = () => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [currentThinkingStep, setCurrentThinkingStep] = useState(-1);
  const [score, setScore] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [suggestions, setSuggestions] = useState({});
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState({});
  const [analysisData, setAnalysisData] = useState(null);
  const [overallRecommendations, setOverallRecommendations] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [cloudinaryUrl, setCloudinaryUrl] = useState("");

  // Store the Cloudinary URL in a ref to access it across steps
  const cloudinaryUrlRef = useRef("");

  // Animation refs
  const scoreAnimationRef = useRef(null);

  const thinkingSteps = [
    "Uploading resume to secure storage...",
    "Scanning document structure...",
    "Analyzing resume format...",
    "Extracting key skills and experiences...",
    "Comparing with industry standards...",
    "Evaluating keyword optimization...",
    "Checking for action verbs and metrics...",
    "Assessing overall ATS compatibility...",
    "Generating personalized suggestions...",
    "Calculating final score...",
  ];

  // Improved score animation using requestAnimationFrame for smoother transitions
  useEffect(() => {
    if (score !== null && displayScore < score) {
      const startTime = performance.now();
      const duration = 3500; // 3.5 seconds animation
      const startValue = 0;
      const changeInValue = score - startValue;

      const animateScore = (currentTime) => {
        const elapsedTime = currentTime - startTime;

        if (elapsedTime < duration) {
          // Easing function for smooth deceleration
          const progress = 1 - Math.pow(1 - elapsedTime / duration, 3); // Cubic ease-out
          const newValue = Math.round(startValue + changeInValue * progress);
          setDisplayScore(newValue);
          scoreAnimationRef.current = requestAnimationFrame(animateScore);
        } else {
          // Ensure we end exactly at the target value
          setDisplayScore(score);
        }
      };

      scoreAnimationRef.current = requestAnimationFrame(animateScore);

      return () => {
        if (scoreAnimationRef.current) {
          cancelAnimationFrame(scoreAnimationRef.current);
        }
      };
    }
  }, [score]);

  // Process API response data into a format suitable for the UI
  useEffect(() => {
    if (analysisData) {
      // Set the overall score
      setScore(analysisData.ATS_Score);

      // Set overall recommendations
      setOverallRecommendations(analysisData.Overall_Recommendations || []);

      // Map API data to our UI format with complete categories from the backend response
      const mappedSuggestions = {
        format: {
          title: "Format & Structure",
          icon: Layout,
          score: analysisData.Formatting.Score,
          description: analysisData.Formatting.Description,
          suggestions: analysisData.Formatting.Recommendations,
        },
        keywords: {
          title: "Keyword Optimization",
          icon: BrainCircuit,
          score: analysisData.Keyword_Optimization.Score,
          description: analysisData.Keyword_Optimization.Description,
          suggestions: analysisData.Keyword_Optimization.Recommendations,
        },
        readability: {
          title: "Readability",
          icon: Eye,
          score: analysisData.Readability.Score,
          description: analysisData.Readability.Description,
          suggestions: analysisData.Readability.Recommendations,
        },
        ats_friendliness: {
          title: "ATS Friendliness",
          icon: CheckCircle,
          score: analysisData.ATS_Friendliness.Score,
          description: analysisData.ATS_Friendliness.Description,
          suggestions: analysisData.ATS_Friendliness.Recommendations,
        },
        content: {
          title: "Content Quality",
          icon: FileText,
          score: analysisData.Content_Quality.Score,
          description: analysisData.Content_Quality.Description,
          suggestions: analysisData.Content_Quality.Recommendations,
        },
        design: {
          title: "Design & Impact",
          icon: Award,
          score: analysisData.Design_and_Impact.Score,
          description: analysisData.Design_and_Impact.Description,
          suggestions: analysisData.Design_and_Impact.Recommendations,
        },
        best_practices: {
          title: "Best Practices",
          icon: Settings,
          score: analysisData.Best_Practices_Insights.Score,
          description: analysisData.Best_Practices_Insights.Description,
          suggestions: analysisData.Best_Practices_Insights.Recommendations,
        },
      };

      setSuggestions(mappedSuggestions);
    }
  }, [analysisData]);

  // Professional suggestion reveal animation
  useEffect(() => {
    if (analysisComplete && Object.keys(suggestions).length > 0) {
      const categories = Object.keys(suggestions);

      // Stagger the animation of each category
      categories.forEach((category, categoryIndex) => {
        setTimeout(() => {
          setShowSuggestions((prev) => ({
            ...prev,
            [category]: {},
          }));

          // Stagger the animation of each suggestion within the category
          suggestions[category].suggestions.forEach((_, suggestionIndex) => {
            setTimeout(() => {
              setShowSuggestions((prev) => ({
                ...prev,
                [category]: {
                  ...prev[category],
                  [suggestionIndex]: true,
                },
              }));
            }, 300 * suggestionIndex); // 300ms delay between each suggestion
          });
        }, 400 * categoryIndex); // 400ms delay between each category
      });
    }
  }, [analysisComplete, suggestions]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setFileError("Please upload a PDF file only.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // Upload file to Cloudinary
  const uploadToCloudinary = () => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject("No file selected");
        return;
      }

      try {
        // Get user ID from token
        const token = localStorage.getItem("token");
        if (!token) {
          reject("Authentication error. Please log in again.");
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded?.user_id;
        if (!userId) {
          reject("Authentication error. Please log in again.");
          return;
        }

        // Create a filename using the userId
        const fileName = `resume_${userId}_${Date.now()}`;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ATS_Score");
        formData.append("public_id", fileName);

        // Set up progress tracking with XHR
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/upload`,
          true
        );

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round(
              (event.loaded / event.total) * 100
            );
            setUploadProgress(percentComplete);
          }
        };

        xhr.onload = function () {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            // Store the URL in the ref for immediate access
            cloudinaryUrlRef.current = response.secure_url;
            // Also update the state for UI updates
            setCloudinaryUrl(response.secure_url);
            resolve(response.secure_url);
          } else {
            reject("Upload failed: " + xhr.statusText);
          }
        };

        xhr.onerror = function () {
          reject("Network error occurred during upload");
        };

        xhr.send(formData);
      } catch (err) {
        reject(err.message || "Failed to upload resume");
      }
    });
  };

  // Send URL to backend for processing
  const sendUrlToBackend = async (pdfUrl) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication error. Please log in again.");
      }

      const fileUrl = {
        firebasePdfUrl: pdfUrl,
      };

      // Make the request to your backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/resume/ats/check-general`,
        fileUrl,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error analyzing resume:", error);
      throw new Error("Failed to analyze resume. Please try again.");
    }
  };

  // Delete file from Cloudinary after processing
  const deleteFromCloudinary = async (url) => {
    try {
      // Extract public ID from the URL
      const urlParts = url.split("/");
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split(".")[0];

      // Use Basic Auth (Convert API_SECRET to Base64)
      const authHeader = `Basic ${btoa(
        `${import.meta.env.VITE_CLOUDINARY_API_KEY}:${
          import.meta.env.VITE_CLOUDINARY_API_SECRET
        }`
      )}`;

      // Cloudinary API Endpoint for Deletion
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/resources/image/upload/${publicId}`;

      // Send DELETE request to Cloudinary
      await axios.delete(cloudinaryUrl, {
        params: { public_id: publicId },
        headers: { Authorization: authHeader },
      });
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setFileError("Please select a file to upload.");
      return;
    }

    setIsAnalyzing(true);
    setCurrentThinkingStep(-1);
    setVisibleSteps([]);
    setDisplayScore(0);
    setShowSuggestions({});
    setUploadProgress(0);
    setIsUploading(true);

    // Reset the cloudinary URL ref
    cloudinaryUrlRef.current = "";

    let step = -1;

    const runNextStep = async () => {
      if (step < thinkingSteps.length - 1) {
        step++;
        setCurrentThinkingStep(step);

        // Update visible steps (always show current + 1 before and 1 after if available)
        updateVisibleSteps(step);

        // Generate random delay between 400ms and 1200ms
        const randomDelay = Math.floor(Math.random() * 800) + 400;

        // On the first step, upload to Cloudinary
        if (step === 0) {
          try {
            const uploadedUrl = await uploadToCloudinary();
            // Wait a bit to ensure state is updated
            setTimeout(runNextStep, randomDelay);
          } catch (error) {
            console.error("Upload error:", error);
            setFileError(error.toString());
            setIsAnalyzing(false);
            setIsUploading(false);
            return;
          }
        }
        // On the last step, process with backend
        else if (step === thinkingSteps.length - 1) {
          try {
            // Use the ref value instead of the state
            const url = cloudinaryUrlRef.current;

            if (!url) {
              throw new Error("Upload URL not available");
            }

            const data = await sendUrlToBackend(url);

            // Once we have the data, delete the file from Cloudinary
            await deleteFromCloudinary(url);

            if (data) {
              setAnalysisData(data);
              setTimeout(() => {
                setIsAnalyzing(false);
                setIsUploading(false);
                setAnalysisComplete(true);
              }, 800);
            } else {
              throw new Error("No data received from backend");
            }
          } catch (error) {
            console.error("Analysis error:", error);
            setFileError(error.toString());
            setIsAnalyzing(false);
            setIsUploading(false);

            // Still try to delete the file even if analysis failed
            if (cloudinaryUrlRef.current) {
              await deleteFromCloudinary(cloudinaryUrlRef.current);
            }
          }
        } else {
          setTimeout(runNextStep, randomDelay);
        }
      }
    };

    // Initial delay before starting
    setTimeout(runNextStep, 500);
  };

  // Function to update which steps should be visible
  const updateVisibleSteps = (currentStep) => {
    const visibleIndices = [];

    // Add current step
    visibleIndices.push(currentStep);

    // Add one step before (if available)
    if (currentStep > 0) {
      visibleIndices.push(currentStep - 1);
    }

    // Add one step after (if available)
    if (currentStep < thinkingSteps.length - 1) {
      visibleIndices.push(currentStep + 1);
    }

    setVisibleSteps(visibleIndices);
  };

  const resetForm = () => {
    setFile(null);
    setFileError("");
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setScore(null);
    setDisplayScore(0);
    setSuggestions({});
    setVisibleSteps([]);
    setShowSuggestions({});
    setAnalysisData(null);
    setOverallRecommendations([]);
    setUploadProgress(0);
    setCloudinaryUrl("");
    cloudinaryUrlRef.current = "";
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-success-600";
    if (score >= 75) return "text-primary-600";
    if (score >= 60) return "text-warning-500";
    return "text-red-600";
  };

  const getCategoryScoreColor = (score) => {
    if (score >= 90) return "bg-success-500";
    if (score >= 75) return "bg-primary-500";
    if (score >= 60) return "bg-warning-500";
    return "bg-red-500";
  };

  const getStepStyles = (index) => {
    // Only show steps that are in our visibleSteps array
    if (!visibleSteps.includes(index)) return "hidden";

    const isActive = index === currentThinkingStep;
    const isCompleted = index < currentThinkingStep;
    const distanceFromCurrent = index - currentThinkingStep;

    return `
      transition-all duration-500 ease-in-out
      transform
      ${
        distanceFromCurrent === 0
          ? "opacity-100 scale-100"
          : "opacity-50 scale-95"
      }
      ${
        distanceFromCurrent > 0
          ? "translate-y-8"
          : distanceFromCurrent < 0
          ? "-translate-y-8"
          : "translate-y-0"
      }
      ${
        isActive
          ? "bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500"
          : ""
      }
      ${isCompleted ? "text-text-tertiary dark:text-text-dark_tertiary" : ""}
    `;
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center text-text-primary dark:text-text-dark_primary mb-2">
          Resume ATS Score Checker
        </h1>
        <p className="text-text-secondary dark:text-text-dark_secondary text-center mb-8">
          Upload your resume to get an ATS compatibility score and personalized
          suggestions
        </p>

        {!analysisComplete && (
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-md p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary">
                  Upload your resume (PDF only)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-hover-light dark:hover:bg-hover-dark ${
                    fileError
                      ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                      : "border-border-medium dark:border-border-dark"
                  }`}
                  onClick={() =>
                    document.getElementById("resumeUpload").click()
                  }
                >
                  <input
                    type="file"
                    id="resumeUpload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center">
                    <Upload className="w-10 h-10 text-text-tertiary dark:text-text-dark_tertiary mb-3" />
                    {file ? (
                      <div className="text-primary-600 dark:text-primary-dark flex items-center space-x-2">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">{file.name}</span>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium text-text-secondary dark:text-text-dark_secondary">
                          Drag and drop your resume or click to browse
                        </p>
                        <p className="text-text-tertiary dark:text-text-dark_tertiary mt-1">
                          PDF format only, max 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {fileError && (
                  <div className="text-red-600 dark:text-red-400 text-sm flex items-center mt-2">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {fileError}
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-md font-medium text-white ${
                    file
                      ? "bg-primary-600 hover:bg-primary-700 dark:bg-primary-dark dark:hover:bg-primary-dark_hover"
                      : "bg-primary-400 cursor-not-allowed dark:bg-primary-700"
                  }`}
                  disabled={!file || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center">
                      <Clock className="animate-spin mr-2 h-5 w-5" />
                      Analyzing...
                    </span>
                  ) : (
                    "Check Resume ATS Score"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-surface-dark rounded-lg shadow-xl p-8 w-full max-w-xl mx-4">
              <h3 className="text-xl font-medium text-text-primary dark:text-text-dark_primary mb-6 text-center">
                {isUploading && currentThinkingStep === 0
                  ? "Uploading Resume"
                  : "AI Analysis in Progress"}
              </h3>

              {isUploading && currentThinkingStep === 0 && (
                <div className="mb-6">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-600 transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-text-tertiary dark:text-text-dark_tertiary text-center mt-2">
                    {uploadProgress}% Complete
                  </p>
                </div>
              )}

              <div className="space-y-3 overflow-hidden relative h-48">
                {thinkingSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 rounded-md absolute w-full ${getStepStyles(
                      index
                    )}`}
                    style={{
                      top: `${(index - currentThinkingStep) * 3.5 + 6}rem`,
                    }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        index < currentThinkingStep
                          ? "bg-success-500 dark:bg-success-dark text-white"
                          : index === currentThinkingStep
                          ? "bg-primary-500 dark:bg-primary-dark text-white animate-pulse"
                          : "bg-border-medium dark:bg-border-dark text-text-secondary dark:text-text-dark_secondary"
                      }`}
                    >
                      {index < currentThinkingStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={
                        index < currentThinkingStep
                          ? "text-text-tertiary dark:text-text-dark_tertiary"
                          : "text-text-primary dark:text-text-dark_primary font-medium"
                      }
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-border-light dark:border-border-dark text-center text-text-tertiary dark:text-text-dark_tertiary">
                <p className="animate-pulse">
                  Please wait while we analyze your resume
                </p>
              </div>
            </div>
          </div>
        )}

        {analysisComplete && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-surface-dark rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark_primary mb-6">
                Your Resume ATS Score
              </h2>
              <div className="relative w-48 h-48 mx-auto mb-6">
                <div className="w-full h-full rounded-full border-8 border-border-light dark:border-border-darker flex items-center justify-center">
                  <div
                    className={`text-5xl font-bold transition-colors duration-300 ${getScoreColor(
                      displayScore
                    )}`}
                  >
                    {displayScore}
                  </div>
                </div>
                <svg
                  className="absolute top-0 left-0 w-full h-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    className="text-surface-200 dark:text-surface-400/30"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    className={`transition-all duration-1000 ease-out ${
                      displayScore >= 90
                        ? "text-success-500"
                        : displayScore >= 75
                        ? "text-primary-500"
                        : displayScore >= 60
                        ? "text-warning-500"
                        : "text-red-500"
                    }`}
                    strokeWidth="10"
                    strokeDasharray={`${2.83 * displayScore} 283`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-lg text-text-secondary dark:text-text-dark_secondary">
                {displayScore >= 90
                  ? "Excellent! Your resume is highly optimized for ATS systems."
                  : displayScore >= 75
                  ? "Good job! Your resume is well-optimized but has room for improvement."
                  : displayScore >= 60
                  ? "Your resume needs some improvements to better perform with ATS systems."
                  : "Your resume requires significant improvements to pass through ATS systems."}
              </p>
              <button
                onClick={resetForm}
                className="mt-6 px-4 py-2 bg-surface-100 dark:bg-hover-dark text-text-secondary dark:text-text-dark_secondary rounded-md hover:bg-surface-200 dark:hover:bg-hover-darker transition-colors"
              >
                Upload Another Resume
              </button>
            </div>

            {/* Overall Recommendations */}
            {overallRecommendations.length > 0 && (
              <div className="bg-white dark:bg-surface-dark rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark_primary mb-6">
                  Key Improvements Needed
                </h2>
                <ul className="space-y-3">
                  {overallRecommendations.map((recommendation, index) => (
                    <li
                      key={index}
                      className="flex items-start text-text-secondary dark:text-text-dark_secondary"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white dark:bg-surface-dark rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-text-primary dark:text-text-dark_primary mb-6">
                Detailed Analysis & Suggestions
              </h2>
              <div className="space-y-8">
                {Object.entries(suggestions).map(([key, category]) => (
                  <div
                    key={key}
                    className="border-b border-border-light dark:border-border-dark pb-8 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mr-3">
                          <category.icon className="w-5 h-5 text-primary-600 dark:text-primary-dark" />
                        </div>
                        <h3 className="text-xl font-medium text-text-primary dark:text-text-dark_primary">
                          {category.title}
                        </h3>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full ${getCategoryScoreColor(
                            category.score
                          )} text-white flex items-center justify-center`}
                        >
                          <span className="font-bold">{category.score}</span>
                        </div>
                      </div>
                    </div>

                    {/* Category description */}
                    <p className="text-text-secondary dark:text-text-dark_secondary mb-4 pl-14">
                      {category.description}
                    </p>

                    <ul className="space-y-3 pl-14">
                      {category.suggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className={`text-text-secondary dark:text-text-dark_secondary flex items-start min-h-6 transition-all duration-500 ${
                            showSuggestions[key]?.[index]
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-4"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-surface-200 dark:bg-surface-400/30 text-text-primary dark:text-text-dark_primary flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeATSChecker;
