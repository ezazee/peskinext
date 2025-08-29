"use client";
import { useState } from "react";
import type { Review } from "@shared/types/types";
import Image from "next/image";
import { IoStar } from "react-icons/io5";
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

export const ReviewCard = ({ review }: { review: Review }) => {
  const [open, setOpen] = useState<{ show: boolean; index: number }>({
    show: false,
    index: 0,
  });

  return (
    <div className="border-b py-4">
      {/* Rating & date */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <IoStar
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
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-subtle-text">
          {review.user.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-base-text">{review.user}</p>
          <p className="text-xs text-subtle-text">Varian: {review.variant}</p>
        </div>
      </div>

      <p className="mt-3 text-base-text">{review.comment}</p>

      {/* Thumbnails */}
      {review.images.length > 0 && (
        <div className="mt-2 flex gap-2 flex-wrap">
          {review.images.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt={`Foto ulasan ${i + 1}`}
              width={80}
              height={80}
              className="rounded-lg cursor-pointer object-cover"
              onClick={() => setOpen({ show: true, index: i })}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {open.show && (
        <Lightbox
          images={review.images}
          startIndex={open.index}
          onClose={() => setOpen({ show: false, index: 0 })}
        />
      )}
    </div>
  );
};
