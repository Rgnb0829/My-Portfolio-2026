"use client";

import { motion } from "framer-motion";
import useSWR from "swr";



const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AboutPage() {
    const { data: settings, error } = useSWR('/api/settings', fetcher);

    return (
        <div className="min-h-screen bg-black text-white px-6 md:px-12 py-12">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 md:mb-24"
                >
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">
                        About <br />
                        <span className="text-gradient">Me</span>
                    </h1>
                    <div className="text-gray-400 text-lg md:text-xl leading-relaxed space-y-6 max-w-3xl">
                        {!settings ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                            </div>
                        ) : settings.aboutText ? (
                            settings.aboutText.split('\n').filter((text: string) => text.trim() !== '').map((paragraph: string, i: number) => (
                                <p key={i}>{paragraph}</p>
                            ))
                        ) : (
                            <p>About me information coming soon.</p>
                        )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
                        <div className="flex flex-wrap gap-3">
                            {settings?.skills?.map((skill: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-colors"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col gap-8"
                    >
                        <h2 className="text-3xl font-bold mb-2">Experience</h2>
                        <div className="flex flex-col gap-10">
                            {settings?.experiences?.map((exp: any, index: number) => (
                                <div key={index} className="flex flex-col gap-2 relative pl-6 border-l border-white/10">
                                    <div className="absolute w-3 h-3 bg-white rounded-full -left-[6.5px] top-1.5 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                    <h3 className="text-xl font-bold">{exp.role}</h3>
                                    <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
                                        <span>{exp.company}</span>
                                        <span>{exp.period}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-2">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
