import React, { useState, useEffect } from "react";

const KeySkillsForm = ({ initialSkills, onSave, onCancel }) => {
  // Parse the initial comma-separated string into an array
  const [skills, setSkills] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Initialize skills from passed props on component mount
  useEffect(() => {
    if (initialSkills) {
      const skillsArray = initialSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);
      setSkills(skillsArray);
    }
  }, [initialSkills]);

  const handleAddSkill = () => {
    if (inputValue.trim() && !skills.includes(inputValue.trim())) {
      setSkills([...skills, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSave = () => {
    // Convert skills array back to comma-separated string and pass to parent
    onSave(skills);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl p-10 bg-white rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Key skills
          </h2>
          <p className="text-gray-600">
            Recruiters look for candidates with specific key skills. Add them
            here to appear in searches.
          </p>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  aria-label={`Remove ${skill}`}
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
              placeholder="Press Enter after writing your key skills"
              className="w-full p-3 border border-border-DEFAULT rounded-lg bg-surface-DEFAULT text-text-primary"
            />
            <button
              onClick={handleAddSkill}
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

export default KeySkillsForm;
