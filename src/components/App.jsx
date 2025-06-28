"use client";

import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./LandingPage";
import LoginScreen from "./LoginScreen";
import Dashboard from "./Dashboard";

const queryClient = new QueryClient();

const App = () => {
    const [currentView, setCurrentView] = useState("landing");

    const handleGetStarted = () => {
        setCurrentView("login");
    };

    const handleLogin = () => {
        setCurrentView("dashboard");
    };

    const handleLogout = () => {
        setCurrentView("landing");
    };

    const handleBackToLanding = () => {
        setCurrentView("landing");
    };

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                {currentView === "landing" && (
                    <LandingPage onGetStarted={handleGetStarted} />
                )}
                {currentView === "login" && (
                    <LoginScreen onLogin={handleLogin} onBack={handleBackToLanding} />
                )}
                {currentView === "dashboard" && (
                    <Dashboard onLogout={handleLogout} />
                )}
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App; 