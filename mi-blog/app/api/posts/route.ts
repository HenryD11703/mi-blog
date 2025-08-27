import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

// GET → listar posts
export async function GET() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST → crear post
export async function POST(req: Request) {
  const body = await req.json();
  const { title, content, author } = body;

  const { data, error } = await supabase
    .from("posts")
    .insert([{ title, content, author }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}
