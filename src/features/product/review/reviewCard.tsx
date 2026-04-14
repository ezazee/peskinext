"use client";
import { useState } from "react";
import type { Review } from "@shared/types/types";
import Image from "next/image";
import { Star } from "lucide-react";
import Lightbox from "@shared/components/ui/Lightbox";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  if (isNaN(then.getTime())) return "";
  const diff = now.getTime() - then.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days >= 365) return "Lebih dari 1 tahun lalu";
  if (days >= 30) return `${Math.floor(days / 30)} bulan lalu`;
  if (days >= 7) return `${Math.floor(days / 7)} minggu lalu`;
  return `${days} hari lalu`;
}

// Helper to fix localhost image URLs in production
const sanitizeImageUrl = (url: string) => {
  if (!url) return "";
  
  // Handle relative paths from backend
  if (url.startsWith("/uploads/")) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    return `${baseUrl}${url}`;
  }

  if (url.includes("127.0.0.1") || url.includes("localhost")) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.peskinpro.id";
    // Replace origin (http://127.0.0.1:5000) with API URL
    return url.replace(/^(?:https?:\/\/)?(?:127\.0\.0\.1|localhost)(?::\d+)?/, apiUrl);
  }
  return url;
};

const isVideo = (url: string) => {
  return url.match(/\.(mp4|webm|ogg|mov)$/i);
};

export const ReviewCard = ({ review }: { review: Review }) => {
  const [open, setOpen] = useState<{ show: boolean; index: number }>({
    show: false,
    index: 0,
  });

  const sanitizedImages = review.images.map(sanitizeImageUrl);

  return (
    <div className="border-b py-4">
      {/* Rating & date */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={
                  i < review.rating ? "text-yellow-400" : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-xs text-subtle-text">
            {timeAgo(review.date)}
          </span>
        </div>
        <button className="text-subtle-text" aria-label="Opsi ulasan">
          …
        </button>
      </div>

      {/* User */}
      <div className="flex items-center gap-2 mt-2">
        {review.userImage ? (
          <div className="w-8 h-8 rounded-full overflow-hidden border bg-gray-50">
            <Image
              src={sanitizeImageUrl(review.userImage)}
              alt={review.user}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-subtle-text">
            {review.user.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-bold text-base-text">{review.user}</p>
          <p className="text-xs text-subtle-text">Varian: {review.variant}</p>
        </div>
      </div>

      <p className="mt-3 text-base-text">{review.comment}</p>

      {/* Thumbnails */}
      {sanitizedImages.length > 0 && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {sanitizedImages.map((img, i) => {
            const video = isVideo(img);
            return (
              <div 
                key={i} 
                className="relative cursor-pointer rounded-lg overflow-hidden border bg-gray-50 flex items-center justify-center w-[80px] h-[80px]"
                onClick={() => setOpen({ show: true, index: i })}
              >
                {video ? (
                  <video 
                    src={img} 
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={img}
                    alt={`Foto ulasan ${i + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                )}
                {video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Lightbox */}
      {open.show && (
        <Lightbox
          images={sanitizedImages}
          startIndex={open.index}
          onClose={() => setOpen({ show: false, index: 0 })}
        />
      )}
    </div>
  );
};
