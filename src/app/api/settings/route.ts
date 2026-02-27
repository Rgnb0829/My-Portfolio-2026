import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "settings.json");

// Helper to read data
function readData() {
    try {
        if (!fs.existsSync(dataFilePath)) {
            const defaultSettings = {
                name: "Rakha Wismaya",
                role: "UI/UX Designer & Developer",
                bio: "I craft digital experiences that merge clean aesthetics with robust functionality.",
                email: "hello@example.com",
                github: "https://github.com/",
                linkedin: "https://linkedin.com/",
                instagram: "https://instagram.com/"
            };
            fs.writeFileSync(dataFilePath, JSON.stringify(defaultSettings, null, 2), "utf-8");
            return defaultSettings;
        }
        const fileContent = fs.readFileSync(dataFilePath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading settings data:", error);
        return {};
    }
}

// Helper to write data
function writeData(data: any) {
    try {
        const dirPath = path.dirname(dataFilePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
        console.error("Error writing settings data:", error);
    }
}

// GET settings
export async function GET() {
    const data = readData();
    return NextResponse.json(data);
}

// PUT update settings
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        let data = readData();
        data = { ...data, ...body };
        writeData(data);

        return NextResponse.json({ message: "Settings updated successfully", settings: data });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
