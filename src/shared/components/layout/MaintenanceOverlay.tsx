"use client";

import React, { useEffect } from "react";
import { useSettings } from "@features/settings/useSettings";
import { SETTINGS_FALLBACKS } from "@features/settings/settingsService";
import { normalizeImageUrl } from "@shared/utils/imageUrl";
import Image from "next/image";
import { Hammer } from "lucide-react";

export const MaintenanceOverlay = () => {
    const { data: settings = SETTINGS_FALLBACKS } = useSettings();
    const isEnabled = settings.maintenance_mode === "true";

    useEffect(() => {
        if (isEnabled) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isEnabled]);

    if (!isEnabled) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Background Image if exists */}
            {settings.auth_bg_url && (
                <div className="absolute inset-0 z-[-1] opacity-5">
                    <Image 
                        src={normalizeImageUrl(settings.auth_bg_url)} 
                        alt="Background" 
                        fill 
                        className="object-cover" 
                    />
                </div>
            )}

            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-bounce overflow-hidden">
                {settings.maintenance_icon_url ? (
                    <div className="relative w-16 h-16">
                        <Image 
                            src={normalizeImageUrl(settings.maintenance_icon_url)} 
                            alt="Maintenance" 
                            fill 
                            className="object-contain" 
                        />
                    </div>
                ) : (
                    <Hammer className="w-12 h-12 text-primary" />
                )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tighter">
                Situs Sedang Diperbarui
            </h1>
            
            <p className="text-gray-600 max-w-md mx-auto mb-8 leading-relaxed font-medium">
                Kami sedang melakukan pemeliharaan rutin untuk meningkatkan pengalaman belanja Anda. 
                Kami akan segera kembali!
            </p>

            <div className="mt-12 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] leading-none opacity-50">
                {settings.store_name || "PE Skin Pro"}
            </div>
        </div>
    );
};
