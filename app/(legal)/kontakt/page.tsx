import { Mail } from "lucide-react";

export default function KontaktPage() {
    return (
        <div className="space-y-8 text-zinc-300 font-light text-sm leading-relaxed">
            <h1 className="text-3xl text-white font-display font-bold uppercase mb-8">Kontakt</h1>

            <p>Masz pytania dotyczące zamówienia, rozmiarówki lub współpracy? Pisz śmiało.</p>

            <div className="flex items-center gap-4 p-6 border border-white/10 rounded bg-white/5">
                <div className="w-12 h-12 bg-acid/10 flex items-center justify-center rounded-full text-acid">
                    <Mail className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest">Email Support</p>
                    <a href="mailto:info@weunite.pl" className="text-xl text-white font-display hover:text-acid transition-colors">
                        info@weunite.pl
                    </a>
                    <p className="text-xs text-zinc-500 mt-1">Odpowiadamy w ciągu 24h</p>
                </div>
            </div>

            <div className="pt-8 border-t border-white/10">
                <p className="text-zinc-500 text-xs uppercase mb-2">Dane rejestrowe:</p>
                <p>WeUnite Jan Hofman</p>
                <p>ul. Gdyńska G lok. 9 80-340 Gdańsk</p>
                <p>NIP: 5842877195</p>
            </div>
        </div>
    );
}