"use client";

import { useState, useEffect } from "react";
import { settingsService, type GeneralSettings, SETTINGS_FALLBACKS } from "@features/settings/settingsService";
import { X } from "lucide-react";

export const AnnouncementBar = () => {
    const [settings, setSettings] = useState<GeneralSettings>(SETTINGS_FALLBACKS);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        async function loadSettings() {
            try {
                const data = await settingsService.getSettings();
                setSettings(data);
            } catch (error) {
                console.warn("Failed to load settings:", error);
                // Fail silently, use fallbacks already in state
            }
        }
        loadSettings();
    }, []);

    if (!isVisible || settings.announcement_active !== "true" || !settings.announcement_text) {
        return null;
    }

    return (
        <div className="bg-primary text-white py-2 px-4 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
                <p className="text-xs md:text-sm font-medium tracking-wide animate-pulse">
                    {settings.announcement_text}
                </p>
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
            {/* Glossy overlay effect for premium look */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        </div>
    );
};
