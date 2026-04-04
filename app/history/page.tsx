"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Analysis {
  id: string;
  created_at: string;
  job_title: string;
  match_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
}

function ScoreRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg width="64" height="64" className="-rotate-90">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch(`/api/history/${id}`, { method: "DELETE" });
    setAnalyses(analyses.filter((a) => a.id !== id));
  };

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setAnalyses(data.analyses);
        setLoading(false);
      });
  }, []);

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              Resume Analyzer
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + New Analysis
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Analyses</h2>

        {loading && (
          <div className="text-center py-20 text-gray-400">
            Loading history...
          </div>
        )}

        {!loading && analyses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">No analyses yet</p>
            <Link href="/" className="text-blue-600 hover:underline text-sm">
              Analyze your first resume →
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {analyses.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                className="w-full flex items-center gap-6 p-6 hover:bg-gray-50 transition-colors text-left"
              >
                <ScoreRing score={a.match_score} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{a.job_title}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {formatDate(a.created_at)}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {a.matched_keywords.slice(0, 4).map((kw) => (
                      <span
                        key={kw}
                        className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
                      >
                        {kw}
                      </span>
                    ))}
                    {a.matched_keywords.length > 4 && (
                      <span className="text-xs text-gray-400">
                        +{a.matched_keywords.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleDelete(a.id, e)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg text-xs transition-colors"
                  >
                    Delete
                  </button>
                  <span className="text-gray-400 text-sm">
                    {expanded === a.id ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {expanded === a.id && (
                <div className="border-t border-gray-100 p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                        Matched Keywords
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {a.matched_keywords.map((kw) => (
                          <span
                            key={kw}
                            className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                        Missing Keywords
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {a.missing_keywords.map((kw) => (
                          <span
                            key={kw}
                            className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      💡 Suggestions
                    </p>
                    <div className="space-y-2">
                      {a.suggestions.map((s, i) => (
                        <div
                          key={i}
                          className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                        >
                          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-700">{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
