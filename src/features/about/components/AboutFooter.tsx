
import Link from 'next/link';

export const AboutFooter = () => {
    return (
        <footer className="bg-gray-900 text-white border-t border-gray-800 py-12 font-sans mt-auto">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                    <div className="max-w-md">
                        <h3 className="text-xl font-bold mb-4">PE Skin Professional</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Brand skincare modern dengan teknologi Jerman dan bahan natural vegan. Aman, efektif, dan terpercaya.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Placeholders */}
                            <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-primary transition-colors flex items-center justify-center cursor-pointer">
                                <span className="text-xs">IG</span>
                            </div>
                            <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-primary transition-colors flex items-center justify-center cursor-pointer">
                                <span className="text-xs">FB</span>
                            </div>
                            <div className="w-8 h-8 bg-gray-800 rounded-full hover:bg-primary transition-colors flex items-center justify-center cursor-pointer">
                                <span className="text-xs">TT</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:gap-16">
                        <div>
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-300">Explore</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                                <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                                <li><Link href="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray-300">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} PE Skin Professional. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
