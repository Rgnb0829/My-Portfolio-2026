"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSWR from "swr";

const categories = ["All", "Web Dev", "E-Commerce", "Illustration", "Game Dev"];
const greetings = ['Hello', 'Hola', 'こんにちは', 'Bonjour', 'Halo'];

// Standard fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BrutalistWorksPage() {
    const [showPreloader, setShowPreloader] = useState(true);
    const [showText, setShowText] = useState(true);
    const [greetingIndex, setGreetingIndex] = useState(0);
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedProject, setSelectedProject] = useState<any>(null);

    // Fetch live projects from CMS via our local JSON API
    const { data: projectsData, error } = useSWR("/api/projects", fetcher);

    // Preloader Sequence Logic
    useEffect(() => {
        if (greetingIndex < greetings.length - 1) {
            const timer = setTimeout(() => {
                setGreetingIndex(prev => prev + 1);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            // Reached the last word ('Halo'), pause for 800ms
            const textTimer = setTimeout(() => {
                setShowText(false); // Trigger glitch/fade out for "Halo"
            }, 800);

            const preloaderTimer = setTimeout(() => {
                setShowPreloader(false); // Slide up black background
            }, 1300); // 500ms after text starts its exit animation

            return () => {
                clearTimeout(textTimer);
                clearTimeout(preloaderTimer);
            };
        }
    }, [greetingIndex]);

    // Filtering Logic (Filter only live projects if data exists)
    const filteredProjects = projectsData
        ? projectsData
            .filter((p: any) => p.status === "Live")
            .filter((p: any) => activeFilter === "All" || p.category === activeFilter)
        : [];

    return (
        // Outer container overriding any global dark modes, forcing a strict minimal bright theme
        <div className="min-h-screen bg-[#FAFAFA] text-black font-sans relative z-[9999] pb-32">

            {/* 1. LAYER: THE PRELOADER */}
            <AnimatePresence>
                {showPreloader && (
                    <motion.div
                        key="preloader"
                        initial={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {showText && (
                                <motion.div
                                    key={greetingIndex}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={
                                        greetingIndex === greetings.length - 1
                                            ? {
                                                // The "Halo" Glitch/Fade Exit Animation
                                                opacity: [1, 0.8, 0, 1, 0],
                                                scale: [1, 1.05, 1, 1.1, 0.95],
                                                x: [0, -10, 10, -5, 0],
                                                filter: ["blur(0px)", "blur(2px)", "blur(0px)", "blur(10px)"],
                                            }
                                            : { opacity: 0 }
                                    }
                                    transition={{ duration: greetingIndex === greetings.length - 1 ? 0.4 : 0.15 }}
                                    className="text-white text-5xl md:text-7xl font-sans font-bold tracking-tight"
                                >
                                    {greetings[greetingIndex]}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* 2. LAYER: MAIN CONTENT */}
            <div className="container mx-auto px-6 md:px-12 pt-32 lg:pt-40 max-w-7xl">

                {/* Header & Subtitle Entrance */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={!showPreloader ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="mb-20"
                >
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-black">
                        Selected Works.
                    </h1>
                    <p className="text-[#555555] text-lg md:text-2xl max-w-2xl font-light">
                        A showcase of recent digital experiences, clean interfaces, and creative developments.
                    </p>
                </motion.div>

                {/* Filter Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={!showPreloader ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-wrap items-center gap-8 mb-16 border-b border-gray-200 pb-5"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveFilter(category)}
                            className={`text-sm md:text-base font-medium relative transition-colors duration-300 ${activeFilter === category ? "text-black" : "text-gray-400 hover:text-black"
                                }`}
                        >
                            {category}
                            {activeFilter === category && (
                                <motion.div
                                    layoutId="active-filter-indicator"
                                    className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-black"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Project Grid System */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-16 gap-y-24"
                >
                    <AnimatePresence>
                        {filteredProjects.map((project: any, index: number) => (
                            <motion.div
                                layout
                                key={project.id}
                                // Stagger entrance on load, but swap dynamically when filtering
                                initial={showPreloader ? { opacity: 0, y: 40 } : { opacity: 0, scale: 0.95 }}
                                animate={!showPreloader ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                transition={{
                                    duration: 0.6,
                                    // Add staggered delay ONLY on initial entrance
                                    delay: (!showPreloader && activeFilter === "All") ? index * 0.1 + 0.5 : 0,
                                    ease: "easeOut"
                                }}
                                onClick={() => setSelectedProject(project)}
                                className="flex flex-col group cursor-pointer"
                            >
                                {/* Minimalist Image Container */}
                                <div className="relative aspect-[4/3] w-full mb-6 overflow-hidden bg-gray-100 border border-gray-200">
                                    <img
                                        src={project.image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"}
                                        alt={project.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                </div>

                                {/* Meta Data Flex Container */}
                                <div className="flex justify-between items-center mb-3 text-xs text-gray-500 font-mono tracking-wider uppercase">
                                    <span>{project.year || "2024"}</span>
                                    <span>{project.category}</span>
                                </div>

                                <h3 className="text-2xl font-bold text-black mb-3 tracking-tight group-hover:underline decoration-2 underline-offset-4">
                                    {project.title}
                                </h3>

                                <p className="text-[#555555] text-base leading-relaxed mb-6 line-clamp-2">
                                    {project.description}
                                </p>

                                {/* Minimal Tech Stack Tags */}
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.techStack ? project.techStack.split(',').map((tech: string, i: number) => (
                                        <span
                                            key={i}
                                            className="text-xs font-mono text-gray-500 bg-white px-3 py-1 border border-gray-200"
                                        >
                                            {tech.trim()}
                                        </span>
                                    )) : null}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* 3. LAYER: PROJECT DETAL MODAL (POP UP) */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4 sm:px-6">
                        {/* Dim Background */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                            onClick={() => setSelectedProject(null)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            layoutId={`project-card-${selectedProject.id}`}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white w-full max-w-4xl relative z-10 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        >
                            {/* Left: Image (40% width on Desktop) */}
                            <div className="w-full md:w-[45%] h-64 md:h-auto bg-gray-100 shrink-0">
                                <img
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Right: Content container */}
                            <div className="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col justify-center">
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full flex items-center justify-center transition-colors shadow-sm"
                                    aria-label="Close modal"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>

                                <div className="mb-4 text-xs text-gray-500 font-mono tracking-wider uppercase flex gap-4">
                                    <span>{selectedProject.category}</span>
                                    <span>•</span>
                                    <span>{selectedProject.status}</span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 tracking-tight leading-tight">
                                    {selectedProject.title}
                                </h2>

                                <p className="text-[#555555] text-lg leading-relaxed mb-8">
                                    {selectedProject.description}
                                </p>

                                {/* Tech Stack */}
                                <div className="mb-10">
                                    <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-widest">Technologies</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.techStack ? selectedProject.techStack.split(',').map((tech: string, i: number) => (
                                            <span key={i} className="text-sm font-mono text-gray-600 bg-gray-100 px-3 py-1.5">
                                                {tech.trim()}
                                            </span>
                                        )) : <span className="text-sm text-gray-400">Not specified</span>}
                                    </div>
                                </div>

                                {/* Deep action links */}
                                <div className="flex flex-wrap items-center gap-4 mt-auto">
                                    {selectedProject.liveUrl ? (
                                        <a
                                            href={selectedProject.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors inline-flex border flex-1 items-center justify-center gap-2 whitespace-nowrap"
                                        >
                                            Visit Live Project
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
                                        </a>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-400 px-8 py-4 text-sm font-bold uppercase tracking-wider border flex-1 text-center cursor-not-allowed">
                                            No Live URL
                                        </span>
                                    )}

                                    {selectedProject.repoUrl && (
                                        <a
                                            href={selectedProject.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white hover:bg-gray-50 text-black px-8 py-4 text-sm font-bold uppercase tracking-wider transition-colors inline-flex border border-gray-200 items-center justify-center gap-2 whitespace-nowrap mt-4 sm:mt-0"
                                        >
                                            Source Code
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
