"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock } from "lucide-react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("salah cok");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Check if already authenticated
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("adminAuth") === "true";
        if (isAuthenticated) {
            router.push("/admin");
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Mock authentication (simulate slight network delay)
        setTimeout(() => {
            if (password === "admin123") {
                localStorage.setItem("adminAuth", "true");
                router.push("/admin");
            } else {
                setError("Salah cok.");
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 relative z-[999999]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-8 sm:p-12">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                            <Lock size={28} className="text-white" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-2 tracking-tight">
                        Admin Portal
                    </h1>
                    <p className="text-center text-gray-500 text-sm mb-8">
                        Enter your secure password to access the CMS.
                    </p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className={`w-full px-4 py-3.5 rounded-xl border ${error ? "border-red-300 focus:ring-red-100" : "border-gray-200 focus:ring-black/5"
                                    } bg-white text-gray-900 text-sm focus:outline-none focus:ring-4 focus:border-gray-800 transition-all`}
                                autoFocus
                            />
                            {error && (
                                <p className="text-red-500 text-xs mt-2 pl-1 font-medium">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                <>
                                    Access Dashboard
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        Go back to <a href="/" className="text-gray-600 hover:text-black hover:underline transition-colors font-medium">live site</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
