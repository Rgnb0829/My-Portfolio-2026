import { NextResponse } from "next/server";

export async function GET() {
    try {
        const username = "creativerakhawn";
        const rssUrl = `https://www.behance.net/feeds/user?username=${username}`;

        const response = await fetch(rssUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Cache-Control": "max-age=3600",
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Behance RSS failed: ${response.statusText}`);
        }

        const xml = await response.text();

        // Simple Regex-based XML parsing
        const items: any[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;

        while ((match = itemRegex.exec(xml)) !== null) {
            const itemXml = match[1];

            const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
            const linkMatch = itemXml.match(/<link><!\[CDATA\[(.*?)\]\]><\/link>/);
            const dateMatch = itemXml.match(/<pubDate><!\[CDATA\[(.*?)\]\]><\/pubDate>/);
            const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/);

            let image = "";
            let description = "";

            if (descMatch) {
                const imgMatch = descMatch[1].match(/<img src='(.*?)'/);
                if (imgMatch) {
                    image = imgMatch[1];
                }
            }

            if (titleMatch && linkMatch) {
                items.push({
                    id: linkMatch[1].split('/').pop() || Math.random().toString(),
                    title: titleMatch[1],
                    liveUrl: linkMatch[1],
                    image: image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
                    category: "Illustration", // Map Behance items to Illustration
                    status: "Live",
                    year: dateMatch ? new Date(dateMatch[1]).getFullYear().toString() : new Date().getFullYear().toString(),
                    isBehance: true,
                    description: "View full project and details on Behance." // Placeholder since RSS desc is mostly just the image
                });
            }
        }

        return NextResponse.json(items);

    } catch (error) {
        console.error("Error fetching Behance RSS:", error);
        return NextResponse.json({ error: "Failed to fetch Behance feed" }, { status: 500 });
    }
}
