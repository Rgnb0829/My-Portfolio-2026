import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET() {
    const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
    if (error) {
        // Fallback default if not found
        return NextResponse.json({
            name: "Rakha Commander",
            role: "Frontend Developer",
            bio: "Building interactive digital experiences.",
            email: "creative.rakhawn@gmail.com",
            github: "https://github.com/Rgnb0829",
            linkedin: "",
            instagram: ""
        });
    }
    return NextResponse.json(data);
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Upsert ensures we update row id 1, or create it if not found
        const { data, error } = await supabase.from("settings").upsert({ id: 1, ...body }).select().single();
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json({ success: true, settings: data });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
