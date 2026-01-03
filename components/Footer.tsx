import Link from "next/link";
import { Instagram, Facebook, Mail, MapPin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 text-[#a1a1aa]">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* GŁÓWNY GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* KOLUMNA 1: MARKA & MISJA */}
                    <div className="space-y-6">
                        <Link href="/" className="block">
              <span className="font-display text-3xl font-black tracking-tighter text-white">
                INVSBL
              </span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-xs">
                            Streetwear z przyszłości.
                            Beton, kwas i widoczność.
                            Tworzymy ubrania dla tych, którzy nie chcą zniknąć w tłumie.
                        </p>
                        {/* SOCIAL MEDIA */}
                        <div className="flex gap-4">
                            <SocialLink href="https://instagram.com" icon={<Instagram className="w-5 h-5" />} label="Instagram" />
                            <SocialLink href="https://facebook.com" icon={<Facebook className="w-5 h-5" />} label="Facebook" />
                            {/* TikTok (Custom SVG bo Lucide nie ma) */}
                            <SocialLink href="https://tiktok.com" label="TikTok" icon={
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.55-1.09-.01 1.98-.01 3.96-.01 5.95 0 2.22-.85 4.47-2.42 6.06-1.89 1.92-4.8 2.5-7.3 1.55-1.95-.73-3.46-2.42-3.95-4.43-.53-2.19.16-4.59 1.71-6.17 1.34-1.36 3.28-1.98 5.16-1.63v4.09c-1.3-.39-2.79.16-3.51 1.35-.76 1.25-.43 3.01.76 3.92 1.15.89 2.9.72 3.86-.41.87-1.02.93-2.44.17-3.66 0-3.83.01-7.66.02-11.49-.04-.01-.06-.01-.15-.01z"/></svg>
                            } />
                        </div>
                    </div>

                    {/* KOLUMNA 2: STREFA PRAWNA */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Informacje</h3>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink href="/terms">Regulamin Sklepu</FooterLink></li>
                            <li><FooterLink href="/privacy">Polityka Prywatności</FooterLink></li>
                            <li><FooterLink href="/returns">Zwroty i Reklamacje</FooterLink></li>
                            <li><FooterLink href="/shipping">Czas i koszt dostawy</FooterLink></li>
                            <li><FooterLink href="/contact">Kontakt</FooterLink></li>
                        </ul>
                    </div>

                    {/* KOLUMNA 3: DANE FIRMY (Wymóg Prawny) */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Dane Firmy</h3>
                        <div className="space-y-4 text-sm font-mono text-zinc-500">
                            <p>
                                <strong className="text-zinc-400 block mb-1">INVSBL SP. Z O.O.</strong>
                                ul. Industrialna 44/2<br />
                                00-123 Warszawa
                            </p>
                            <p>
                                <span className="block">NIP: 123-456-78-90</span>
                                <span className="block">REGON: 147258369</span>
                            </p>
                            <div className="flex items-center gap-2 pt-2 text-zinc-300">
                                <Mail className="w-4 h-4" />
                                <a href="mailto:kontakt@invsbl.pl" className="hover:text-acid transition-colors">kontakt@invsbl.pl</a>
                            </div>
                        </div>
                    </div>

                    {/* KOLUMNA 4: PŁATNOŚCI & LOGISTYKA */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Płatności i Dostawa</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Generujemy proste SVG logotypów w skali szarości */}
                            <PaymentBadge label="BLIK" />
                            <PaymentBadge label="VISA" />
                            <PaymentBadge label="MC" />
                            <PaymentBadge label="STRIPE" />
                            <PaymentBadge label="INPOST" />
                        </div>
                        <p className="mt-6 text-xs text-zinc-600">
                            Bezpieczne płatności szyfrowane SSL. Obsługiwane przez Stripe.
                        </p>
                    </div>

                </div>

                {/* DOLNY PASEK */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                    <p>&copy; {new Date().getFullYear()} INVSBL. Wszelkie prawa zastrzeżone.</p>
                    <div className="flex gap-4">
                        <span>Designed by Stanisław Korycki</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}

// --- KOMPONENTY POMOCNICZE (żeby kod był czysty) ---

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-acid transition-colors hover:pl-1 duration-200 block">
            {children}
        </Link>
    );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/5 hover:bg-acid hover:text-black text-white p-2 rounded transition-all duration-300"
            aria-label={label}
        >
            {icon}
        </a>
    );
}

function PaymentBadge({ label }: { label: string }) {
    return (
        <div className="h-10 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[10px] font-bold text-zinc-500 tracking-wider hover:border-zinc-500 transition-colors cursor-default select-none">
            {label}
        </div>
    );
}