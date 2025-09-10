import React, { useState } from 'react';
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ATSAnalyzerContent = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const navigate = useNavigate();

  const handleAnalyzeText = async () => {
    if (!resumeText.trim()) {
      toast.error("Paste your resume text or upload a file");
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post(API_PATHS.RESUME.ANALYZE_TEXT(), {
        resumeText,
        jobDescription,
      });
      setAnalysis(data?.analysis || "");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to analyze resume";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeUpload = async () => {
    if (!file) {
      toast.error("Please choose a PDF or DOCX file");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post(API_PATHS.RESUME.ANALYZE_UPLOAD(), form, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { jobDescription },
      });
      setAnalysis(data?.analysis || "");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to analyze uploaded resume";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="mb-4">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-violet-200 text-violet-700 font-bold rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
        <h1 className="text-2xl font-semibold mb-2">ATS Resume Analyzer</h1>
        <p className="text-gray-600 mb-6">Paste your resume text or upload a PDF/DOCX to get an ATS score and suggestions. Optionally provide a job description for better matching.</p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Job Description (optional)</label>
          <textarea
            className="w-full border rounded p-2 h-28"
            placeholder="Paste the target job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Paste Resume Text</label>
          <textarea
            className="w-full border rounded p-2 h-40"
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <button
            className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            onClick={handleAnalyzeText}
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Pasted Text"}
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Or Upload File (PDF or DOCX)</label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border rounded bg-white hover:bg-gray-50">
              <span className="text-sm font-medium">Choose File</span>
              <input
                type="file"
                className="hidden"
                accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <span className="text-sm text-gray-600 truncate max-w-xs">
              {file ? file.name : "No file selected"}
            </span>
            <button
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
              onClick={handleAnalyzeUpload}
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Analyze Uploaded File"}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="mt-6 border rounded p-4 bg-white">
            <h2 className="text-xl font-semibold mb-2">ATS Report</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{analysis}</pre>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

const ATSAnalyzer = () => (
  <ProtectedRoute>
    <ATSAnalyzerContent />
  </ProtectedRoute>
);

export default ATSAnalyzer;
