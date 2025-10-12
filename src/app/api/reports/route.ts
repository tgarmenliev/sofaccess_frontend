import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
        .upload(filename, buffer, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabaseAdmin
        .storage
        .from("report-images")
        .getPublicUrl(filename);

      image_url = publicData.publicUrl;
    }

    const { error } = await supabaseAdmin
      .from("reports")
      .insert([{ title, description, type, lat, lng, image_url, sent: false, is_visible: false }]);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as Error;
    console.error("POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get('admin') === 'true';

    let query = supabaseAdmin
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (!isAdmin) {
      query = query.eq('is_visible', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const error = err as Error;
    console.error("GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
      .update({ type: "Разрешен сигнал", updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) throw error;

    await supabaseAdmin.rpc('increment_resolved_reports', { count: ids.length });
    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as Error;
    console.error("PUT error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
  } catch (err) {
    const error = err as Error;
    console.error("DELETE error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, sent, is_visible } = await req.json();

    if (id === undefined) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }
    
    const updateData: { updated_at: string, sent?: boolean, is_visible?: boolean } = {
        updated_at: new Date().toISOString()
    };

    if (sent !== undefined) {
        updateData.sent = sent;
    }

    if (is_visible !== undefined) {
        updateData.is_visible = is_visible;
    }

    const { error } = await supabaseAdmin
      .from("reports")
      .update(updateData)
      .eq('id', id);

    if (error) throw error;

    if (is_visible === true) {
        await supabaseAdmin.rpc('increment_total_reports');
    } else if (is_visible === false) {
        await supabaseAdmin.rpc('decrement_total_reports');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as Error;
    console.error("PATCH error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}