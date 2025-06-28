"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff, User, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const LoginScreen = ({ onLogin, onBack }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [confirmationMsg, setConfirmationMsg] = useState("");
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setConfirmationMsg("");
        try {
            let result;
            if (isSignUp) {
                result = await supabase.auth.signUp({ email, password });
                if (result.error) throw result.error;
                setConfirmationMsg("Check your email to confirm your account before logging in.");
            } else {
                result = await supabase.auth.signInWithPassword({ email, password });
                if (result.error) throw result.error;
                onLogin && onLogin();
            }
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setError(err.message || "Authentication failed");
        }
    };

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
                </div>
            </div>

            {/* Animated background stars */}
            <div className="stars">
                {stars.map((style, i) => (
                    <div key={i} className="star" style={style} />
                ))}
            </div>

            {/* Back Button */}
            <div className="relative z-10 p-6">
                <Button
                    onClick={onBack}
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
            </div>

            {/* Login Form */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-space-accent to-space-bright mb-6 animate-float">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-space-star to-space-nebula animate-spin-slow" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-space-bright/70">Enter your credentials to continue your journey</p>
                    </div>

                    {/* Login Form */}
                    <div className="glass-card p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Email</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        className="rounded border-white/20 bg-white/10 text-space-accent focus:ring-space-accent"
                                    />
                                    <span className="text-sm text-white/70">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-space-bright hover:text-space-accent transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                            {confirmationMsg && <div className="text-green-400 text-sm text-center">{confirmationMsg}</div>}

                            <Button
                                type="submit"
                                className="w-full cosmic-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Signing in...
                                    </div>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-white/70">
                                {isSignUp ? (
                                    <>Already have an account?{' '}
                                        <button type="button" onClick={() => setIsSignUp(false)} className="text-space-bright hover:text-space-accent transition-colors font-medium">Sign in</button>
                                    </>
                                ) : (
                                    <>Don't have an account?{' '}
                                        <button type="button" onClick={() => setIsSignUp(true)} className="text-space-bright hover:text-space-accent transition-colors font-medium">Sign up</button>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;