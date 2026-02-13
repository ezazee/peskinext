"use client";

import React, { useState } from "react";
import { Star, X, Loader2, Camera } from "lucide-react";
import { useToast } from "@shared/components/ui/Toaster";
import { uploadReviewImages, submitReview } from "../action";

interface ReviewFormProps {
    orderId: string;
    productName: string;
    productSlug: string;
    productImage: string;
    variantName?: string;
    variantId?: number;
    existingReview?: {
        id: number;
        rating: number;
        comment: string;
        images: string[];
        created_at: string;
    };
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ReviewForm({
    orderId,
    productName,
    productSlug,
    productImage,
    variantName,
    variantId,
    existingReview,
    onSuccess,
    onCancel,
}: ReviewFormProps) {
    const toast = useToast();
    const isViewMode = !!existingReview;
    const [rating, setRating] = useState(existingReview?.rating || 5);
    const [comment, setComment] = useState(existingReview?.comment || "");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>(existingReview?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isViewMode) return;
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const validFiles = newFiles.filter(
                (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
            );

            if (validFiles.length + files.length > 5) {
                toast.error("Maksimal 5 foto");
                return;
            }

            setFiles((prev) => [...prev, ...validFiles]);
            const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number) => {
        if (isViewMode) return;
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewMode) return;
        if (!comment.trim()) {
            toast.error("Tulis ulasan minimal beberapa kata");
            return;
        }

        setIsSubmitting(true);

        try {
            let imageUrls: string[] = [];

            // Upload images using server action
            if (files.length > 0) {
                const formData = new FormData();
                files.forEach((file) => formData.append("files", file));
                formData.append("type", "product");

                const uploadResult = await uploadReviewImages(formData);

                if (!uploadResult.success) {
                    throw new Error(uploadResult.error || "Gagal upload foto");
                }

                imageUrls = uploadResult.urls || [];
            }

            // Submit review using server action
            const reviewResult = await submitReview({
                orderId,
                productSlug,
                variantName,
                variant_id: variantId,
                rating,
                comment,
                images: imageUrls,
            });

            if (!reviewResult.success) {
                throw new Error(reviewResult.error || "Gagal kirim ulasan");
            }

            toast.success("Ulasan berhasil dikirim!");
            onSuccess();
        } catch (err: unknown) {
            console.error(err);
            toast.error((err as Error).message || "Terjadi kesalahan");
        } finally {
            setIsSubmitting(false);
        }
    };

    const ratingTexts = ["Sangat Buruk", "Buruk", "Cukup", "Baik", "Sangat Baik"];

    return (
        <div className="bg-white rounded-xl overflow-hidden max-w-2xl mx-auto">
            {/* Header with Product Info */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 md:p-6">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 flex-1 min-w-0">
                        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                            <img
                                src={productImage}
                                alt={productName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-900">
                                {productName}
                            </h4>
                            {variantName && variantName !== "Default" && (
                                <p className="text-xs text-gray-600 mt-1">
                                    {variantName}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
                {/* Star Rating */}
                <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-900">
                        Penilaian <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => !isViewMode && setRating(star)}
                                    disabled={isViewMode}
                                    className={`transition-all ${isViewMode ? 'cursor-default' : 'hover:scale-110'}`}
                                >
                                    <Star
                                        size={32}
                                        className={`${star <= rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {ratingTexts[rating - 1]}
                        </span>
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">
                        Ulasan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => !isViewMode && setComment(e.target.value)}
                        disabled={isViewMode}
                        placeholder={isViewMode ? "" : "Ceritakan pengalaman Anda dengan produk ini..."}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none disabled:bg-gray-50 disabled:cursor-default"
                        rows={4}
                        maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                        {comment.length}/500 karakter
                    </p>
                </div>

                {/* Photo Upload */}
                <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">
                        Foto Produk {!isViewMode && <span className="text-gray-500 font-normal">(Opsional, maks 5 foto)</span>}
                    </label>

                    {previews.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            {previews.map((preview, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={preview}
                                        alt={`Preview ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {!isViewMode && (
                                        <button
                                            type="button"
                                            onClick={() => removeFile(idx)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {!isViewMode && previews.length < 5 && (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                            <div className="flex flex-col items-center justify-center gap-2 text-gray-500 group-hover:text-primary transition-colors">
                                <Camera size={28} className="text-gray-400 group-hover:text-primary transition-colors" />
                                <p className="text-sm font-medium">Upload Foto</p>
                                <p className="text-xs text-gray-400">PNG, JPG (Max 5MB)</p>
                            </div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all"
                    >
                        {isViewMode ? "Tutup" : "Batal"}
                    </button>
                    {!isViewMode && (
                        <button
                            type="submit"
                            disabled={isSubmitting || !comment.trim()}
                            className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Mengirim...
                                </>
                            ) : (
                                "Kirim Ulasan"
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
