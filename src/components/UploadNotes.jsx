"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, File, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const UploadNotes = ({ onBack }) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [planets, setPlanets] = useState([]);
    const [selectedPlanetId, setSelectedPlanetId] = useState("");
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [stars, setStars] = useState([]);

    useEffect(() => {
        setStars(Array.from({ length: 50 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
        })));
        // Fetch user's planets
        const fetchPlanets = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            console.log("Frontend user.id:", user.id);
            if (!user) return;
            const { data, error } = await supabase
                .from("planets")
                .select("*")
                .eq("user_id", user.id);
            if (!error) setPlanets(data || []);
        };
        fetchPlanets();
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        setUploading(true);
        setUploadError("");
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error("Not logged in");
            const planet = planets.find(p => p.id === selectedPlanetId);
            if (!planet) throw new Error("Please select a planet");
            const token = (await supabase.auth.getSession()).data.session.access_token;
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("planet_id", planet.id);
                const res = await fetch(`${BACKEND_URL}/notes`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });
                if (!res.ok) {
                    const contentType = res.headers.get("content-type");
                    let errMsg = "Upload failed";
                    if (contentType && contentType.includes("application/json")) {
                        const err = await res.json();
                        errMsg = err.error || errMsg;
                    } else {
                        errMsg = await res.text();
                    }
                    throw new Error(errMsg);
                }
            }
            setUploading(false);
            setFiles([]);
            setSelectedPlanetId("");
            onBack();
        } catch (err) {
            setUploading(false);
            setUploadError(err.message || "Upload failed");
        }
    };

    return (
        <div className="min-h-screen p-6">
            {/* Animated background stars */}
            <div className="stars">
                {stars.map((star, index) => (
                    <div
                        key={index}
                        className="star"
                        style={{
                            left: star.left,
                            top: star.top,
                            animationDelay: star.animationDelay,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-8">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="text-space-bright hover:bg-white/10 mb-4"
                    >
                        ← Back to Dashboard
                    </Button>

                    <h1 className="text-3xl font-bold text-white mb-2">Upload Your Notes</h1>
                    <p className="text-space-bright/70">Add knowledge to your learning universe</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Upload Area */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-white">Upload Files</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <select
                                    value={selectedPlanetId}
                                    onChange={e => setSelectedPlanetId(e.target.value)}
                                    className="bg-space-dark border border-space-accent/30 text-white placeholder:text-space-bright/60 w-full rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-space-accent transition-all duration-200 text-base shadow-md"
                                    style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', colorScheme: 'dark' }}
                                >
                                    <option value="" className="bg-space-dark text-space-bright/60">Select a planet...</option>
                                    {planets.map(planet => (
                                        <option key={planet.id} value={planet.id} className="bg-space-dark text-white hover:bg-space-accent/20">{planet.name}</option>
                                    ))}
                                </select>

                                <div
                                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive
                                        ? "border-space-accent bg-space-accent/10"
                                        : "border-white/20 hover:border-space-accent/50"
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <Upload className="w-12 h-12 text-space-accent mx-auto mb-4" />
                                    <p className="text-white mb-2">
                                        Drag and drop your files here, or{" "}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-space-accent hover:text-space-bright underline"
                                        >
                                            browse
                                        </button>
                                    </p>
                                    <p className="text-space-bright/60 text-sm">
                                        Supports PDF, TXT, DOC, and DOCX files
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept=".pdf,.txt,.doc,.docx"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Files List */}
                    <Card className="glass-card">
                        <CardHeader>
                            <CardTitle className="text-white">Selected Files</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {files.length === 0 ? (
                                <p className="text-space-bright/60 text-center py-8">
                                    No files selected yet
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {files.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <File className="w-5 h-5 text-space-accent" />
                                                <div>
                                                    <p className="text-white text-sm font-medium">{file.name}</p>
                                                    <p className="text-space-bright/60 text-xs">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFile(index)}
                                                className="text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {files.length > 0 && (
                                <Button
                                    onClick={handleUpload}
                                    disabled={!selectedPlanetId}
                                    className="w-full mt-6 cosmic-button"
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Upload to {selectedPlanetId ? planets.find(p => p.id === selectedPlanetId)?.name : "Planet"}
                                </Button>
                            )}

                            {uploadError && <div className="text-red-400 text-sm text-center mt-2">{uploadError}</div>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UploadNotes; 