import type { Review } from "@shared/types/types";
import Image from "next/image";
import { IoStar } from "react-icons/io5";

export const ReviewCard = ({ review }: { review: Review }) => (
  <div className="border-b py-4">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <IoStar key={i} />
          ))}
        </div>
        <span className="text-xs text-subtle-text">
          Lebih dari 1 tahun lalu
        </span>
      </div>
      <button className="text-subtle-text">...</button>
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
