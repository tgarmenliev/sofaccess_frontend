import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// POST → нов сигнал
export async function POST(req: Request) {

  try {
    const body = await req.json();

    const { title, description, type, lat, lng } = body;

    const { data, error } = await supabase
      .from("reports")
      .insert([{ title, description, type, lat, lng }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("POST error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// GET → всички сигнали
export async function GET() {

  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("GET error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
