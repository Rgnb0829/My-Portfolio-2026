import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
    title: "Admin Dashboard | Portfolio CMS",
    description: "Secure CMS for managing portfolio content",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-[#FAFAFA] min-h-screen w-full relative antialiased">
                {children}
            </body>
        </html>
    );
}
