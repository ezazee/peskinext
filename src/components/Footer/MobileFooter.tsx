import Image from 'next/image';
import type { NavItem } from '../../data/mock';

export const MobileFooter = ({ navItems }: { navItems: NavItem[] }) => (
    <>
        <div className="md:hidden fixed bottom-16 left-0 right-0 p-3 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.05)] flex items-center justify-between gap-4 z-40">
            <button className="text-2xl text-secondary">&times;</button>
            <div className="flex items-center gap-2">
                <Image src="https://placehold.co/40x40/1D9AD2/FFFFFF?text=App" alt="App Icon" width={40} height={40} className="rounded-lg"/>
                <div>
                    <p className="text-sm font-semibold">Belanja di aplikasi</p>
                    <p className="text-xs text-secondary">Gratis ongkir & kupon diskon!</p>
                </div>
            </div>
            <a href="#" className="bg-primary text-white font-bold text-sm px-6 py-2 rounded-lg">
                Buka
            </a>
        </div>
        <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-1 z-50">
            {navItems.map(item => (
                <a key={item.name} href="#" className="flex flex-col items-center p-2 rounded-lg hover:bg-tertiary">
                    <item.icon active={item.active} />
                    <span className={`text-xs mt-1 ${item.active ? 'text-primary font-semibold' : 'text-secondary'}`}>
                        {item.name}
                    </span>
                </a>
            ))}
        </footer>
        <div className="h-36 md:hidden"></div> {/* Spacer */}
    </>
);