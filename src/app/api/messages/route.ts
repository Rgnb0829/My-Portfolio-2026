import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET() {
    const { data, error } = await supabase.from("messages").select("*").order("date", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const newMessage = {
            name: body.name || "Anonymous",
            email: body.email || "no-reply@example.com",
            message: body.message || "",
            isRead: false
        };

        const { data, error } = await supabase.from("messages").insert([newMessage]).select().single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true, message: data }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, isRead } = body;

        if (!id) return NextResponse.json({ error: "Message ID is required" }, { status: 400 });

        const { data, error } = await supabase.from("messages").update({ isRead }).eq("id", id).select().single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true, message: data });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "Message ID is required" }, { status: 400 });

        const { error } = await supabase.from("messages").delete().eq("id", id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
