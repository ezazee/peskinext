import {
  HomeIcon,
  FeedIcon,
  PromoIcon,
  TransactionIcon,
  AccountIcon,
} from '../components/icons'; 

// --- INTERFACES & TYPES ---
export interface Category {
  name: string;
  img: string;
}

export interface Product {
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  img: string;
  desktopOnly?: boolean;
}

export interface NavItem {
  name: string;
  icon: React.ComponentType<{ active?: boolean }>;
  active?: boolean;
}


// --- DATA MOCKS ---

export const desktopCategoriesData: Category[] = [
  { name: 'Makan Kerang', img: 'https://placehold.co/80x80/f87171/ffffff?text=Kerang' },
  { name: 'Figure', img: 'https://placehold.co/80x80/60a5fa/ffffff?text=Figure' },
  { name: 'Tas Selempang Pria', img: 'https://placehold.co/80x80/c084fc/ffffff?text=Tas' },
  { name: 'Flat Shoes Wanita', img: 'https://placehold.co/80x80/fbbf24/ffffff?text=Sepatu' },
];

export const mobileCategoriesData: Category[] = [
  { name: 'Promo Hari Ini', img: 'https://placehold.co/80x80/ef4444/ffffff?text=Promo' },
  { name: 'Top-Up & Tagihan', img: 'https://placehold.co/80x80/3b82f6/ffffff?text=TopUp' },
  { name: 'Mall', img: 'https://placehold.co/80x80/8b5cf6/ffffff?text=Mall' },
  { name: 'Fashion', img: 'https://placehold.co/80x80/f97316/ffffff?text=Fashion' },
  { name: 'Beauty', img: 'https://placehold.co/80x80/ec4899/ffffff?text=Beauty' },
  { name: 'Tokopedia Farma', img: 'https://placehold.co/80x80/10b981/ffffff?text=Farma' },
  { name: 'Lihat Semua', img: 'https://placehold.co/80x80/6b7280/ffffff?text=...' },
];

export const productsData: Product[] = [
  { name: 'BEAUTY HAUL-SOME STARS', price: 'Rp54.000', oldPrice: 'Rp150.000', discount: '64%', img: 'https://placehold.co/200x200/f472b6/ffffff?text=Beauty+1' },
  { name: 'SUNCO Minyak Goreng 2L', price: 'Rp29.000', img: 'https://placehold.co/200x200/f59e0b/ffffff?text=Sunco' },
  { name: 'SWEETY Silver Pants L-30', price: 'Rp50.555', oldPrice: 'Rp54.616', discount: '7%', img: 'https://placehold.co/200x200/38bdf8/ffffff?text=Sweety' },
  { name: 'Kabel Data Type C Fast Charging', price: 'Rp15.000', oldPrice: 'Rp25.000', discount: '17%', img: 'https://placehold.co/200x200/6b7280/ffffff?text=Kabel' },
  { name: 'VIROMAX Speaker Bluetooth', price: 'Rp125.000', img: 'https://placehold.co/200x200/1f2937/ffffff?text=Speaker', desktopOnly: true },
  { name: 'Kemeja Wanita Lengan Panjang', price: 'Rp89.000', img: 'https://placehold.co/200x200/a78bfa/ffffff?text=Kemeja', desktopOnly: true },
];

export const bottomNavItemsData: NavItem[] = [
  { name: 'Home', icon: HomeIcon, active: true },
  { name: 'Feed', icon: FeedIcon },
  { name: 'Promo', icon: PromoIcon },
  { name: 'Transaksi', icon: TransactionIcon },
  { name: 'Akun', icon: AccountIcon },
];