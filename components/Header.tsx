import Link from "next/link";
import { Instagram, Facebook } from "lucide-react"; // Upewnij się, że masz te ikony, lub usuń import jeśli nie używasz

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-4 md:px-8 mt-auto">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">

                {/* 1. BRAND */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-display font-black text-white tracking-tighter uppercase">
                        INVSBL
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
                        Heavyweight streetwear designed in Poland.
                        Est. 202. Quality over quantity.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Media Linki (przykładowe) */}
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* 2. SKLEP */}
                <div className="space-y-4">
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Sklep</h4>
                    <ul className="space-y-2 text-sm text-zinc-500">
                        <li><Link href="/" className="hover:text-acid transition-colors">Wszystkie produkty</Link></li>
                        <li><Link href="/product/invisible-script-hoodie" className="hover:text-acid transition-colors">Hoodies</Link></li>
                        <li><Link href="/product/invisible-script-sweatpants" className="hover:text-acid transition-colors">Pants</Link></li>
                    </ul>
                </div>

                {/* 3. POMOC & INFO (Zaktualizowane linki prawne) */}
                <div className="space-y-4">
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Info</h4>
                    <ul className="space-y-2 text-sm text-zinc-500">
                        <li><Link href="/dostawa" className="hover:text-acid transition-colors">Dostawa i Płatność</Link></li>
                        <li><Link href="/zwroty" className="hover:text-acid transition-colors">Zwroty i Reklamacje</Link></li>
                        <li><Link href="/regulamin" className="hover:text-acid transition-colors">Regulamin</Link></li>
                        <li><Link href="/polityka-prywatnosci" className="hover:text-acid transition-colors">Polityka Prywatności</Link></li>
                        <li><Link href="/kontakt" className="hover:text-acid transition-colors">Kontakt</Link></li>
                    </ul>
                </div>

                {/* 4. DANE FIRMOWE (Twoje dane) */}
                <div className="space-y-4">
                    <h4 className="font-bold text-white uppercase tracking-wider text-sm">Dane Firmowe</h4>
                    <div className="space-y-1 text-sm text-zinc-500 font-light">
                        <p className="text-white font-medium mb-2">WeUnite Jan Hofman</p>
                        <p>ul. Gdyńska G lok. 9</p>
                        <p>80-340 Gdańsk</p>

                        <div className="pt-4 mt-4 border-t border-white/10 space-y-1">
                            <p className="flex justify-between max-w-[200px]">
                                <span>NIP:</span>
                                <span className="font-mono text-zinc-400">5842877195</span>
                            </p>
                            <p className="flex justify-between max-w-[200px]">
                                <span>REGON:</span>
                                <span className="font-mono text-zinc-400">543312986</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* COPYRIGHT */}
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 uppercase tracking-widest">
                <p>&copy; {new Date().getFullYear()} INVSBL WORLDWIDE. All rights reserved.</p>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> SYSTEMS OPERATIONAL</span>
                </div>
            </div>
        </footer>
    );
}