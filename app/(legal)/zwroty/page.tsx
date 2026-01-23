export default function ZwrotyPage() {
    return (
        <div className="space-y-6 text-zinc-300 font-light text-sm leading-relaxed">
            <h1 className="text-3xl text-white font-display font-bold uppercase mb-8">Zwroty i Reklamacje</h1>

            <div className="p-4 border border-white/10 bg-white/5 rounded">
                <p className="font-bold text-white mb-2">ADRES DO ZWROTÓW:</p>
                <p>WeUnite Jan Hofman</p>
                <p>ul. Gdyńska G lok. 9</p>
                <p>80-340 Gdańsk</p>
                <p>Z dopiskiem: "ZWROT INVSBL"</p>
            </div>

            <h3 className="text-white font-bold mt-4">Czas na zwrot</h3>
            <p>Masz <strong>30 dni</strong> od momentu otrzymania paczki na zwrot towaru bez podania przyczyny. Produkt nie może nosić śladów użytkowania, musi posiadać oryginalne metki i opakowanie.</p>

            <h3 className="text-white font-bold mt-4">Jak dokonać zwrotu?</h3>
            <ul className="list-disc pl-5 space-y-1">
                <li>Zapakuj produkt bezpiecznie.</li>
                <li>Dołącz formularz zwrotu (kartka z numerem zamówienia i numerem konta do zwrotu).</li>
                <li>Wyślij paczkę na powyższy adres.</li>
            </ul>
            <p>Zwrot środków nastąpi w ciągu 14 dni od otrzymania przez nas paczki.</p>
        </div>
    );
}