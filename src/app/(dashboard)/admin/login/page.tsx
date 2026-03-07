"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password) {
            setError("Password is required");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                // Force a hard refresh to bypass client-side cache and
                // let the middleware re-evaluate the new cookie
                window.location.href = "/admin";
            } else {
                const data = await res.json();
                setError(data.error || "Invalid password");
                setIsLoading(false);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 selection:bg-black selection:text-white">
            <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl border border-gray-100 rounded-2xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-black"></div>
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-gray-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="mb-10 relative">
                    <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-black/10">
                        <Lock size={24} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Access CMS</h1>
                    <p className="text-gray-500 text-sm">Enter the master password to manage your portfolio content.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-800 transition-all font-mono tracking-widest placeholder:tracking-normal"
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-2 font-medium bg-red-50 p-2 rounded-md border border-red-100/50 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 rounded-xl shadow-lg shadow-black/10 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Authenticating...
                            </>
                        ) : (
                            "Unlock Dashboard"
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="w-full text-center text-sm text-gray-400 hover:text-gray-900 transition-colors mt-4"
                    >
                        Return to Home
                    </button>
                </form>
            </div>
        </div>
    );
}
