"use client";

import { Book } from "lucide-react";

const PlanetCard = ({ subject, onClick, index = 0, orbitRadius = 200, orbitDuration = 20 }) => {
    // Distribute planets from 120° to 420° (lower half of the circle)
    const total = subject.total;
    const startAngle = 120; // degrees
    const endAngle = 420; // degrees
    const angle = startAngle + (index / (total - 1 || 1)) * (endAngle - startAngle); // degrees
    const animationName = `orbit-${index}`;
    // Add keyframes for this planet's orbit
    if (typeof window !== 'undefined') {
        const styleId = `orbit-style-${index}`;
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `@keyframes ${animationName} { from { transform: rotate(${angle}deg); } to { transform: rotate(${angle + 360}deg); } }`;
            document.head.appendChild(style);
        }
    }
    // Slow down the orbit drastically
    const slowOrbitDuration = orbitDuration * 3;
    return (
        <div
            style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 0,
                height: 0,
                zIndex: 20,
                pointerEvents: 'none',
                animation: `${animationName} ${slowOrbitDuration}s linear infinite`,
                transformOrigin: '0 0',
            }}
        >
            {/* Orbit ring is rendered in Dashboard */}
            <div
                onClick={onClick}
                className="group cursor-pointer flex flex-col items-center justify-center"
                style={{
                    position: 'absolute',
                    left: `${orbitRadius}px`,
                    top: '0',
                    pointerEvents: 'auto',
                    transform: `translate(-50%, -50%)`, // No rotation for label
                }}
            >
                {/* Planet sphere */}
                <div
                    className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${subject.color} shadow-2xl group-hover:shadow-space-accent/40 transition-all duration-500 flex items-center justify-center overflow-hidden animate-spin-slow`}
                    style={{
                        boxShadow: `0 0 30px 8px rgba(139, 92, 246, 0.25), 0 0 0 8px rgba(255,255,255,0.05)`
                    }}
                >
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-full bg-white/10 blur-xl opacity-60" />
                    {/* Icon */}
                    <div className="relative z-10 animate-bounce-gentle">
                        <Book className="w-8 h-8 text-white/90 drop-shadow-lg" />
                    </div>
                    {/* Surface features */}
                    <div className="absolute top-3 left-4 w-3 h-3 bg-white/20 rounded-full blur-sm" />
                    <div className="absolute bottom-4 right-3 w-2 h-2 bg-white/30 rounded-full blur-sm" />
                    <div className="absolute top-1/2 left-2 w-1 h-1 bg-white/40 rounded-full" />
                    <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/25 rounded-full" />
                </div>
                {/* Subject name below planet, always upright */}
                <div className="mt-3 text-center select-none">
                    <span className="block text-white font-bold text-base group-hover:text-space-accent transition-colors">
                        {subject.name}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PlanetCard; 