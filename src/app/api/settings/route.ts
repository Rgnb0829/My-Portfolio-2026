import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('data')
            .eq('id', 'global')
            .single();

        if (error) {
            console.error("Supabase GET Error:", error);
            return NextResponse.json({ error: "Failed to read settings data" }, { status: 500 });
        }

        return NextResponse.json(data?.data || {});
    } catch (error) {
        console.error("GET Exception:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedSettings = await request.json();

        // 1. Ambil data yang ada dulu
        const { data: currentData, error: fetchError } = await supabase
            .from('settings')
            .select('data')
            .eq('id', 'global')
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "No rows returned"
            console.error("Supabase Fetch Error:", fetchError);
            return NextResponse.json({ error: "Failed to fetch current settings" }, { status: 500 });
        }

        const existingSettings = currentData?.data || {};

        // 2. Gabungkan data baru dengan data lama
        const newSettings = { ...existingSettings, ...updatedSettings };

        // 3. Simpan kembali ke Supabase
        const { error: upsertError } = await supabase
            .from('settings')
            .upsert({ id: 'global', data: newSettings });

        if (upsertError) {
            console.error("Supabase Upsert Error:", upsertError);
            return NextResponse.json({ error: "Failed to update settings data" }, { status: 500 });
        }

        return NextResponse.json(newSettings);
    } catch (error) {
        console.error("PUT Exception:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
