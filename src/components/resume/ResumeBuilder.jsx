import { useState } from "react";
import {
  Plus,
  Download,
  Eye,
  Edit3,
  Trash2,
  GripVertical,
  FileText,
  Palette,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { sampleResumeData } from "./resumeData";

// Template Components
const ModernTemplate = ({ resumeData }) => (
  <div className="space-y-4">
    <div className="border-b-2 border-primary pb-4 mb-6">
      <h1 className="text-2xl font-bold text-text-primary mb-2">
        {resumeData.personalInfo.name || "Your Name"}
      </h1>
      <div className="text-text-secondary text-xs flex justify-between">
        {resumeData.personalInfo.location && (
          <div>📍 {resumeData.personalInfo.location}</div>
        )}
        {resumeData.personalInfo.email && (
          <div>✉️ {resumeData.personalInfo.email}</div>
        )}
        {resumeData.personalInfo.phone && (
          <div>📞 {resumeData.personalInfo.phone}</div>
        )}
        {resumeData.personalInfo.github && (
          <div>
            🔗{" "}
            <a
              href={`https://${resumeData.personalInfo.github.replace(
                /^https?:\/\//,
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </div>
        )}

        {resumeData.personalInfo.linkedin && (
          <div>
            💼{" "}
            <a
              href={`https://${resumeData.personalInfo.linkedin.replace(
                /^https?:\/\//,
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Linkedin
            </a>
          </div>
        )}
      </div>
    </div>
    {resumeData.sections.map((section) => (
      <div key={section.id} className="mb-5">
        <h2 className="text-lg font-bold text-primary mb-3 uppercase tracking-wide">
          {section.title}
        </h2>
        <div className="space-y-3">
          {section.items.map((item, itemIndex) => (
            <div key={itemIndex} className="space-y-1">
              {item.headings.map((heading, headingIndex) => (
                <div
                  key={headingIndex}
                  className={
                    headingIndex === 0
                      ? "font-semibold text-text-primary text-sm"
                      : "text-text-secondary italic text-sm"
                  }
                >
                  {heading.value}
                </div>
              ))}
              <div className="space-y-1">
                {item.textLines.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="text-text-secondary ml-2 text-sm leading-5"
                  >
                    • {line.value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const ClassicTemplate = ({ resumeData }) => (
  <div className="space-y-4">
    <div className="text-center border-b border-border pb-4 mb-6">
      <h1 className="text-xl font-bold text-text-primary mb-3 font-serif">
        {resumeData.personalInfo.name || "Your Name"}
      </h1>
      <div className="text-text-secondary text-xs flex justify-between">
        {resumeData.personalInfo.location && (
          <div>{resumeData.personalInfo.location}</div>
        )}
        {resumeData.personalInfo.email && (
          <div>{resumeData.personalInfo.email}</div>
        )}
        {resumeData.personalInfo.phone && (
          <div>{resumeData.personalInfo.phone}</div>
        )}
        {resumeData.personalInfo.github && (
          <div>
            <a
              href={`https://${resumeData.personalInfo.github.replace(
                /^https?:\/\//,
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </div>
        )}

        {resumeData.personalInfo.linkedin && (
          <div>
            <a
              href={`https://${resumeData.personalInfo.linkedin.replace(
                /^https?:\/\//,
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Linkedin
            </a>
          </div>
        )}
      </div>
    </div>
    {resumeData.sections.map((section) => (
      <div key={section.id} className="mb-5">
        <h2 className="text-base font-bold text-text-secondary mb-2 font-serif border-b border-border-light pb-1">
          {section.title}
        </h2>
        <div className="space-y-2">
          {section.items.map((item, itemIndex) => (
            <div key={itemIndex} className="space-y-1">
              {item.headings.map((heading, headingIndex) => (
                <div
                  key={headingIndex}
                  className={
                    headingIndex === 0
                      ? "font-semibold text-text-primary text-sm"
                      : "text-text-secondary italic text-sm"
                  }
                >
                  {heading.value}
                </div>
              ))}
              <div className="space-y-1">
                {item.textLines.map((line, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="text-text-secondary ml-4 text-sm leading-5"
                  >
                    • {line.value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Section Editor Component
const SectionEditor = ({
  section,
  onUpdateSection,
  onDeleteSection,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(section.title);

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      headings: [
        { id: Date.now().toString(), value: "", placeholder: "Company Name" },
      ],
      textLines: [
        {
          id: (Date.now() + 1).toString(),
          value: "",
          placeholder: "Job Description",
        },
      ],
    };
    onUpdateSection({ ...section, items: [...section.items, newItem] });
  };

  const updateItem = (itemIndex, updatedItem) => {
    const newItems = [...section.items];
    newItems[itemIndex] = updatedItem;
    onUpdateSection({ ...section, items: newItems });
  };

  const deleteItem = (itemIndex) => {
    const newItems = section.items.filter((_, index) => index !== itemIndex);
    onUpdateSection({ ...section, items: newItems });
  };

  const addHeading = (itemIndex) => {
    const newItems = [...section.items];
    newItems[itemIndex].headings.push({
      id: Date.now().toString(),
      value: "",
      placeholder: "Additional Info",
    });
    onUpdateSection({ ...section, items: newItems });
  };

  const addTextLine = (itemIndex) => {
    const newItems = [...section.items];
    newItems[itemIndex].textLines.push({
      id: Date.now().toString(),
      value: "",
      placeholder: "Description point",
    });
    onUpdateSection({ ...section, items: newItems });
  };

  const deleteHeading = (itemIndex, headingIndex) => {
    if (section.items[itemIndex].headings.length <= 1) return;
    const newItems = [...section.items];
    newItems[itemIndex].headings = newItems[itemIndex].headings.filter(
      (_, index) => index !== headingIndex
    );
    onUpdateSection({ ...section, items: newItems });
  };

  const deleteTextLine = (itemIndex, lineIndex) => {
    const newItems = [...section.items];
    newItems[itemIndex].textLines = newItems[itemIndex].textLines.filter(
      (_, index) => index !== lineIndex
    );
    onUpdateSection({ ...section, items: newItems });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className={`p-1 ${
                canMoveUp
                  ? "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className={`p-1 ${
                canMoveDown
                  ? "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          {isEditing ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={() => {
                onUpdateSection({ ...section, title: editingTitle });
                setIsEditing(false);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onUpdateSection({ ...section, title: editingTitle });
                  setIsEditing(false);
                }
              }}
              className="text-xl font-semibold bg-transparent border-b border-blue-600 dark:border-blue-500 outline-none text-gray-900 dark:text-white"
              autoFocus
            />
          ) : (
            <h3
              className="text-xl font-semibold cursor-pointer hover:text-blue-600 dark:hover:text-blue-500 text-gray-900 dark:text-white"
              onClick={() => setIsEditing(true)}
            >
              {section.title}
            </h3>
          )}
        </div>
        <button
          onClick={() => onDeleteSection(section.id)}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {section.items.map((item, itemIndex) => (
        <div
          key={item.id}
          className="border border-gray-100 dark:border-gray-700 rounded p-4 mb-3"
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-gray-600 dark:text-gray-400">
              Item {itemIndex + 1}
            </h4>
            <button
              onClick={() => deleteItem(itemIndex)}
              className="text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Headings
            </label>
            {item.headings.map((heading, hIndex) => (
              <div key={heading.id} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={heading.value}
                  placeholder={heading.placeholder}
                  onChange={(e) => {
                    const newHeadings = [...item.headings];
                    newHeadings[hIndex] = { ...heading, value: e.target.value };
                    updateItem(itemIndex, { ...item, headings: newHeadings });
                  }}
                  className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent"
                />
                {item.headings.length > 1 && (
                  <button
                    onClick={() => deleteHeading(itemIndex, hIndex)}
                    className="text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-200 px-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addHeading(itemIndex)}
              className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            >
              + Add Heading
            </button>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Description Points
            </label>
            {item.textLines.map((line, lIndex) => (
              <div key={line.id} className="flex gap-2 mb-2">
                <textarea
                  value={line.value}
                  placeholder={line.placeholder}
                  onChange={(e) => {
                    const newTextLines = [...item.textLines];
                    newTextLines[lIndex] = { ...line, value: e.target.value };
                    updateItem(itemIndex, { ...item, textLines: newTextLines });
                  }}
                  className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                />
                <button
                  onClick={() => deleteTextLine(itemIndex, lIndex)}
                  className="text-red-400 hover:text-red-600 dark:text-red-300 dark:hover:text-red-200 px-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => addTextLine(itemIndex)}
              className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            >
              + Add Description Point
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-600 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
      >
        + Add New Item
      </button>
    </div>
  );
};

const PersonalInfoEditor = ({ personalInfo, onUpdate }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Personal Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={personalInfo.name}
          onChange={(e) => onUpdate({ ...personalInfo, name: e.target.value })}
          className="p-3 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="email"
          placeholder="Email"
          value={personalInfo.email}
          onChange={(e) => onUpdate({ ...personalInfo, email: e.target.value })}
          className="p-3 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Phone"
          value={personalInfo.phone}
          onChange={(e) => onUpdate({ ...personalInfo, phone: e.target.value })}
          className="p-3 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Location"
          value={personalInfo.location}
          onChange={(e) =>
            onUpdate({ ...personalInfo, location: e.target.value })
          }
          className="p-3 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="GitHub Profile"
          value={personalInfo.github}
          onChange={(e) =>
            onUpdate({ ...personalInfo, github: e.target.value })
          }
          className="p-3 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="LinkedIn Profile"
          value={personalInfo.linkedin}
          onChange={(e) =>
            onUpdate({ ...personalInfo, linkedin: e.target.value })
          }
          className="p-3 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

const exportToPDF = async (resumeData, selectedTemplate) => {
  const printContent = document.createElement("div");
  printContent.innerHTML = `<html>
  <head>
    <title>${resumeData.personalInfo.name || "Your Name"}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 12px;
        line-height: 1.4;
        color: #374151;
        background: white;
      }
      @page {
        margin: none;
      }
      @page {
        @top-left {
          content: none;
        }
        @top-center {
          content: none;
        }
        @top-right {
          content: none;
        }
        @bottom-left {
          content: none;
        }
        @bottom-center {
          content: none;
        }
        @bottom-right {
          content: none;
        }
      }
      .resume-container {
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        margin: 0 auto;
        background: white;
      }
      .space-y-4 > * + * {
        margin-top: 12px;
      }
      .space-y-3 > * + * {
        margin-top: 8px;
      }
      .space-y-2 > * + * {
        margin-top: 6px;
      }
      .space-y-1 > * + * {
        margin-top: 3px;
      }
      .mb-6 {
        margin-bottom: 16px;
      }
      .mb-5 {
        margin-bottom: 14px;
      }
      .mb-4 {
        margin-bottom: 12px;
      }
      .mb-3 {
        margin-bottom: 8px;
      }
      .mb-2 {
        margin-bottom: 6px;
      }
      .pb-4 {
        padding-bottom: 12px;
      }
      .pb-1 {
        padding-bottom: 3px;
      }
      .ml-2 {
        margin-left: 6px;
      }
      .ml-4 {
        margin-left: 12px;
      }
      .border-b-2 {
        border-bottom: 2px solid;
      }
      .border-b {
        border-bottom: 1px solid;
      }
      .border-blue-600 {
        border-color: #2563eb;
      }
      .border-gray-300 {
        border-color: #d1d5db;
      }
      .border-gray-200 {
        border-color: #e5e7eb;
      }
      .text-2xl {
        font-size: 22px;
        font-weight: bold;
        line-height: 1.2;
      }
      .text-xl {
        font-size: 20px;
        font-weight: bold;
        line-height: 1.2;
      }
      .text-lg {
        font-size: 16px;
        font-weight: bold;
        line-height: 1.3;
      }
      .text-base {
        font-size: 14px;
        font-weight: bold;
        line-height: 1.3;
      }
      .text-sm {
        font-size: 13px;
        line-height: 1.4;
      }
      .font-bold {
        font-weight: bold;
      }
      .flex {
        display: flex;
      }
      .gap-4 {
        gap: 1rem;
      }
      .flex-wrap {
        flex-wrap: wrap;
      }
      .font-semibold {
        font-weight: 600;
      }
      .text-gray-900 {
        color: #111827;
      }
      .text-gray-700 {
        color: #374151;
      }
      .text-gray-600 {
        color: #4b5563;
      }
      .text-blue-600 {
        color: #2563eb;
      }
      .uppercase {
        text-transform: uppercase;
      }
      .tracking-wide {
        letter-spacing: 0.025em;
      }
      .italic {
        font-style: italic;
      }
      .font-serif {
        font-family: serif;
      }
      .text-center {
        text-align: center;
      }
      @media print {
        body {
          print-color-adjust: exact;
        }
        .resume-container {
          padding: 12mm;
        }
        .text-2xl {
          font-size: 20px;
        }
        .text-xl {
          font-size: 18px;
        }
        .text-lg {
          font-size: 15px;
        }
        .text-base {
          font-size: 13px;
        }
        .text-sm {
          font-size: 12px;
        }
      }
    </style>
  </head>
  <body>
    <div class="resume-container">
      ${
        selectedTemplate === "modern"
          ? generateModernHTML(resumeData)
          : generateClassicHTML(resumeData)
      }
    </div>
  </body>
</html>`;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent.innerHTML);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 250);
};

const generateModernHTML = (resumeData) =>
  `<div class="space-y-4"><div class="border-b-2 border-blue-600 pb-4 mb-6"><h1 class="text-2xl font-bold text-gray-900 mb-2">${
    resumeData.personalInfo.name || "Your Name"
  }</h1><div class="text-gray-600 text-xs flex gap-4 flex-wrap">${
    resumeData.personalInfo.location
      ? `<div>📍 ${resumeData.personalInfo.location}</div>`
      : ""
  }${
    resumeData.personalInfo.email
      ? `<div>✉️ ${resumeData.personalInfo.email}</div>`
      : ""
  }${
    resumeData.personalInfo.phone
      ? `<div>📞 ${resumeData.personalInfo.phone}</div>`
      : ""
  }${
    resumeData.personalInfo.github
      ? `<div>🔗 <a href="https://${resumeData.personalInfo.github.replace(
          /^https?:\/\//,
          ""
        )}" target="_blank" rel="noopener noreferrer">Github</a></div>`
      : ""
  }${
    resumeData.personalInfo.linkedin
      ? `<div>💼 <a href="https://${resumeData.personalInfo.linkedin.replace(
          /^https?:\/\//,
          ""
        )}" target="_blank" rel="noopener noreferrer">Linkedin</a></div>`
      : ""
  }</div></div>${resumeData.sections
    .map(
      (section) =>
        `<div class="mb-5"><h2 class="text-lg font-bold text-blue-600 mb-3 uppercase tracking-wide">${
          section.title
        }</h2><div class="space-y-3">${section.items
          .map(
            (item) =>
              `<div class="space-y-1">${item.headings
                .map(
                  (heading, idx) =>
                    `<div class="${
                      idx === 0
                        ? "font-semibold text-gray-900 text-sm"
                        : "text-gray-600 italic text-sm"
                    }">${heading.value}</div>`
                )
                .join("")}<div class="space-y-1">${item.textLines
                .map(
                  (line) =>
                    `<div class="text-gray-700 ml-2 text-sm" style="line-height:1.5;">• ${line.value}</div>`
                )
                .join("")}</div></div>`
          )
          .join("")}</div></div>`
    )
    .join("")}</div>`;

const generateClassicHTML = (resumeData) =>
  `<div class="space-y-4"><div class="text-center border-b border-gray-300 pb-4 mb-6"><h1 class="text-xl font-bold text-gray-900 mb-3 font-serif">${
    resumeData.personalInfo.name || "Your Name"
  }</h1><div class="text-gray-600 text-xs flex gap-4 flex-wrap">${
    resumeData.personalInfo.location
      ? `<div>${resumeData.personalInfo.location}</div>`
      : ""
  }${
    resumeData.personalInfo.email
      ? `<div>${resumeData.personalInfo.email}</div>`
      : ""
  }${
    resumeData.personalInfo.phone
      ? `<div>${resumeData.personalInfo.phone}</div>`
      : ""
  }${
    resumeData.personalInfo.github
      ? `<div><a href="https://${resumeData.personalInfo.github.replace(
          /^https?:\/\//,
          ""
        )}" target="_blank" rel="noopener noreferrer">Github</a></div>`
      : ""
  }${
    resumeData.personalInfo.linkedin
      ? `<div><a href="https://${resumeData.personalInfo.linkedin.replace(
          /^https?:\/\//,
          ""
        )}" target="_blank" rel="noopener noreferrer">Linkedin</a></div>`
      : ""
  }</div></div>${resumeData.sections
    .map(
      (section) =>
        `<div class="mb-5"><h2 class="text-base font-bold text-gray-700 mb-2 font-serif border-b border-gray-200 pb-1">${
          section.title
        }</h2><div class="space-y-2">${section.items
          .map(
            (item) =>
              `<div class="space-y-1">${item.headings
                .map(
                  (heading, idx) =>
                    `<div class="${
                      idx === 0
                        ? "font-semibold text-gray-900 text-sm"
                        : "text-gray-600 italic text-sm"
                    }">${heading.value}</div>`
                )
                .join("")}<div class="space-y-1">${item.textLines
                .map(
                  (line) =>
                    `<div class="text-gray-700 ml-4 text-sm" style="line-height:1.5;">• ${line.value}</div>`
                )
                .join("")}</div></div>`
          )
          .join("")}</div></div>`
    )
    .join("")}</div>`;

// Main Resume Builder Component

const ResumeBuilder = () => {
  const [currentView, setCurrentView] = useState("start");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [showPreview, setShowPreview] = useState(false);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      github: "",
      linkedin: "",
    },
    sections: [
      { id: `section-${Date.now()}-default1`, title: "Experience", items: [] },
      { id: `section-${Date.now()}-default2`, title: "Education", items: [] },
    ],
  });

  const addSection = (title = "New Section") => {
    const newSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      items: [],
    };
    setResumeData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (updatedSection) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === updatedSection.id ? updatedSection : section
      ),
    }));
  };

  const deleteSection = (sectionId) => {
    setResumeData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }));
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    const newSections = [...resumeData.sections];
    [newSections[index], newSections[index - 1]] = [
      newSections[index - 1],
      newSections[index],
    ];
    setResumeData((prev) => ({ ...prev, sections: newSections }));
  };

  const moveSectionDown = (index) => {
    if (index === resumeData.sections.length - 1) return;
    const newSections = [...resumeData.sections];
    [newSections[index], newSections[index + 1]] = [
      newSections[index + 1],
      newSections[index],
    ];
    setResumeData((prev) => ({ ...prev, sections: newSections }));
  };

  const loadSampleData = () => {
    setResumeData(sampleResumeData);
    setCurrentView("builder");
  };

  const startBlank = () => {
    setResumeData({
      personalInfo: {
        name: "",
        email: "",
        phone: "",
        location: "",
        github: "",
        linkedin: "",
      },
      sections: [],
    });
    setCurrentView("builder");
  };

  const sectionTemplates = [
    { title: "Work Experience", type: "experience" },
    { title: "Education", type: "education" },
    { title: "Projects", type: "projects" },
    { title: "Technical Skills", type: "skills" },
    { title: "Certifications", type: "certifications" },
    { title: "Achievements", type: "achievements" },
  ];

  if (currentView === "start") {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-text-primary dark:text-text-dark_primary">
              Resume Builder
            </h1>
            <p className="text-text-secondary dark:text-text-dark_secondary text-xl">
              Create your professional resume with ease
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={loadSampleData}
              className="bg-primary dark:bg-primary-dark hover:bg-primary-hover dark:hover:bg-primary-dark_hover text-surface dark:text-text-dark_primary px-8 py-4 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
            >
              <FileText className="w-5 h-5" />
              Use Sample Template
            </button>
            <button
              onClick={startBlank}
              className="border border-text-primary dark:border-text-dark-primary text-text-primary dark:text-text-dark_primary hover:bg-hover-light dark:hover:bg-hover-dark px-8 py-4 rounded-lg font-medium transition-colors flex items-center gap-2 justify-center"
            >
              <Edit3 className="w-5 h-5" />
              Start from Blank
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-surface dark:bg-surface-dark p-6 rounded-lg">
              <h3 className="text-text-primary dark:text-text-dark_primary font-semibold mb-2">
                Modern Template
              </h3>
              <div className="bg-hover-light dark:bg-hover-dark h-32 rounded border-l-4 border-primary dark:border-primary-dark p-4">
                <div className="space-y-2">
                  <div className="h-3 bg-primary dark:bg-primary-dark rounded w-3/4"></div>
                  <div className="h-2 bg-text-secondary dark:bg-text-dark_secondary rounded w-1/2"></div>
                  <div className="h-2 bg-text-secondary dark:bg-text-dark_secondary rounded w-2/3"></div>
                </div>
              </div>
            </div>
            <div className="bg-surface dark:bg-surface-dark p-6 rounded-lg">
              <h3 className="text-text-primary dark:text-text-dark_primary font-semibold mb-2">
                Classic Template
              </h3>
              <div className="bg-hover-light dark:bg-hover-dark h-32 rounded border-t-2 border-text-secondary dark:border-text-dark-secondary p-4">
                <div className="space-y-2 text-center">
                  <div className="h-3 bg-text-secondary dark:bg-text-dark_secondary rounded w-1/2 mx-auto"></div>
                  <div className="h-2 bg-text-secondary dark:bg-text-dark_secondary rounded w-1/3 mx-auto"></div>
                  <div className="h-2 bg-text-secondary dark:bg-text-dark_secondary rounded w-2/3 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark pt-16">
      <div className="bg-surface dark:bg-surface-dark shadow-sm border-b border-border dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
            {/* Left Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
              <button
                onClick={() => setCurrentView("start")}
                className="text-text-secondary dark:text-text-dark_secondary hover:text-text-primary dark:hover:text-text-dark_primary flex items-center gap-2 text-sm sm:text-base"
              >
                ← Back to Start
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary dark:text-text-dark_primary">
                Resume Builder
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
              {/* Template Selector */}
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-text-secondary dark:text-text-dark_secondary" />
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="border border-border dark:border-border-dark rounded px-3 py-2 bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark_primary focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark w-full sm:w-auto"
                >
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                </select>
              </div>

              {/* Show/Hide Preview Button */}
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center justify-center gap-2 bg-primary dark:bg-primary-dark text-surface dark:text-text-dark_primary px-4 py-2 rounded hover:bg-primary-hover dark:hover:bg-primary-dark_hover transition-colors w-full sm:w-auto"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>

              {/* Export PDF Button */}
              <button
                onClick={() => exportToPDF(resumeData, selectedTemplate)}
                className="flex items-center justify-center gap-2 bg-success dark:bg-success-dark text-surface dark:text-text-dark_primary px-4 py-2 rounded hover:bg-success-600 dark:hover:bg-success-500 transition-colors w-full sm:w-auto"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div
          className={`grid ${
            showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          } gap-6`}
        >
          <div className="space-y-6">
            <PersonalInfoEditor
              personalInfo={resumeData.personalInfo}
              onUpdate={(updatedInfo) =>
                setResumeData((prev) => ({
                  ...prev,
                  personalInfo: updatedInfo,
                }))
              }
            />

            <div className="bg-surface dark:bg-surface-dark rounded-lg border border-border dark:border-border-dark p-4">
              <h3 className="text-lg font-semibold mb-3 text-text-primary dark:text-text-dark_primary">
                Add Section
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {sectionTemplates.map((template) => (
                  <button
                    key={template.type}
                    onClick={() => addSection(template.title)}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-hover-light dark:bg-hover-dark hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary dark:hover:text-primary-dark border border-border dark:border-border-dark rounded transition-colors text-text-primary dark:text-text-dark_primary"
                  >
                    <Plus className="w-4 h-4" />
                    {template.title}
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border dark:border-border-dark">
                <button
                  onClick={() => addSection("Custom Section")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-border-medium dark:border-border-dark rounded-lg text-text-secondary dark:text-text-dark_secondary hover:border-primary dark:hover:border-primary-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Section
                </button>
              </div>
            </div>

            {resumeData.sections.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark_primary">
                  Resume Sections
                </h3>
                {resumeData.sections.map((section, index) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    onUpdateSection={updateSection}
                    onDeleteSection={deleteSection}
                    onMoveUp={() => moveSectionUp(index)}
                    onMoveDown={() => moveSectionDown(index)}
                    canMoveUp={index > 0}
                    canMoveDown={index < resumeData.sections.length - 1}
                  />
                ))}
              </div>
            )}

            {resumeData.sections.length === 0 && (
              <div className="bg-surface dark:bg-surface-dark rounded-lg border border-border dark:border-border-dark p-8 text-center">
                <div className="text-text-muted dark:text-text-dark-muted mb-4">
                  <FileText className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark_primary mb-2">
                  No sections yet
                </h3>
                <p className="text-text-secondary dark:text-text-dark_secondary mb-4">
                  Add your first section to get started with your resume
                </p>
                <button
                  onClick={() => addSection("Work Experience")}
                  className="bg-primary dark:bg-primary-dark text-surface dark:text-text-dark_primary px-6 py-2 rounded-lg hover:bg-primary-hover dark:hover:bg-primary-dark_hover transition-colors"
                >
                  Add Work Experience
                </button>
              </div>
            )}
          </div>

          {showPreview && (
            <div className="lg:col-span-1">
              <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-lg overflow-hidden sticky top-16 border border-border dark:border-border-dark">
                <div className="p-4 bg-hover-light dark:bg-hover-dark border-b border-border dark:border-border-dark">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark_primary">
                      Resume Preview
                    </h2>
                    <div className="flex gap-2">
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="px-3 py-1 border border-border dark:border-border-dark rounded-md text-sm bg-surface dark:bg-surface-dark text-text-primary dark:text-text-dark_primary"
                      >
                        <option value="classic">Classic</option>
                        <option value="modern">Modern</option>
                      </select>
                      <button
                        onClick={() =>
                          exportToPDF(resumeData, selectedTemplate)
                        }
                        className="px-4 py-2 bg-primary dark:bg-primary-dark text-surface dark:text-text-dark_primary rounded-md hover:bg-primary-hover dark:hover:bg-primary-dark_hover text-sm"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="p-6 bg-white min-h-[800px] max-w-[210mm] mx-auto"
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.4",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {selectedTemplate === "modern" ? (
                    <ModernTemplate resumeData={resumeData} />
                  ) : (
                    <ClassicTemplate resumeData={resumeData} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-6 border border-primary-200 dark:border-primary-800">
          <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-3">
            💡 Quick Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-primary-800 dark:text-primary-200">
            <div>
              <strong>Move Sections:</strong> Use up/down arrows to reorder
              sections
            </div>
            <div>
              <strong>Live Preview:</strong> See changes instantly in the
              preview panel
            </div>
            <div>
              <strong>Multiple Templates:</strong> Switch between Modern and
              Classic styles
            </div>
            <div>
              <strong>PDF Export:</strong> Download your resume as a
              professional PDF
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
