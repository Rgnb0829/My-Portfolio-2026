import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "messages.json");

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
        console.error("Error reading messages data:", error);
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
        console.error("Error writing messages data:", error);
    }
}

// GET all messages
export async function GET() {
    const data = readData();
    // Sort messages strictly by date descending
    data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(data);
}

// POST new message (from contact form)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const data = readData();

        // simple id generation
        const newId = data.length > 0 ? Math.max(...data.map((p: any) => p.id)) + 1 : 1;

        const newMessage = {
            id: newId,
            date: new Date().toISOString(),
            isRead: false,
            ...body
        };
        data.push(newMessage);
        writeData(data);

        return NextResponse.json({ message: "Message sent successfully", msg: newMessage }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}

// PUT update message (mark as read)
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, isRead } = body;

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        let data = readData();
        const index = data.findIndex((p: any) => p.id === id);

        if (index === -1) return NextResponse.json({ error: "Message not found" }, { status: 404 });

        data[index] = { ...data[index], isRead: isRead !== undefined ? isRead : true };
        writeData(data);

        return NextResponse.json({ message: "Message updated successfully", msg: data[index] });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
    }
}

// DELETE message
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
            return NextResponse.json({ error: "Message not found" }, { status: 404 });
        }

        writeData(data);
        return NextResponse.json({ message: "Message deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
    }
}
