"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Upload, User, Search, Sun as SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PlanetCard from "./PlanetCard";
import UploadNotes from "./UploadNotes";
import SubjectDetail from "./SubjectDetail";
import { supabase } from "@/lib/supabaseClient";

const PLANET_COLORS = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-green-400 to-green-600",
    "from-red-400 to-red-600",
    "from-pink-400 to-pink-600",
    "from-yellow-400 to-yellow-600",
    "from-indigo-400 to-indigo-600",
    "from-cyan-400 to-cyan-600",
];

const Dashboard = ({ onLogout }) => {
    const [subjects, setSubjects] = useState([]);

    const [currentView, setCurrentView] = useState("dashboard");
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newPlanetName, setNewPlanetName] = useState("");

    const [particles, setParticles] = useState([]);
    const [stars, setStars] = useState([]);

    useEffect(() => {
        setParticles(Array.from({ length: 25 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 12}s`,
        })));
        setStars(Array.from({ length: 200 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 4}s`,
        })));
    }, []);

    useEffect(() => {
        // Fetch planets for the logged-in user
        const fetchPlanets = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data, error } = await supabase
                .from("planets")
                .select("*")
                .eq("user_id", user.id);
            if (!error) setSubjects(data || []);
        };
        fetchPlanets();
    }, []);

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
        setCurrentView("subject");
    };

    const handleCreateSubject = () => {
        setShowAddModal(true);
    };

    const handleAddPlanet = async () => {
        if (!newPlanetName.trim()) return;
        const color = PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)];
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await supabase
            .from("planets")
            .insert({
                user_id: user.id,
                name: newPlanetName,
                color,
            });
        // Fetch updated planets list
        const { data, error } = await supabase
            .from("planets")
            .select("*")
            .eq("user_id", user.id);
        if (!error) setSubjects(data || []);
        setShowAddModal(false);
        setNewPlanetName("");
    };

    // For orbit animation, pass total to each subject
    const subjectsWithTotal = filteredSubjects.map(s => ({ ...s, total: filteredSubjects.length }));

    if (currentView === "upload") {
        return <UploadNotes onBack={() => setCurrentView("dashboard")} />;
    }

    if (currentView === "subject" && selectedSubject) {
        return (
            <SubjectDetail
                subject={selectedSubject}
                onBack={() => setCurrentView("dashboard")}
            />
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated background with multiple layers */}
            <div className="fixed inset-0 z-0">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-space-deep via-space-dark to-space-deep animate-gradient-shift" />

                {/* Floating cosmic particles */}
                <div className="cosmic-particles">
                    {particles.map((style, i) => (
                        <div key={i} className="cosmic-particle" style={style} />
                    ))}
                </div>

                {/* Animated nebula effects */}
                <div className="nebula-bg">
                    <div className="nebula nebula-1 animate-nebula-float" />
                    <div className="nebula nebula-2 animate-nebula-float-delayed" />
                    <div className="nebula nebula-3 animate-nebula-pulse" />
                </div>
            </div>

            {/* Animated background stars */}
            <div className="stars">
                {stars.map((style, i) => (
                    <div key={i} className="star" style={style} />
                ))}
            </div>

            {/* Header */}
            <header className="relative z-10 p-6 border-b border-white/10 backdrop-blur-sm bg-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-space-accent to-space-bright flex items-center justify-center animate-float">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-space-star to-space-nebula animate-spin-slow" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-space-bright to-space-star bg-clip-text text-transparent">
                            LearnSphere
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                            <Input
                                placeholder="Search subjects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 w-64"
                            />
                        </div>
                        <Button
                            onClick={() => setCurrentView("upload")}
                            className="cosmic-button"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Notes
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={onLogout}
                            className="text-white hover:bg-white/10"
                        >
                            <User className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center">
                        <h2 className="text-4xl font-bold text-white mb-2">Your Learning Universe</h2>
                        <p className="text-space-bright/70 text-lg">Navigate through your knowledge planets in the cosmic learning space</p>
                    </div>
                    {/* Solar System Orbit Layout */}
                    <div className="relative flex items-center justify-center min-h-[600px] mb-8">
                        {/* Central sun with custom SVG and glow */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full flex items-center justify-center z-20">
                            {/* Glowing background */}
                            <div className="absolute inset-0 rounded-full bg-yellow-300 opacity-30 blur-2xl animate-ping" />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-400 opacity-80 blur-lg" />
                            {/* Custom SVG sun with rays */}
                            <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                                <circle cx="80" cy="80" r="38" fill="url(#sun-gradient)" />
                                {/* Rays */}
                                {[...Array(12)].map((_, i) => {
                                    const angle = (i / 12) * 2 * Math.PI;
                                    const x1 = 80 + Math.cos(angle) * 50;
                                    const y1 = 80 + Math.sin(angle) * 50;
                                    const x2 = 80 + Math.cos(angle) * 70;
                                    const y2 = 80 + Math.sin(angle) * 70;
                                    return (
                                        <line
                                            key={i}
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke="#FDE68A"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            opacity="0.7"
                                        />
                                    );
                                })}
                                <defs>
                                    <radialGradient id="sun-gradient" cx="0" cy="0" r="1" gradientTransform="translate(80 80) scale(38)" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FFFDE4" />
                                        <stop offset="1" stopColor="#FDBA74" />
                                    </radialGradient>
                                </defs>
                            </svg>
                        </div>
                        {/* Orbit lines */}
                        {subjectsWithTotal.map((subject, index) => (
                            <div
                                key={"orbit-" + subject.id}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{
                                    width: `${(220 + index * 40) * 2}px`,
                                    height: `${(220 + index * 40) * 2}px`,
                                    borderRadius: '50%',
                                    border: '2px dashed rgba(255,255,255,0.13)',
                                    zIndex: 5,
                                }}
                            />
                        ))}
                        {/* Animated Planets */}
                        {subjectsWithTotal.map((subject, index) => (
                            <PlanetCard
                                key={subject.id}
                                subject={subject}
                                onClick={() => handleSubjectClick(subject)}
                                index={index}
                                orbitRadius={220 + index * 40}
                                orbitDuration={18 + index * 2}
                            />
                        ))}
                    </div>
                    {/* Fallback grid for mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8 md:hidden">
                        {filteredSubjects.map((subject, index) => (
                            <PlanetCard
                                key={subject.id}
                                subject={subject}
                                onClick={() => handleSubjectClick(subject)}
                                index={index}
                                orbitRadius={0}
                                orbitDuration={0}
                            />
                        ))}
                    </div>
                    {/* Floating Add Planet Button */}
                    <button
                        onClick={handleCreateSubject}
                        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-red-400 to-yellow-400 shadow-2xl border-4 border-white/20 flex items-center justify-center hover:scale-110 transition-transform group"
                        style={{ boxShadow: '0 0 40px 10px rgba(251,191,36,0.3)' }}
                        aria-label="Add New Planet"
                    >
                        <span className="text-3xl text-white font-bold drop-shadow-lg">+</span>
                    </button>
                    {/* Add Planet Modal */}
                    {showAddModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                            <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-xs flex flex-col items-center">
                                <h3 className="text-xl font-bold mb-4 text-space-accent">Name your new planet</h3>
                                <input
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-space-accent mb-4"
                                    placeholder="Planet name..."
                                    value={newPlanetName}
                                    onChange={e => setNewPlanetName(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-4 w-full">
                                    <button
                                        className="flex-1 py-2 rounded-lg bg-space-accent text-white font-bold hover:bg-space-bright transition-colors"
                                        onClick={handleAddPlanet}
                                    >
                                        Add
                                    </button>
                                    <button
                                        className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard; 