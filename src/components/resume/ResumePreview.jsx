const ResumePreview = ({ resumeData, selectedTemplate }) => (
  <div className="lg:col-span-1">
    <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-16">
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Resume Preview
          </h2>
          <div className="flex gap-2">
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
            </select>
            <button
              onClick={() => exportToPDF(resumeData, selectedTemplate)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
      <div
        className="p-6 bg-white min-h-[800px] max-w-[210mm] mx-auto"
        style={{
          fontSize: "14px",
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
);

export default ResumePreview;
