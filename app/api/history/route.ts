import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ success: true, analyses: data });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}
