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
                            Tworzymy ubrania dla tych, którzy nie chcą zniknąć w tłumie.
                        </p>
                        {/* SOCIAL MEDIA */}
                        <div className="flex gap-4">
                            <SocialLink href="https://www.instagram.com/invsbl/" icon={<Instagram className="w-5 h-5" />} label="Instagram" />
                            <SocialLink href="https://www.facebook.com/invsbll" icon={<Facebook className="w-5 h-5" />} label="Facebook" />
                            {/* TikTok (Custom SVG bo Lucide nie ma) */}

                        </div>
                    </div>

                    {/* KOLUMNA 2: STREFA PRAWNA */}
                    <div>
                        <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Informacje</h3>
                        <ul className="space-y-3 text-sm">
                            <li><FooterLink href="/regulamin">Regulamin Sklepu</FooterLink></li>
                            <li><FooterLink href="/polityka-prywatnosci">Polityka Prywatności</FooterLink></li>
                            <li><FooterLink href="/zwroty">Zwroty i Reklamacje</FooterLink></li>
                            <li><FooterLink href="/dostawa">Czas i koszt dostawy</FooterLink></li>
                            <li><FooterLink href="/kontakt">Kontakt</FooterLink></li>
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