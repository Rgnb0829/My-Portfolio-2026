import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data/settings.json");

export async function GET() {
    try {
        const fileContents = await fs.readFile(dataFilePath, "utf8");
        const settings = JSON.parse(fileContents);
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to read settings data" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedSettings = await request.json();
        const fileContents = await fs.readFile(dataFilePath, "utf8");
        const currentSettings = JSON.parse(fileContents);

        const newSettings = { ...currentSettings, ...updatedSettings };

        await fs.writeFile(dataFilePath, JSON.stringify(newSettings, null, 4), "utf8");
        return NextResponse.json(newSettings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update settings data" }, { status: 500 });
    }
}
