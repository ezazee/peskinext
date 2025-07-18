import Image from 'next/image';
import type { Product } from '../../data/mock';

export const ProductCard = ({ product }: { product: Product }) => (
    <div className={`bg-white rounded-lg border md:shadow-md overflow-hidden ${product.desktopOnly ? 'hidden md:block' : ''}`}>
        <Image src={product.img} alt={product.name} width={200} height={200} className="w-full h-32 md:h-40 object-cover"/>
        <div className="p-2 md:p-3">
            <h3 className="text-sm font-normal text-gray-800 truncate">{product.name}</h3>
            <p className="text-base font-bold mt-1">{product.price}</p>
            {product.oldPrice && (
                <div className="flex items-center gap-2 mt-1">
                    {product.discount && <span className="text-xs font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded-md">{product.discount}</span>}
                    <p className="text-xs text-gray-500 line-through">{product.oldPrice}</p>
                </div>
            )}
        </div>
    </div>
);
