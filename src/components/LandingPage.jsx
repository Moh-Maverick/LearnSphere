"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Brain, Sparkles, Users } from "lucide-react";

const LandingPage = ({ onGetStarted }) => {
    const [particles, setParticles] = useState([]);
    const [stars, setStars] = useState([]);

    useEffect(() => {
        setParticles(Array.from({ length: 20 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 12}s`,
        })));
        setStars(Array.from({ length: 100 }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 4}s`,
        })));
    }, []);

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

            {/* Hero Section */}
            <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Logo */}
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-space-accent to-space-bright mb-8 animate-float">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-space-star to-space-nebula animate-spin-slow" />
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-space-bright via-space-star to-space-nebula bg-clip-text text-transparent animate-text-shimmer">
                            LearnSphere
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-space-bright/80 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Explore the universe of knowledge with AI-powered learning tools.
                        Transform your notes into an interactive cosmic experience.
                    </p>

                    {/* CTA Button */}
                    <Button
                        onClick={onGetStarted}
                        className="cosmic-button text-lg px-8 py-4 mb-16 group animate-pulse-glow"
                    >
                        Start Your Journey
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform animate-bounce-gentle">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Smart Organization</h3>
                            <p className="text-space-bright/70">
                                Organize your subjects as planets in your personal learning universe
                            </p>
                        </div>

                        <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform animate-bounce-gentle">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">AI-Powered Tools</h3>
                            <p className="text-space-bright/70">
                                Get personalized tutoring, quizzes, and summaries powered by AI
                            </p>
                        </div>

                        <div className="glass-card p-6 text-center group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform animate-bounce-gentle">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Interactive Learning</h3>
                            <p className="text-space-bright/70">
                                Transform static notes into dynamic, engaging learning experiences
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage; 