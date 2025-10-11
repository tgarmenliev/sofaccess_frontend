import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("counters")
      .select('total, resolved')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        total: data.total ?? 0,
        resolved: data.resolved ?? 0,
      },
    });

  } catch (err) {
    console.error("Stats API error:", err);
    const error = err as Error;
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}