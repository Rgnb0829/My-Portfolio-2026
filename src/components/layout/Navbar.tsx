"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about-me" },
    { name: "Works", path: "/works" },
    { name: "Contact", path: "/contact" },
    { name: "Admin", path: "/admin" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { data: settings } = useSWR("/api/settings", fetcher);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when path changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100000] transition-all duration-300 ${isScrolled
                ? "bg-black/70 backdrop-blur-lg border-b border-white/10 py-4 shadow-lg shadow-black/50"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-2xl font-black tracking-tighter text-white z-[99999] relative"
                >
                    RAKHA<span className="text-gray-500">.</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8 bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path));
                        return (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`relative text-sm font-medium transition-colors ${isActive ? "text-white" : "text-gray-400 hover:text-white"
                                    }`}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-[10px] left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden z-[99999] relative">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-white p-2 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[99998] bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center h-screen w-screen"
                    >
                        <nav className="flex flex-col items-center gap-8">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.path || (link.path !== "/" && pathname.startsWith(link.path));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.path}
                                        className={`text-4xl font-bold tracking-tighter transition-colors ${isActive ? "text-white" : "text-gray-500 hover:text-white"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="absolute bottom-12 flex gap-4 text-gray-400 text-sm flex-wrap items-center justify-center px-4">
                            {settings?.github && <Link href={settings.github} target="_blank" className="hover:text-white">Github</Link>}
                            {settings?.linkedin && <Link href={settings.linkedin} target="_blank" className="hover:text-white">LinkedIn</Link>}
                            {settings?.behance && <Link href={settings.behance} target="_blank" className="hover:text-white">Behance</Link>}
                            {settings?.instagram && <Link href={settings.instagram} target="_blank" className="hover:text-white">Instagram</Link>}
                            {settings?.whatsapp && <Link href={settings.whatsapp} target="_blank" className="hover:text-white">WhatsApp</Link>}
                            {settings?.email && <Link href={`mailto:${settings.email}`} className="hover:text-white">Email</Link>}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
