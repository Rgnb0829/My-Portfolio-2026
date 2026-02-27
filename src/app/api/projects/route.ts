import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the shape of our Project
export type Project = {
    id: number | string;
    title: string;
    category: string;
    status: "Live" | "Draft";
    image: string;
    description?: string;
    techStack?: string;
    liveUrl?: string;
    repoUrl?: string;
};

// Path to our local JSON "database"
const dbPath = path.join(process.cwd(), "src", "data", "projects.json");

// Helper to reliably read the JSON database
function getProjectsData(): Project[] {
    try {
        if (!fs.existsSync(dbPath)) {
            // If the file doesn't exist yet, return an empty array (or seed data)
            return [];
        }
        const fileContent = fs.readFileSync(dbPath, "utf-8");
        return JSON.parse(fileContent);
    } catch (error) {
        console.error("Error reading database:", error);
        return [];
    }
}

// Helper to reliably write back to the JSON database
function saveProjectsData(data: Project[]) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
        return true;
    } catch (error) {
        console.error("Error writing to database:", error);
        return false;
    }
}

// ==========================================
// GET: Fetch all projects
// ==========================================
export async function GET() {
    const projects = getProjectsData();
    return NextResponse.json(projects);
}

// ==========================================
// POST: Add a new project
// ==========================================
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const projects = getProjectsData();

        // Create a new project with a unique timestamp ID
        const newProject: Project = {
            id: Date.now().toString(),
            title: body.title || "Untitled Project",
            category: body.category || "Uncategorized",
            status: body.status || "Draft",
            image: body.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100",
            description: body.description || "",
            techStack: body.techStack || "",
            liveUrl: body.liveUrl || "",
            repoUrl: body.repoUrl || ""
        };

        projects.push(newProject);

        if (saveProjectsData(projects)) {
            return NextResponse.json({ success: true, project: newProject }, { status: 201 });
        } else {
            return NextResponse.json({ error: "Failed to save project data" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

// ==========================================
// PUT: Update an existing project
// ==========================================
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: "Project ID is required for updating" }, { status: 400 });
        }

        const projects = getProjectsData();
        const projectIndex = projects.findIndex((p) => String(p.id) === String(id));

        if (projectIndex === -1) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Apply updates
        projects[projectIndex] = { ...projects[projectIndex], ...updates };

        if (saveProjectsData(projects)) {
            return NextResponse.json({ success: true, project: projects[projectIndex] });
        } else {
            return NextResponse.json({ error: "Failed to save updates" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

// ==========================================
// DELETE: Remove a project
// ==========================================
export async function DELETE(request: Request) {
    try {
        // We'll expect the ID to be passed as a query parameter: /api/projects?id=xyz
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
        }

        const projects = getProjectsData();
        const filteredProjects = projects.filter((p) => String(p.id) !== String(id));

        if (projects.length === filteredProjects.length) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (saveProjectsData(filteredProjects)) {
            return NextResponse.json({ success: true, message: "Project deleted successfully" });
        } else {
            return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}
