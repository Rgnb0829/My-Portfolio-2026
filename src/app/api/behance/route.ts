import { NextResponse } from "next/server";
import Parser from "rss-parser";

export async function GET() {
    try {
        const username = "creativerakhawn";
        const rssUrl = `https://www.behance.net/feeds/user?username=${username}`;

        // Fetch using Next.js native fetch with caching
        const response = await fetch(rssUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
            next: { revalidate: 3600 } // Cache for 1 hour at edge
        });

        if (!response.ok) {
            throw new Error(`Behance RSS failed: ${response.statusText}`);
        }

        const xml = await response.text();
        const parser = new Parser({
            customFields: {
                item: ['description', 'pubDate'],
            }
        });

        const feed = await parser.parseString(xml);

        const items = feed.items.map(item => {
            // Extract image from description HTML (Behance puts the project cover inside <img src="...">)
            let image = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"; // Fallback
            if (item.description) {
                const imgMatch = item.description.match(/<img[^>]+src=['"]([^'"]+)['"]/i);
                if (imgMatch && imgMatch[1]) {
                    image = imgMatch[1];
                }
            }

            return {
                id: item.guid || item.link?.split('/').pop() || Math.random().toString(),
                title: item.title || "Untitled Artwork",
                liveUrl: item.link || "#",
                image: image,
                category: "Illustration", // Tag it as illustration for the Works page filter
                status: "Live",
                year: item.pubDate ? new Date(item.pubDate).getFullYear().toString() : new Date().getFullYear().toString(),
                isBehance: true,
                description: "View full project and high-resolution details directly on Behance.",
                techStack: "Digital Illustration, Graphic Design"
            };
        });

        return NextResponse.json(items);

    } catch (error) {
        console.error("Error fetching Behance RSS:", error);
        return NextResponse.json({ error: "Failed to fetch Behance feed" }, { status: 500 });
    }
}
