# Resume Analyzer

Live site: https://resume-analyzer-ruby-three.vercel.app

An AI-powered web app that analyzes your resume against a job description and returns a match score, matched keywords, missing keywords, and suggestions for improvement.

## Features

- Upload a resume as a PDF
- Paste any job description
- Get an AI-generated match score from 0 to 100
- See which keywords you have and which you are missing
- Get specific suggestions to improve your resume for that role
- View and delete past analyses

## Tech Stack

- Next.js 16
- Groq API (llama-3.3-70b)
- Supabase (PostgreSQL)
- Tailwind CSS
- Vercel (deployment)

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/nick-mama/resume-analyzer.git
cd resume-analyzer
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables

```bash
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the Supabase database by running this SQL in your Supabase SQL editor

```sql
create table analyses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  job_title text,
  match_score integer,
  matched_keywords text[],
  missing_keywords text[],
  suggestions text[]
);

alter table analyses disable row level security;
```

5. Run the development server

```bash
npm run dev
```

## Planned Improvements

- User authentication so each user only sees their own history
- Resume rewrite suggestions powered by AI
- Support for DOCX file uploads
