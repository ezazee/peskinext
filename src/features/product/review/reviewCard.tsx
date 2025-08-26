import type { Review } from "@shared/types/types";
import Image from "next/image";
import { IoStar } from "react-icons/io5";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);

  if (isNaN(then.getTime())) return "";

  const yDiff = now.getFullYear() - then.getFullYear();
  const mDiff = now.getMonth() - then.getMonth();
  let months = yDiff * 12 + mDiff;

  if (now.getDate() < then.getDate()) months -= 1;

  if (months >= 12) return "Lebih dari 1 tahun lalu";
  if (months >= 1) return `${months} bulan lalu`;

  // kalau kurang dari 1 bulan, pakai hari
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.max(
    1,
    Math.floor((now.getTime() - then.getTime()) / msPerDay)
  );
  if (days >= 7) {
    const weeks = Math.floor(days / 7);
    return `${weeks} minggu lalu`;
  }
  return `${days} hari lalu`;
}

export const ReviewCard = ({ review }: { review: Review }) => (
  <div className="border-b py-4">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        {/* Bintang sesuai rating */}
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
        <span className="text-xs text-subtle-text">{timeAgo(review.date)}</span>
      </div>
      <button className="text-subtle-text" aria-label="Opsi ulasan">
        ...
      </button>
    </div>

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

    {review.image && (
      <div className="mt-2">
        <Image
          src={review.image}
          alt="Ulasan produk"
          width={80}
          height={80}
          className="rounded-lg"
        />
      </div>
    )}
  </div>
);
