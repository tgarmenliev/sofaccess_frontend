// app/api/stats/route.ts

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
      .single(); // Select the single row

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        total: data.total ?? 0,
        resolved: data.resolved ?? 0,
      },
    });

  } catch (err: any) {
    console.error("Stats API error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}