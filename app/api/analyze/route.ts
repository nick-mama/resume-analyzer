import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
import Groq from "groq-sdk";
import { supabase } from "@/lib/supabase";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;
    const jobDescription = formData.get("jobDescription") as string;

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: "Missing resume or job description" },
        { status: 400 },
      );
    }

    // Extract text from PDF
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);
    const { text } = await extractText(buffer, { mergePages: true });

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from PDF" },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert resume analyzer. Analyze the resume against the job description and return ONLY a JSON object with no markdown, no backticks, no extra text.

Resume:
${text}

Job Description:
${jobDescription}

Return exactly this JSON structure:
{
  "match_score": <number 0-100>,
  "job_title": "<inferred job title>",
  "matched_keywords": ["<keyword1>", "<keyword2>"],
  "missing_keywords": ["<keyword1>", "<keyword2>"],
  "suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const responseText = completion.choices[0].message.content!;
    const clean = responseText.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(clean);

    // Save to Supabase
    const { error: dbError } = await supabase.from("analyses").insert({
      job_title: analysis.job_title,
      match_score: analysis.match_score,
      matched_keywords: analysis.matched_keywords,
      missing_keywords: analysis.missing_keywords,
      suggestions: analysis.suggestions,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // Don't fail the request if DB save fails, just log it
    }

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 },
    );
  }
}
