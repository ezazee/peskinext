import type { Category } from '@shared/types/types';
import Image from 'next/image';

interface Props {
  desktopCategories: Category[];
  mobileCategories: Category[];
}

export const CategorySection = ({ desktopCategories, mobileCategories }: Props) => (
    <>
        {/* Desktop */}
        <div className="hidden md:flex gap-6 mb-6">
            <div className="w-1/2 bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Kategori Pilihan</h2>
                    <a href="#" className="text-sm font-bold text-green-600">Lihat Semua</a>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {desktopCategories.map((cat, i) => (
                        <a href="#" key={i} className="flex flex-col items-center text-center gap-2 hover:bg-gray-50 p-2 rounded-lg">
                            <Image src={cat.img} alt={cat.name} width={80} height={80} className="w-full object-cover rounded-lg border"/>
                            <span className="text-xs text-gray-600">{cat.name}</span>
                        </a>
                    ))}
                </div>
            </div>
            <div className="w-1/2 bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Top Up & Tagihan</h2>
                    <a href="#" className="text-sm font-bold text-green-600">Lihat Semua</a>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg h-32 flex items-center justify-center">
                    <p className="text-gray-400">Widget Top Up & Tagihan</p>
                </div>
            </div>
        </div>
        {/* Mobile */}
        <div className="md:hidden bg-white p-4">
            <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center">
                {mobileCategories.map((cat, index) => (
                    <a key={index} href="#" className="flex flex-col items-center gap-2">
                        <Image src={cat.img} alt={cat.name} width={80} height={80} className="w-12 h-12 object-cover"/>
                        <span className="text-xs font-medium text-gray-700">{cat.name}</span>
                    </a>
                ))}
            </div>
        </div>
    </>
);