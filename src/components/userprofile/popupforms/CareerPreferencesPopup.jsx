import { useEffect, useState, useRef } from "react";

const CareerPreferencesPopup = ({
  initialPreferences,
  onClose,
  onSave,
  isLoading,
}) => {
  const initialLocations = initialPreferences.preferedLocation
    ? initialPreferences.preferedLocation.split(",").map((loc) => loc.trim())
    : [];

  const [selectedPreferences, setSelectedPreferences] = useState({
    preferedJobType: initialPreferences.preferedJobType
      ? initialPreferences.preferedJobType.split(",").map((job) => job.trim()) // Store as an array
      : [],
    preferedLocation: initialPreferences.preferedLocation || "",
    availabilityToWork: initialPreferences.availabilityToWork || "",
    locations: initialLocations,
    availability: initialPreferences.availabilityToWork || "",
  });

  const [allCities, setAllCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load cities data
  useEffect(() => {
    loadCityData();
  }, []);

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

  // Filter cities based on search term
  const filteredCities = allCities
    .filter((city) =>
      city.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10); // Limit results to avoid performance issues

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle body overflow
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleLookingForToggle = (option) => {
    setSelectedPreferences((prev) => {
      const newLookingFor = prev.preferedJobType.includes(option)
        ? prev.preferedJobType.filter((item) => item !== option)
        : [...prev.preferedJobType, option];

      return {
        ...prev,
        preferedJobType: newLookingFor,
      };
    });
  };

  const handleAvailabilitySelect = (option) => {
    setSelectedPreferences((prev) => ({
      ...prev,
      availability: option,
      availabilityToWork: option,
    }));
  };

  const handleCitySearch = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleCitySelect = (city) => {
    handleAddLocation(city.name);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleRemoveLocation = (location) => {
    setSelectedPreferences((prev) => {
      const newLocations = prev.locations.filter((loc) => loc !== location);
      return {
        ...prev,
        locations: newLocations,
        preferedLocation: newLocations.join(", "),
      };
    });
  };

  const handleAddLocation = (location) => {
    if (
      !selectedPreferences.locations.includes(location) &&
      location.trim() !== ""
    ) {
      setSelectedPreferences((prev) => {
        const newLocations = [...prev.locations, location];
        return {
          ...prev,
          locations: newLocations,
          preferedLocation: newLocations.join(", "),
        };
      });
    }
  };

  // handleSave function to check for empty fields
  const handleSave = () => {
    // Check if required fields are empty
    const hasEmptyFields =
      selectedPreferences.preferedJobType.length === 0 ||
      selectedPreferences.locations.length === 0 ||
      !selectedPreferences.availability;

    if (hasEmptyFields) {
      return;
    }

    const updatedPreferences = {
      preferedJobType: selectedPreferences.preferedJobType.join(", "),
      preferedLocation: selectedPreferences.preferedLocation,
      availabilityToWork: selectedPreferences.availabilityToWork,
    };

    onSave(updatedPreferences);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg w-full max-w-lg p-10 my-4 md:my-0 lg:my-0 md:mx-4 lg:mx-4">
        <button
          className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary cursor-pointer"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-text-primary">
          Career Preferences
        </h2>
        <p className="text-text-secondary mt-1 mb-6">
          Tell us your preferences for your next job & we will send you the most
          relevant recommendations.
        </p>

        {/* Looking for (Job Type) */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Looking for
          </h3>
          <div
            className={`flex gap-3 ${
              selectedPreferences.preferedJobType.length === 0
                ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500 p-2 rounded-lg"
                : ""
            }`}
          >
            {["Internships", "Full-Time"].map((option) => (
              <button
                key={option}
                onClick={() => handleLookingForToggle(option)}
                className={`px-4 py-2 rounded-full border ${
                  selectedPreferences.preferedJobType.includes(option)
                    ? "bg-primary-100 border-primary text-primary"
                    : "border-border-medium text-text-secondary"
                }`}
              >
                {option}
                {selectedPreferences.preferedJobType.includes(option) && (
                  <span className="ml-2">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Availability to work
          </h3>
          <div
            className={`flex flex-wrap gap-3 ${
              !selectedPreferences.availability
                ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500 p-2 rounded-lg"
                : ""
            }`}
          >
            {[
              "15 Days or less",
              "1 Month",
              "2 Months",
              "3 Months",
              "More than 3 Months",
            ].map((option) => (
              <button
                key={option}
                onClick={() => handleAvailabilitySelect(option)}
                className={`px-4 py-2 rounded-full border ${
                  selectedPreferences.availability === option
                    ? "bg-primary-100 border-primary text-primary"
                    : "border-border-medium text-text-secondary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Locations */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Preferred work location(s)
          </h3>
          <div
            className={`border border-border-medium rounded-lg p-2 mb-3 ${
              selectedPreferences.locations.length === 0
                ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500"
                : ""
            }`}
          >
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedPreferences.locations.map((location) => (
                <span
                  key={location}
                  className="bg-surface-100 rounded-full px-3 py-1 flex items-center"
                >
                  {location}
                  <button
                    onClick={() => handleRemoveLocation(location)}
                    className="ml-2 text-text-tertiary hover:text-text-primary"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Searchable city dropdown */}
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                placeholder="Search and select cities"
                value={searchTerm}
                onChange={handleCitySearch}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full py-2 px-3 text-text-secondary bg-transparent outline-none"
              />

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-border-medium rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <div
                        key={`${city.name}-${city.countryCode}-${city.stateCode}`}
                        className="px-4 py-2 hover:bg-surface-100 cursor-pointer"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city.displayName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-text-tertiary">
                      {searchTerm.trim() !== ""
                        ? "No cities found"
                        : "Type to search cities"}
                    </div>
                  )}
                </div>
              )}

              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Quick select options */}
          <div className="flex flex-wrap gap-3">
            {["Rajkot", "Bangalore/Bengaluru", "New Delhi", "Mumbai"].map(
              (city) => (
                <button
                  key={city}
                  onClick={() => handleAddLocation(city)}
                  className="border border-border-medium rounded-full px-4 py-2 text-text-secondary flex items-center"
                >
                  {city}
                  <span className="ml-1">+</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <button className="text-primary font-medium" onClick={onClose}>
            I'll add this later
          </button>
          <button
            className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-2 rounded-full"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerPreferencesPopup;
