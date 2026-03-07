import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const correctPassword = process.env.ADMIN_PASSWORD;

        if (!correctPassword) {
            console.error("ADMIN_PASSWORD is not set in environment variables");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        if (password === correctPassword) {
            const response = NextResponse.json({ success: true });

            // Set HTTP-only cookie for authentication session
            response.cookies.set({
                name: 'admin_auth',
                value: 'authenticated',
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            return response;
        } else {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
