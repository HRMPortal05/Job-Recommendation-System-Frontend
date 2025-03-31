import React, { useState, useEffect } from "react";

const LanguageForm = ({ initialLanguages, onSave, onCancel }) => {
  const [languages, setLanguages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Initialize languages from passed props on component mount
  useEffect(() => {
    if (initialLanguages) {
      const languagesArray = initialLanguages
        .split(",")
        .map((language) => language.trim())
        .filter((language) => language);
      setLanguages(languagesArray);
    }
  }, [initialLanguages]);

  const handleAddLanguage = () => {
    if (inputValue.trim() && !languages.includes(inputValue.trim())) {
      setLanguages([...languages, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveLanguage = (languageToRemove) => {
    setLanguages(languages.filter((language) => language !== languageToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLanguage();
    }
  };

  const handleSave = () => {
    // Convert languages array back to comma-separated string and pass to parent
    onSave(languages);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl p-10 bg-white rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Languages
          </h2>
          <p className="text-gray-600">
            Add languages you speak to highlight your communication skills.
          </p>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex flex-wrap gap-2 mb-4">
            {languages.map((language, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                <span>{language}</span>
                <button
                  onClick={() => handleRemoveLanguage(language)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  aria-label={`Remove ${language}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a language and press Enter"
              className="w-full p-3 border border-border-DEFAULT rounded-lg bg-surface-DEFAULT text-text-primary"
            />
            <button
              onClick={handleAddLanguage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-500"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-blue-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageForm;
