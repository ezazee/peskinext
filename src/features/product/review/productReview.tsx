// File: src/features/product/components/ProductReview.tsx
"use client";

import React from "react";
import { IoStar } from "react-icons/io5";
import { reviewsData } from "@data/review";
import { ReviewCard } from "./reviewCard";

// --- Komponen Utama ---
const ProductReview = () => {
  return (
    // HANYA blok biasa — tidak ada grid/layout baru
    <div className="mt-8 space-y-8">
      {/* Ringkasan Ulasan */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold text-lg mb-4">ULASAN PEMBELI</h3>

        <div className="flex gap-6">
          <div className="w-1/3">
            <div className="flex items-center gap-2">
              <IoStar className="text-yellow-400 text-3xl" />
              <p className="text-4xl font-bold">
                4.7{" "}
                <span className="text-lg text-subtle-text font-normal">
                  / 5.0
                </span>
              </p>
            </div>
            <p className="text-sm font-bold text-primary mt-1">
              92% pembeli merasa puas
            </p>
            <p className="text-xs text-subtle-text">25 rating • 6 ulasan</p>
          </div>

          <div className="w-2/3">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center">
                <IoStar className="text-yellow-400 mr-1" /> 5
              </span>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: "76%" }}
                />
              </div>
              <span className="text-subtle-text">19</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center">
                <IoStar className="text-yellow-400 mr-1" /> 4
              </span>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: "16%" }}
                />
              </div>
              <span className="text-subtle-text">4</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="flex items-center">
                <IoStar className="text-yellow-400 mr-1" /> 3
              </span>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: "8%" }}
                />
              </div>
              <span className="text-subtle-text">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ulasan Pilihan */}
      <div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">ULASAN PILIHAN</h3>
            <p className="text-sm text-subtle-text">
              Menampilkan 6 dari 6 ulasan
            </p>
          </div>
        </div>

        <div className="mt-4">
          {reviewsData.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
