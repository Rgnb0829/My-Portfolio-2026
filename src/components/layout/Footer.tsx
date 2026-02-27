"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-[#0a0a0a] border-t border-white/5 py-12 px-6 md:px-12 mt-32 relative overflow-hidden">
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 relative z-10">
                <div className="flex flex-col gap-6">
                    <Link href="/" className="text-3xl font-black tracking-tighter text-white">
                        RAKHA<span className="text-gray-500">.</span>
                    </Link>
                    <p className="text-gray-400 text-sm max-w-sm">
                        I'm Rakha Wismaya, Software Developer based in Yogyakarta, Indonesia.
                        Creating engaging digital experiences where design meets technology.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <Link
                            href="mailto:creative.rakhawn@gmail.com"
                            className="px-4 py-2 rounded-full border border-white/10 hover:bg-white hover:text-black transition-colors text-sm font-medium"
                        >
                            Email Me
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 lg:gap-16">
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-semibold mb-2">Navigation</h4>
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">Home</Link>
                        <Link href="/about-me" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">About</Link>
                        <Link href="/works" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">Works</Link>
                        <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm w-fit">Contact</Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-semibold mb-2">Socials</h4>
                        <Link href="https://github.com/flyychmoreeee" target="_blank" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group w-fit">
                            Github <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="https://www.linkedin.com/in/rakha-zildan-19588b2a4/" target="_blank" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group w-fit">
                            LinkedIn <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link href="https://wa.me/62895421845451" target="_blank" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group w-fit">
                            WhatsApp <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                <p>© {currentYear} Rakha Wismaya. All rights reserved.</p>
                <p>Made with ❤️ by Rakha</p>
            </div>
        </footer>
    );
}
