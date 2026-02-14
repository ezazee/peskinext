import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    currentPage: number;
    totalPages: number;
    baseUrl: string; // e.g. "/blog" or "/blog/tips-skincare"
}

export function BlogPagination({ currentPage, totalPages, baseUrl }: Props) {
    if (totalPages <= 1) return null;

    // Helper to generate URL
    const createPageUrl = (page: number) => {
        const url = new URL(baseUrl, "http://localhost"); // Dummy base for URL construction
        if (page > 1) url.searchParams.set("page", page.toString());
        // If query params exist in baseUrl (e.g. category), they should be preserved. 
        // But baseUrl passed here is likely just the path.
        // If we have category in URL path /blog/category, then baseUrl is /blog/category.
        // So ?page=2 is appended.
        // If baseUrl is /blog?category=xyz, then we need to handle it.
        // Simplified: Just append ?page=N or &page=N

        const separator = baseUrl.includes("?") ? "&" : "?";
        return `${baseUrl}${separator}page=${page}`;
    };

    // Calculate range of pages to show
    const getPageNumbers = () => {
        const pages = [];
        const delta = 2; // Number of pages to show before and after current

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(i);
            } else if (
                i === currentPage - delta - 1 ||
                i === currentPage + delta + 1
            ) {
                pages.push("...");
            }
        }
        // Deduplicate "..." if strictly implementing logic above, 
        // but simplified logic: just push what matches.
        // Let's use a simpler array filter approach for uniqueness? 
        // Actually, let's just use a simple robust logic.

        const range = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) range.push(i);
            return range;
        }

        if (currentPage <= 3) {
            return [1, 2, 3, "...", totalPages];
        }

        if (currentPage >= totalPages - 2) {
            return [1, "...", totalPages - 2, totalPages - 1, totalPages];
        }

        return [1, "...", currentPage, "...", totalPages];
    };

    const pages = getPageNumbers();

    return (
        <div className="flex justify-center items-center gap-1 md:gap-2 mt-8 md:mt-12">
            {/* Previous Button */}
            {currentPage > 1 ? (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
            ) : (
                <span className="p-2 rounded-full border border-gray-100 text-gray-300 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </span>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pages.map((p, i) => (
                    typeof p === "number" ? (
                        <Link
                            key={i}
                            href={createPageUrl(p)}
                            className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-xs md:text-sm font-bold transition-all ${p === currentPage
                                ? "bg-primary text-white shadow-md shadow-primary/30"
                                : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                                }`}
                        >
                            {p}
                        </Link>
                    ) : (
                        <span key={i} className="px-1 md:px-2 text-gray-400 text-xs md:text-sm">...</span>
                    )
                ))}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
            ) : (
                <span className="p-2 rounded-full border border-gray-100 text-gray-300 cursor-not-allowed">
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </span>
            )}
        </div>
    );
}
