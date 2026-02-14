// Review Entity Types

/**
 * Product review
 */
export interface Review {
    id: number;
    user: string;
    variant: string;
    comment: string;
    images: string[];
    rating: number;
    date: string;
    productSlug: string;
}
