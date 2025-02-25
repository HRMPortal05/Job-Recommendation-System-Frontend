import React, { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AddJobForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    description: "",
    contactEmail: "",
    tags: "",
    companyUrl: "",
    city: "",
    state: "",
    jobType: "",
    salary: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationInputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const [sections, setSections] = useState([
    {
      heading: "",
      content: "",
      type: "paragraph", // 'paragraph' or 'list'
      listItems: [""],
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const role = decodedToken.roles;

      if (role !== "COMPANY") {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, []);

  // Load city data when component mounts
  useEffect(() => {
    loadCityData();

    // Add click outside listener to close suggestions
    const handleClickOutside = (event) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter cities based on input
  useEffect(() => {
    if (formData.city.length > 1 && allCities.length > 0) {
      const searchTerm = formData.city.toLowerCase();

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
  }, [formData.city, allCities]);

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
              stateName: state?.name || "",
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

  const handleCitySelect = (city) => {
    setFormData({
      ...formData,
      city: city.name,
      state: city.stateName,
    });
    setShowLocationSuggestions(false);
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        heading: "",
        content: "",
        type: "paragraph",
        listItems: [""],
      },
    ]);
  };

  const updateSection = (index, field, value) => {
    setSections((prev) => {
      const newSections = [...prev];
      newSections[index] = {
        ...newSections[index],
        [field]: value,
      };
      return newSections;
    });
  };

  const toggleSectionType = (index) => {
    setSections((prev) => {
      const newSections = [...prev];
      newSections[index] = {
        ...newSections[index],
        type: newSections[index].type === "paragraph" ? "list" : "paragraph",
        content: "",
        listItems: [""],
      };
      return newSections;
    });
  };

  const addListItem = (sectionIndex) => {
    setSections((prev) => {
      const newSections = [...prev];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        listItems: [...newSections[sectionIndex].listItems, ""],
      };
      return newSections;
    });
  };

  const updateListItem = (sectionIndex, itemIndex, value) => {
    setSections((prev) => {
      const newSections = [...prev];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        listItems: newSections[sectionIndex].listItems.map((item, i) =>
          i === itemIndex ? value : item
        ),
      };
      return newSections;
    });
  };

  const removeListItem = (sectionIndex, itemIndex) => {
    setSections((prev) => {
      const newSections = [...prev];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        listItems: newSections[sectionIndex].listItems.filter(
          (_, i) => i !== itemIndex
        ),
      };
      return newSections;
    });
  };

  const generateDescription = () => {
    let description = "";
    sections.forEach((section) => {
      if (section.heading) {
        description += `<p><strong>${section.heading}</strong></p>`;
      }
      if (section.type === "paragraph" && section.content) {
        description += `<p>${section.content}</p>`;
      } else if (section.type === "list" && section.listItems.length > 0) {
        description += "<ul>";
        section.listItems.forEach((item) => {
          if (item.trim()) {
            description += `<li>${item}</li>`;
          }
        });
        description += "</ul>";
      }
    });
    return description;
  };

  // Convert comma-separated string to array for display
  const tagsArray = formData.tags
    ? formData.tags.split(",").map((tag) => tag.trim())
    : [];

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      const currentTags = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [];

      if (!currentTags.includes(newTag)) {
        const updatedTags =
          currentTags.length > 0 ? `${formData.tags}, ${newTag}` : newTag;

        setFormData((prev) => ({
          ...prev,
          tags: updatedTags,
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== tagToRemove)
      .join(", ");

    setFormData((prev) => ({
      ...prev,
      tags: updatedTags,
    }));
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const removeSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    const requiredFields = [
      "title",
      "companyName",
      "description",
      "contactEmail",
      "tags",
      "city",
      "state",
      "jobType",
      "salary",
    ];
    const finalFormData = {
      ...formData,
      description: generateDescription(),
    };

    const missingFields = requiredFields.filter(
      (field) => !finalFormData[field]?.trim()
    );

    if (missingFields.length > 0) {
      enqueueSnackbar(`Missing fields: ${missingFields.join(", ")}`, {
        variant: "warning",
        autoHideDuration: 3000,
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/userjobs/new`,
        finalFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      enqueueSnackbar("Job Created successfully!", {
        variant: "success",
        autoHideDuration: 3000,
      });
    } catch (err) {
      enqueueSnackbar("Failed to create job", {
        variant: "error",
        autoHideDuration: 3000,
      });
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto bg-surface dark:bg-surface-dark rounded-lg shadow-md mt-16">
        <div className="p-6 border-b border-border-DEFAULT dark:border-border-dark">
          <h2 className="text-2xl font-semibold text-text-primary dark:text-text-dark_primary">
            Add New Job
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-3">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. React Developer"
                  className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                          bg-white dark:bg-surface-dark
                          text-text-primary dark:text-text-dark_primary
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          placeholder-text-muted dark:placeholder-text-dark_muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-3">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="e.g. Tech Corp"
                  className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                          bg-white dark:bg-surface-dark
                          text-text-primary dark:text-text-dark_primary
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          placeholder-text-muted dark:placeholder-text-dark_muted"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tagsArray.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-primary-100 dark:bg-primary-900 rounded-full px-3 py-1"
                  >
                    <span className="text-primary-800 dark:text-primary-100">
                      {tag}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="Type tag and press Enter"
                className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                    bg-white dark:bg-surface-dark
                    text-text-primary dark:text-text-dark_primary
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    placeholder-text-muted dark:placeholder-text-dark_muted"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary">
                  Job Description Sections
                </label>
                <button
                  type="button"
                  onClick={addSection}
                  className="px-4 py-2 text-sm bg-primary-50 dark:bg-primary-900 
                         text-primary-600 dark:text-primary-100 
                         rounded-md hover:bg-primary-100 dark:hover:bg-primary-800 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Add Section
                </button>
              </div>

              {sections.map((section, index) => (
                <div
                  key={index}
                  className="p-4 border border-border-DEFAULT dark:border-border-dark rounded-lg 
                          bg-surface-DEFAULT dark:bg-background-DEFAULT relative"
                >
                  <div className="flex justify-between items-center mb-4">
                    <button
                      type="button"
                      onClick={() => toggleSectionType(index)}
                      className="text-sm text-primary-600 dark:text-primary-400 
                             hover:text-primary-800 dark:hover:text-primary-200"
                    >
                      Switch to{" "}
                      {section.type === "paragraph" ? "List" : "Paragraph"}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="text-text-muted dark:text-text-dark_muted 
                             hover:text-text-primary dark:hover:text-text-dark_primary"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Section Heading (Optional)"
                    value={section.heading}
                    onChange={(e) =>
                      updateSection(index, "heading", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                            bg-white dark:bg-surface-dark
                            text-text-primary dark:text-text-dark_primary 
                            mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                            placeholder-text-muted dark:placeholder-text-dark_muted"
                  />

                  {section.type === "paragraph" ? (
                    <textarea
                      placeholder="Section Content"
                      value={section.content}
                      onChange={(e) =>
                        updateSection(index, "content", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                              bg-white dark:bg-surface-dark
                              text-text-primary dark:text-text-dark_primary 
                              min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                              placeholder-text-muted dark:placeholder-text-dark_muted"
                    />
                  ) : (
                    <div className="space-y-2">
                      {section.listItems.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center gap-2"
                        >
                          <span className="text-text-muted dark:text-text-dark_muted">
                            •
                          </span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateListItem(index, itemIndex, e.target.value)
                            }
                            placeholder="List item"
                            className="flex-1 px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                                   bg-white dark:bg-surface-dark
                                   text-text-primary dark:text-text-dark_primary 
                                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
                                   placeholder-text-muted dark:placeholder-text-dark_muted"
                          />
                          {section.listItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeListItem(index, itemIndex)}
                              className="text-text-muted dark:text-text-dark_muted 
                                     hover:text-text-primary dark:hover:text-text-dark_primary"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addListItem(index)}
                        className="flex items-center text-sm text-primary-600 dark:text-primary-400 
                               hover:text-primary-800 dark:hover:text-primary-200 mt-2"
                      >
                        <Plus size={14} className="mr-1" /> Add List Item
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-3">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                          bg-white dark:bg-surface-dark
                          text-text-primary dark:text-text-dark_primary
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-3">
                  Company URL
                </label>
                <input
                  type="url"
                  name="companyUrl"
                  value={formData.companyUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                          bg-white dark:bg-surface-dark
                          text-text-primary dark:text-text-dark_primary
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-3">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  onFocus={() =>
                    formData.city.length > 1 && setShowLocationSuggestions(true)
                  }
                  ref={locationInputRef}
                  className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                          bg-white dark:bg-surface-dark
                          text-text-primary dark:text-text-dark_primary
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Start typing for suggestions"
                />
                {showLocationSuggestions && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-10 w-full mt-1 bg-white dark:bg-surface-dark border border-border-DEFAULT dark:border-border-dark rounded-md shadow-lg max-h-60 overflow-auto"
                  >
                    {locationSuggestions.map((city, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 hover:bg-primary-50 dark:hover:bg-primary-900 cursor-pointer text-text-primary dark:text-text-dark_primary"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city.displayName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-3">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                          bg-white dark:bg-surface-dark
                          text-text-primary dark:text-text-dark_primary
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-3">
                  Job Type
                </label>
                <input
                  type="text"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  placeholder="e.g. Full-time, Internship"
                  className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                          bg-white dark:bg-surface-dark
                          text-text-primary dark:text-text-dark_primary
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          placeholder-text-muted dark:placeholder-text-dark_muted"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary dark:text-text-dark_secondary mb-3">
                  Salary
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border-DEFAULT dark:border-border-dark rounded-md 
                         bg-white dark:bg-surface-dark
                          text-text-primary dark:text-text-dark_primary
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 dark:bg-primary-500 
                     text-white dark:text-text-dark_primary 
                     py-2 px-4 rounded-md 
                     hover:bg-primary-700 dark:hover:bg-primary-600 
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
                     transition-colors"
            >
              Submit Job Posting
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJobForm;
