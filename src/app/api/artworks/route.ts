import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET() {
    const { data, error } = await supabase.from("artworks").select("*").order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newArtwork = {
            title: body.title || "Untitled Artwork",
            category: body.category || "Uncategorized",
            status: body.status || "Draft",
            image: body.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100"
        };

        const { data, error } = await supabase.from("artworks").insert([newArtwork]).select().single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true, artwork: data }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) return NextResponse.json({ error: "Artwork ID is required" }, { status: 400 });

        const { data, error } = await supabase.from("artworks").update(updates).eq("id", id).select().single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true, artwork: data });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "Artwork ID is required" }, { status: 400 });

        const { error } = await supabase.from("artworks").delete().eq("id", id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
