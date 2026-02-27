"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setFormData({ name: "", email: "", message: "" });
                alert("Message sent successfully!");
            } else {
                alert("Failed to send message.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white px-6 md:px-12 py-12">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 md:mb-24"
                >
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
                        Let's <br />
                        <span className="text-gradient">Connect</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed">
                        Have a project in mind or just want to say hi? Feel free to reach out.
                        I'm currently available for freelance opportunities.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="order-2 lg:order-1"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-400">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="text-sm font-medium text-gray-400">Message</label>
                                <textarea
                                    id="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/40 transition-colors resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white text-black font-bold py-4 rounded-xl mt-4 hover:bg-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col gap-12 order-1 lg:order-2"
                    >
                        <div className="flex flex-col gap-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <Mail size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm font-medium mb-1">Email</h3>
                                    <a href="mailto:mrakhazildan@gmail.com" className="text-xl font-medium hover:text-gray-300 transition-colors">
                                        creative.rakhawn@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                    <MapPin size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-gray-400 text-sm font-medium mb-1">Location</h3>
                                    <p className="text-xl font-medium">Yogyakarta, Indonesia</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-gray-400 text-sm font-medium mb-4">Social Profiles</h3>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="https://github.com/flyychmoreeee"
                                    target="_blank"
                                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    Github <ArrowUpRight size={16} />
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/in/rakha-zildan-19588b2a4/"
                                    target="_blank"
                                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    LinkedIn <ArrowUpRight size={16} />
                                </Link>
                                <Link
                                    href="https://wa.me/62895421845451"
                                    target="_blank"
                                    className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    WhatsApp <ArrowUpRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
