"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Play, ExternalLink, Loader2 } from "lucide-react";
import type { Banner } from "@shared/types/types";
import { normalizeImageUrl } from "@shared/utils/imageUrl";

interface InstagramPost {
  id: string;
  mediaUrl: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  caption?: string;
  prunedCaption?: string;
}

interface BeholdData {
  posts: InstagramPost[];
}

interface InstagramFeedProps {
  feedUrl?: string;
  fallbackBanners?: Banner[];
}

export function InstagramFeed({ feedUrl, fallbackBanners }: InstagramFeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchFeed() {
      // 1. Prioritize Dashboard Banners if they exist
      if (fallbackBanners && fallbackBanners.length > 0) {
        const mappedBanners = fallbackBanners.map((b, idx) => ({
          id: b.id?.toString() || `fallback-${idx}`,
          mediaUrl: normalizeImageUrl(b.src),
          permalink: b.href || "#",
          mediaType: "IMAGE",
          caption: b.alt,
          isDashboard: true
        }));
        setPosts(mappedBanners);
        setLoading(false);
        return;
      }

      // 2. Try live IG feed if URL is provided
      if (feedUrl && feedUrl.startsWith('http')) {
        try {
          setLoading(true);
          const res = await fetch(feedUrl);
          if (!res.ok) throw new Error("Failed to fetch feed");
          const data: BeholdData = await res.json();
          setPosts(data.posts.map(p => ({
              ...p,
              mediaUrl: (p as any).sizes?.medium?.mediaUrl || p.mediaUrl
          })).slice(0, 10));
          return;
        } catch (err) {
          console.error("IG Feed Fetch Error:", err);
        } finally {
          setLoading(false);
        }
      }

      // 3. ULTIMATE FALLBACK: Static Beautiful Images (Ensures section is NEVER empty)
      const staticFallbacks = [
        { id: 'st-1', mediaUrl: 'https://images.unsplash.com/photo-1596462502278-27bfad45f1f6?q=80&w=600&auto=format&fit=crop', permalink: '#', mediaType: 'IMAGE', caption: 'Nature Precision' },
        { id: 'st-2', mediaUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop', permalink: '#', mediaType: 'IMAGE', caption: 'Daily Routine' },
        { id: 'st-3', mediaUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600&auto=format&fit=crop', permalink: '#', mediaType: 'IMAGE', caption: 'Science of Beauty' },
        { id: 'st-4', mediaUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop', permalink: '#', mediaType: 'IMAGE', caption: 'Skin Health' },
        { id: 'st-5', mediaUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop', permalink: '#', mediaType: 'IMAGE', caption: 'Refined Care' }
      ];
      setPosts(staticFallbacks);
      setLoading(false);
    }

    fetchFeed();
  }, [feedUrl, fallbackBanners]);

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden py-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-40 h-40 md:w-56 md:h-56 shrink-0 bg-gray-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) return null;

  // Duplicate for seamless marquee on desktop
  const marqueePosts = [...posts, ...posts];

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Desktop View: Auto Marquee */}
      <div className="hidden md:block">
        <motion.div 
            className="flex gap-4 w-max"
            animate={{ x: [0, "-50%"] }}
            transition={{ 
                duration: 40,
                ease: "linear", 
                repeat: Infinity 
            }}
            whileHover={{ transition: { duration: 0.2 }, opacity: 1 }}
        >
            <div className="flex gap-4 group">
            {marqueePosts.map((post, idx) => (
                <InstagramCard key={`${post.id}-${idx}`} post={post} />
            ))}
            </div>
        </motion.div>
      </div>

      {/* Mobile View: Natural Horizontal Scroll */}
      <div 
        ref={scrollRef}
        className="md:hidden flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory px-4"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {posts.map((post, idx) => (
          <div key={post.id} className="snap-center shrink-0">
             <InstagramCard post={post} />
          </div>
        ))}
      </div>
      
      {/* Desktop Overlays */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
    </div>
  );
}

function InstagramCard({ post }: { post: any }) {
    return (
        <motion.a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-56 h-56 md:w-64 md:h-64 shrink-0 rounded-3xl overflow-hidden group/item shadow-sm hover:shadow-2xl transition-all duration-500 bg-gray-50 flex-shrink-0 flex items-center justify-center text-center"
            whileHover={{ y: -10 }}
        >
            {post.mediaUrl ? (
                <Image
                    src={post.mediaUrl}
                    alt={post.caption || "Instagram Post"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/item:scale-110"
                    sizes="(max-width: 768px) 224px, 256px"
                />
            ) : (
                <span className="text-[10px] text-gray-300 px-4">PE Community Moment</span>
            )}
            
            <div className="absolute inset-0 bg-secondary/60 opacity-0 group-hover/item:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center">
                <Instagram className="w-8 h-8 text-white mb-3" />
                <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-1">PE Skinpro Community</p>
                <span className="text-white/80 text-[10px] line-clamp-2 font-light">
                    {post.caption || "View on Instagram"}
                </span>
            </div>

            {post.mediaType === "VIDEO" && (
                <div className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-md rounded-full text-white">
                    <Play className="w-3 h-3 fill-current" />
                </div>
            )}
            
            {/* Branding badge for dashboard-sourced items */}
            {post.isDashboard && (
                <div className="absolute top-4 left-4">
                    <div className="px-2 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[8px] font-bold text-white uppercase tracking-tighter">
                        PE Community
                    </div>
                </div>
            )}
        </motion.a>
    );
}
