import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service key, не anon
  { auth: { persistSession: false } }
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("address")?.toString();
    const description = formData.get("description")?.toString();
    const type = formData.get("type")?.toString();
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);
    const file = formData.get("file") as File | null;

    let image_url: string | null = null;

    if (file && file.size > 0) {
      const ext = file.name.split(".").pop();
      const filename = `reports/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin
        .storage
        .from("report-images")
        .upload(filename, buffer, {
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabaseAdmin
        .storage
        .from("report-images")
        .getPublicUrl(filename);

      image_url = publicData.publicUrl;
    }

    const { error } = await supabaseAdmin
      .from("reports")
      .insert([{ title, description, type, lat, lng, image_url }]);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error inserting:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
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

export async function PUT(req: Request) {
  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid IDs provided" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("reports")
      .update({ 
        type: "Разрешен",
        updated_at: new Date().toISOString()
      })
      .in("id", ids);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("reports")
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}