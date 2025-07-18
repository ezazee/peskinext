import type { Product } from '../../data/mock';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products }: { products: Product[] }) => (
    <div className="mt-0 md:mt-8 p-4 md:p-0 bg-white">
        <h2 className="text-lg font-bold mb-4">Rekomendasi untuk Anda</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {products.map((prod, index) => (
                <ProductCard key={index} product={prod} />
            ))}
        </div>
    </div>
);
