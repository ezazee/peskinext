"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Play, ExternalLink, Loader2 } from "lucide-react";

interface InstagramPost {
  id: string;
  mediaUrl: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  caption?: string;
  prunedCaption?: string;
  sizes?: {
    medium: { mediaUrl: string };
    large: { mediaUrl: string };
  };
}

interface BeholdData {
  posts: InstagramPost[];
}

export function InstagramFeed({ feedUrl }: { feedUrl?: string }) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchFeed() {
      if (!feedUrl) return;
      
      try {
        setLoading(true);
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error("Failed to fetch feed");
        const data: BeholdData = await res.json();
        // Take first 10 posts as requested by user
        setPosts(data.posts.slice(0, 10));
      } catch (err) {
        console.error("IG Feed Fetch Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchFeed();
  }, [feedUrl]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
            <Instagram className="w-8 h-8 text-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className="py-10 text-center text-subtle-text italic">
        Unable to load live feed. Visit our Instagram @peskinproid for more.
      </div>
    );
  }

  // Duplicate posts for seamless marquee
  const marqueePosts = [...posts, ...posts];

  return (
    <div className="relative w-full overflow-hidden py-4">
      <motion.div 
        className="flex gap-4 w-max"
        animate={{ 
          x: [0, "-50%"] 
        }}
        transition={{ 
          duration: 60, // Slower for 10 items
          ease: "linear", 
          repeat: Infinity 
        }}
        whileHover={{ transition: { duration: 0 }, opacity: 1 }}
        style={{ x: 0 }}
      >
        <div className="flex gap-4 group">
           {marqueePosts.map((post, idx) => (
            <motion.a
              key={`${post.id}-${idx}`}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-2xl overflow-hidden group/item hover:shadow-2xl transition-all duration-500"
              whileHover={{ 
                scale: 1.05,
                zIndex: 10
              }}
            >
              <style jsx global>{`
                .group:hover {
                  animation-play-state: paused !important;
                }
              `}</style>
              
              <Image
                src={post.sizes?.medium?.mediaUrl || post.mediaUrl}
                alt={post.prunedCaption || "Instagram Post"}
                fill
                className="object-cover"
              />
              
              <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover/item:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                   <Instagram className="w-8 h-8 text-white scale-75 group-hover/item:scale-100 transition-transform" />
                   <span className="text-white text-[10px] uppercase font-bold tracking-widest">
                      View Post
                   </span>
                </div>
              </div>

              {post.mediaType === "VIDEO" && (
                <div className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              )}
            </motion.a>
          ))}
        </div>
      </motion.div>
      
      {/* Gradient Fade Overlays */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />
    </div>
  );
}
