"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
    LayoutDashboard,
    FolderKanban,
    FileImage,
    MessageSquare,
    Settings,
    Bell,
    ExternalLink,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    X,
    UploadCloud,
} from "lucide-react";

// Standard fetcher for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [activeTab, setActiveTab] = useState("Projects");

    // Form State for new project/artwork
    const [formData, setFormData] = useState<any>({
        title: "",
        category: "",
        description: "",
        techStack: "",
        liveUrl: "",
        repoUrl: "",
        status: "Draft",
        image: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    // Fetching Data with SWR
    const { data: projects, mutate: mutateProjects } = useSWR("/api/projects", fetcher);
    const { data: artworks, mutate: mutateArtworks } = useSWR("/api/artworks", fetcher);
    const { data: messages, mutate: mutateMessages } = useSWR("/api/messages", fetcher);
    const { data: settings, mutate: mutateSettings } = useSWR("/api/settings", fetcher);

    useEffect(() => {
        // Check authentication status safely on client-side mount
        const authStatus = localStorage.getItem("adminAuth");
        if (authStatus !== "true") {
            router.push("/admin/login");
        } else {
            setIsAuthenticated(true);
        }
        setIsCheckingAuth(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        router.push("/admin/login");
    };

    const handleSaveProject = async () => {
        try {
            setIsSaving(true);

            const endpoint = activeTab === "Artworks" ? "/api/artworks" : "/api/projects";
            const mutateFn = activeTab === "Artworks" ? mutateArtworks : mutateProjects;

            const method = formData.id ? "PUT" : "POST";

            const res = await fetch(endpoint, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                mutateFn(); // Re-fetch the data to update the UI
                setIsSlideOverOpen(false);
                setFormData({ title: "", category: "", description: "", techStack: "", liveUrl: "", repoUrl: "", status: "Draft", image: "" } as any);
                alert(`${activeTab.slice(0, -1)} saved successfully!`);
            } else {
                alert(`Error saving ${activeTab}.`);
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteRecord = async (id: string | number) => {
        if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1).toLowerCase()}?`)) return;

        const endpoint = activeTab === "Artworks" ? "/api/artworks" : "/api/projects";
        const mutateFn = activeTab === "Artworks" ? mutateArtworks : mutateProjects;

        try {
            const res = await fetch(`${endpoint}?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                mutateFn(); // Re-fetch
            }
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleEditRecord = (record: any) => {
        setFormData({ ...record });
        setIsSlideOverOpen(true);
    };

    const handleAddNewRecord = () => {
        setFormData({ title: "", category: "", description: "", techStack: "", liveUrl: "", repoUrl: "", status: "Draft", image: "" } as any);
        setIsSlideOverOpen(true);
    };

    const [settingsData, setSettingsData] = useState<any>({});

    // Sync settings data when loaded
    useEffect(() => {
        if (settings) setSettingsData(settings);
    }, [settings]);

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    const handleMarkMessageRead = async (id: number) => {
        try {
            const res = await fetch("/api/messages", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, isRead: true })
            });
            if (res.ok) mutateMessages();
        } catch (error) {
            console.error("Error marking message read:", error);
        }
    };

    const handleDeleteMessage = async (id: number) => {
        if (!confirm("Delete this message?")) return;
        try {
            const res = await fetch(`/api/messages?id=${id}`, { method: "DELETE" });
            if (res.ok) mutateMessages();
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const handleSaveSettings = async () => {
        try {
            setIsSaving(true);
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settingsData)
            });
            if (res.ok) {
                mutateSettings();
                alert("Settings saved successfully!");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Prevent flashing of the admin dashboard before redirect
    if (!isAuthenticated) return null;

    return (
        // Outer container overriding root dark modes (forcing the Clean Light SaaS Theme)
        <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans flex relative">

            {/* Mobile Sidebar Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* 1. SIDEBAR (Left Navigation) */}
            <aside className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full z-50 transition-transform duration-300`}>
                <div
                    className="p-6 border-b border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => alert("Profile settings coming soon!")}
                >
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                        R
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900 text-sm">Rakha Commander</h2>
                        <p className="text-xs text-gray-500">Admin Account</p>
                    </div>
                </div>
                <nav className="flex-1 p-4 flex flex-col gap-1">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === "Overview"} onClick={() => { setActiveTab("Overview"); setIsMobileMenuOpen(false); }} />
                    <NavItem icon={<FolderKanban size={20} />} label="Projects" active={activeTab === "Projects"} onClick={() => { setActiveTab("Projects"); setIsMobileMenuOpen(false); }} />
                    <NavItem icon={<FileImage size={20} />} label="Artworks" active={activeTab === "Artworks"} onClick={() => { setActiveTab("Artworks"); setIsMobileMenuOpen(false); }} />
                    <NavItem icon={<MessageSquare size={20} />} label="Messages" active={activeTab === "Messages"} onClick={() => { setActiveTab("Messages"); setIsMobileMenuOpen(false); }} />
                    <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === "Settings"} onClick={() => { setActiveTab("Settings"); setIsMobileMenuOpen(false); }} />
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Log Out
                    </button>
                </div>
            </aside>

            {/* 2. MAIN LAYOUT AREA */}
            <div className="flex-1 flex flex-col ml-0 md:ml-64 w-full min-h-screen transition-all">

                {/* TOPBAR (Header) */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10 w-full">
                    {/* Mobile Menu Toggle (Visible on smaller screens) */}
                    <button
                        className="md:hidden text-gray-600 hover:text-black mr-4"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <LayoutDashboard size={24} />}
                    </button>

                    <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">Projects Management</h1>

                    <div className="flex items-center gap-4 sm:gap-6 ml-auto">
                        <a
                            href="/works"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-600 hover:text-black flex items-center gap-2 transition-colors"
                        >
                            View Live Site <ExternalLink size={16} />
                        </a>
                        <div className="w-[1px] h-6 bg-gray-200 hidden sm:block"></div>
                        <button
                            className="relative text-gray-500 hover:text-black transition-colors"
                            onClick={() => {
                                const unreadCount = messages?.filter((m: any) => !m.isRead)?.length || 0;
                                if (unreadCount > 0) {
                                    setActiveTab("Messages");
                                    setIsMobileMenuOpen(false);
                                } else {
                                    alert("You have 0 new notifications");
                                }
                            }}
                        >
                            <Bell size={20} />
                            {(messages?.filter((m: any) => !m.isRead)?.length || 0) > 0 && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                            )}
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-10 w-full max-w-[1200px] mx-auto">
                    {activeTab === "Overview" ? (
                        <div>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
                                <p className="text-sm text-gray-500 mt-1">Welcome back. Here's a summary of your portfolio metrics.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {/* Total Projects Card */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <FolderKanban size={20} className="text-blue-600" />
                                        </div>
                                        <h3 className="font-medium text-gray-600 text-sm">Total Projects</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{projects?.length || 0}</p>
                                </div>

                                {/* Live Artworks Card */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                                            <FileImage size={20} className="text-emerald-600" />
                                        </div>
                                        <h3 className="font-medium text-gray-600 text-sm">Gallery Artworks</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{artworks?.length || 0}</p>
                                </div>

                                {/* Unread Messages Card */}
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                            <MessageSquare size={20} className="text-red-600" />
                                        </div>
                                        <h3 className="font-medium text-gray-600 text-sm">Unread Messages</h3>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{messages?.filter((m: any) => !m.isRead)?.length || 0}</p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-4 mt-10">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => { setActiveTab("Projects"); handleAddNewRecord(); }}
                                    className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-sm transition-all text-left group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                            <Plus size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Add New Project</p>
                                            <p className="text-sm text-gray-500">Publish a new portfolio case study.</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => { setActiveTab("Artworks"); handleAddNewRecord(); }}
                                    className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-black hover:shadow-sm transition-all text-left group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                            <FileImage size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Upload Artwork</p>
                                            <p className="text-sm text-gray-500">Add a new illustration to the gallery.</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : activeTab === "Projects" ? (
                        <>
                            {/* Header Action */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">All Projects</h2>
                                    <p className="text-sm text-gray-500 mt-1">Manage, update, or remove portfolio items.</p>
                                </div>
                                <button
                                    onClick={handleAddNewRecord}
                                    className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors active:scale-95"
                                >
                                    <Plus size={18} />
                                    Add New Project
                                </button>
                            </div>

                            {/* Data Table / List */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 uppercase text-xs font-semibold text-gray-500 tracking-wider">
                                            <th className="px-6 py-4">Project</th>
                                            <th className="px-6 py-4 hidden sm:table-cell">Category</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {projects ? projects.map((project: any) => (
                                            <tr key={project.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4 max-w-[200px] sm:max-w-none">
                                                        <img
                                                            src={project.image}
                                                            alt={project.title}
                                                            className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm shrink-0"
                                                        />
                                                        <div className="truncate">
                                                            <p className="font-bold text-sm text-gray-900 truncate">{project.title}</p>
                                                            {/* Fallback category display for mobile */}
                                                            <span className="sm:hidden text-xs text-gray-500 mt-0.5 inline-block">{project.category}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                        {project.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className={`w-2 h-2 rounded-full ${project.status === "Live" ? "bg-green-500" : "bg-gray-400"
                                                                }`}
                                                        ></div>
                                                        <span className="text-sm font-medium text-gray-700">{project.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEditRecord(project)} className="text-gray-400 hover:text-black transition-colors" title="Edit">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteRecord(project.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : null}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : activeTab === "Artworks" ? (
                        <>
                            {/* Header Action */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Artworks Gallery</h2>
                                    <p className="text-sm text-gray-500 mt-1">Manage illustration and creative pieces.</p>
                                </div>
                                <button
                                    onClick={handleAddNewRecord}
                                    className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors active:scale-95"
                                >
                                    <Plus size={18} />
                                    Add New Artwork
                                </button>
                            </div>

                            {/* Data Table / List for Artworks */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 uppercase text-xs font-semibold text-gray-500 tracking-wider">
                                            <th className="px-6 py-4">Artwork</th>
                                            <th className="px-6 py-4 hidden sm:table-cell">Category</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {artworks?.map((item: any) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4 max-w-[200px] sm:max-w-none">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="w-12 h-12 rounded-lg object-cover border border-gray-100 shadow-sm shrink-0"
                                                        />
                                                        <div className="truncate">
                                                            <p className="font-bold text-sm text-gray-900 truncate">{item.title}</p>
                                                            <span className="sm:hidden text-xs text-gray-500 mt-0.5 inline-block">{item.category}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${item.status === "Live" ? "bg-green-500" : "bg-gray-400"}`}></div>
                                                        <span className="text-sm font-medium text-gray-700">{item.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleEditRecord(item)} className="text-gray-400 hover:text-black transition-colors" title="Edit">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteRecord(item.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : activeTab === "Messages" ? (
                        <>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Messages</h2>
                                    <p className="text-sm text-gray-500 mt-1">Read and manage contact form submissions.</p>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 uppercase text-xs font-semibold text-gray-500 tracking-wider">
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Sender</th>
                                            <th className="px-6 py-4 hidden sm:table-cell">Message Preview</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {messages?.length === 0 && (
                                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No messages found.</td></tr>
                                        )}
                                        {messages?.map((msg: any) => (
                                            <tr key={msg.id} className={`hover:bg-gray-50 transition-colors group ${!msg.isRead ? "bg-gray-50/50" : ""}`}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(msg.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-sm text-gray-900">{msg.name}</p>
                                                    <p className="text-xs text-gray-500">{msg.email}</p>
                                                </td>
                                                <td className="px-6 py-4 hidden sm:table-cell">
                                                    <p className="text-sm text-gray-600 max-w-xs truncate">{msg.message}</p>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${msg.isRead ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700"}`}>
                                                        {msg.isRead ? "Read" : "New"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {!msg.isRead && (
                                                            <button onClick={() => handleMarkMessageRead(msg.id)} className="text-gray-400 hover:text-blue-600 transition-colors text-xs font-medium border border-gray-200 px-2 py-1 rounded" title="Mark Read">
                                                                Mark Read
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDeleteMessage(msg.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Delete">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : activeTab === "Settings" ? (
                        <div className="max-w-3xl">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Platform Settings</h2>
                                <p className="text-sm text-gray-500 mt-1">Configure your personal information and global social links.</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
                                <form className="flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
                                            <input type="text" value={settingsData?.name || ""} onChange={e => setSettingsData({ ...settingsData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Professional Role</label>
                                            <input type="text" value={settingsData?.role || ""} onChange={e => setSettingsData({ ...settingsData, role: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none text-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                                        <input type="email" value={settingsData?.email || ""} onChange={e => setSettingsData({ ...settingsData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none text-sm" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Bio</label>
                                        <textarea rows={3} value={settingsData?.bio || ""} onChange={e => setSettingsData({ ...settingsData, bio: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none text-sm resize-none" />
                                    </div>

                                    <hr className="border-gray-100 my-2" />
                                    <h3 className="text-sm font-semibold text-gray-900">Social Accounts</h3>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-24 text-sm text-gray-500">GitHub</span>
                                            <input type="url" value={settingsData?.github || ""} onChange={e => setSettingsData({ ...settingsData, github: e.target.value })} placeholder="https://..." className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none text-sm" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-24 text-sm text-gray-500">LinkedIn</span>
                                            <input type="url" value={settingsData?.linkedin || ""} onChange={e => setSettingsData({ ...settingsData, linkedin: e.target.value })} placeholder="https://..." className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none text-sm" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-24 text-sm text-gray-500">Instagram</span>
                                            <input type="url" value={settingsData?.instagram || ""} onChange={e => setSettingsData({ ...settingsData, instagram: e.target.value })} placeholder="https://..." className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black/5 outline-none text-sm" />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <button disabled={isSaving} type="submit" className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-gray-200 rounded-xl bg-white">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTab}</h2>
                            <p className="text-base text-gray-500 max-w-md">This module is currently under construction. Please check back later. Forms and APIs for this section have not been wired up yet.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* 4. SLIDE-OVER (Add/Edit Project Form) */}
            {/* Background Overlay */}
            {isSlideOverOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-40"
                    onClick={() => setIsSlideOverOpen(false)}
                />
            )}

            {/* Panel */}
            <div
                className={`fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isSlideOverOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0 bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900">Add New Project</h2>
                    <button
                        onClick={() => setIsSlideOverOpen(false)}
                        className="text-gray-400 hover:text-black p-2 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Acme Website Restyle"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-800 transition-colors"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-800 transition-colors appearance-none cursor-pointer">
                                <option value="">Select a category</option>
                                <option value="Web Dev">Web Dev</option>
                                <option value="E-Commerce">E-Commerce</option>
                                <option value="Illustration">Illustration</option>
                                <option value="Game Dev">Game Dev</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Briefly describe the project goals and outcome..."
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-800 transition-colors resize-none"
                            ></textarea>
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Tech Stack
                                <span className="text-gray-400 font-normal ml-2">(comma-separated)</span>
                            </label>
                            <input
                                type="text"
                                value={formData.techStack}
                                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                                placeholder="React, Tailwind, Node.js"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-800 transition-colors"
                            />
                        </div>

                        {/* URLs Header */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Live URL</label>
                                <input
                                    type="url"
                                    value={formData.liveUrl}
                                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-800 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Repo URL</label>
                                <input
                                    type="url"
                                    value={formData.repoUrl}
                                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                                    placeholder="https://github.com/..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-800 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL or Upload</label>

                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                placeholder="https://source.unsplash.com/..."
                                className="w-full px-4 py-2.5 mb-3 rounded-lg border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-800 transition-colors"
                            />

                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <UploadCloud size={20} className="text-gray-500" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Click to upload or drag & drop</p>
                                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Slide-over Form Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/80 shrink-0 sticky bottom-0">
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => setIsSlideOverOpen(false)}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-black transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={isSaving}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                            onClick={handleSaveProject}
                        >
                            {isSaving ? "Saving..." : "Save Project"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Component for Sidebar Items
function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full text-left gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                ? "bg-gray-100/80 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
        >
            <span className={active ? "text-gray-900" : "text-gray-400"}>{icon}</span>
            {label}
        </button>
    );
}
