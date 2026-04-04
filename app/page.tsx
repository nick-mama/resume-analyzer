"use client";
import { useState, useCallback } from "react";
import Link from "next/link";

interface Analysis {
  match_score: number;
  job_title: string;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-sm text-gray-500">/ 100</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  }, []);

  const handleAnalyze = async () => {
    if (!file || !jobDescription) return;
    setLoading(true);
    setError("");
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    const res = await fetch("/api/analyze", { method: "POST", body: formData });
    const data = await res.json();

    if (data.success) {
      setAnalysis(data.analysis);
    } else {
      setError(data.error || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">R</span>
          </div>
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-semibold text-gray-900">
              Resume Analyzer
            </h1>
            <Link
              href="/history"
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              View History
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {!analysis ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Match your resume to any job
              </h2>
              <p className="text-gray-500">
                Upload your resume and paste a job description to get an
                AI-powered match score and suggestions
              </p>
            </div>

            {/* Upload area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Resume (PDF)
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => document.getElementById("fileInput")?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-blue-400 bg-blue-50"
                    : file
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div>
                    <div className="text-3xl mb-2">📄</div>
                    <p className="text-green-700 font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to change file
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="text-3xl mb-2">⬆️</div>
                    <p className="text-gray-600 font-medium">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-sm text-gray-400 mt-1">PDF files only</p>
                  </div>
                )}
              </div>
            </div>

            {/* Job description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-48 p-4 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!file || !jobDescription || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Back button */}
            <button
              onClick={() => setAnalysis(null)}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              ← Analyze another resume
            </button>

            {/* Score card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative flex items-center justify-center">
                  <ScoreRing score={analysis.match_score} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-1">
                    Match Score
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {analysis.job_title}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {analysis.match_score >= 70
                      ? "🟢 Strong match! Your resume aligns well with this role."
                      : analysis.match_score >= 40
                        ? "🟡 Decent match. A few tweaks could strengthen your application."
                        : "🔴 Low match. Consider tailoring your resume more to this role."}
                  </p>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Matched Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.matched_keywords.map((kw) => (
                    <span
                      key={kw}
                      className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_keywords.map((kw) => (
                    <span
                      key={kw}
                      className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                💡 Suggestions to Improve
              </h3>
              <div className="space-y-3">
                {analysis.suggestions.map((s, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <span className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
