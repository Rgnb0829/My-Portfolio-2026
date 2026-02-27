import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "artworks.json");

// Helper to read data
function readData() {
    try {
        if (!fs.existsSync(dataFilePath)) {
            fs.writeFileSync(dataFilePath, "[]", "utf-8");
            return [];
        }
        const fileContent = fs.readFileSync(dataFilePath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading artworks data:", error);
        return [];
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
        console.error("Error writing artworks data:", error);
    }
}

// GET all artworks
export async function GET() {
    const data = readData();
    return NextResponse.json(data);
}

// POST new artwork
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = readData();

        // simple id generation
        const newId = data.length > 0 ? Math.max(...data.map((p: any) => p.id)) + 1 : 1;

        const newArtwork = { id: newId, ...body };
        data.push(newArtwork);
        writeData(data);

        return NextResponse.json({ message: "Artwork created successfully", artwork: newArtwork }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create artwork" }, { status: 500 });
    }
}

// PUT update artwork
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        let data = readData();
        const index = data.findIndex((p: any) => p.id === id);

        if (index === -1) return NextResponse.json({ error: "Artwork not found" }, { status: 404 });

        data[index] = { ...data[index], ...updateData };
        writeData(data);

        return NextResponse.json({ message: "Artwork updated successfully", artwork: data[index] });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update artwork" }, { status: 500 });
    }
}

// DELETE artwork
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const idParam = searchParams.get("id");

        if (!idParam) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const id = parseInt(idParam);
        let data = readData();

        const initialLength = data.length;
        data = data.filter((p: any) => p.id !== id);

        if (data.length === initialLength) {
            return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
        }

        writeData(data);
        return NextResponse.json({ message: "Artwork deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete artwork" }, { status: 500 });
    }
}
