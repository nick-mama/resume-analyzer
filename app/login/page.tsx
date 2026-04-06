"use client";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 w-full max-w-md text-center">
        <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold">R</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Resume Analyzer
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Sign in to analyze your resume and track your history
        </p>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"
            />
            <path
              fill="#34A853"
              d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.77-2.7.77-2.08 0-3.84-1.4-4.47-3.29H1.88v2.07A8 8 0 008.98 17z"
            />
            <path
              fill="#FBBC05"
              d="M4.51 10.53A4.8 4.8 0 014.26 9c0-.53.09-1.04.25-1.53V5.4H1.88A8 8 0 000 9c0 1.29.31 2.51.88 3.6l2.63-2.07z"
            />
            <path
              fill="#EA4335"
              d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 008.98 1a8 8 0 00-7.1 4.4l2.63 2.07c.63-1.89 2.39-3.29 4.47-3.29z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </main>
  );
}
