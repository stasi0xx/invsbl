export default function PolitykaPage() {
    return (
        <div className="space-y-6 text-zinc-300 font-light text-sm leading-relaxed">
            <h1 className="text-3xl text-white font-display font-bold uppercase mb-8">Polityka Prywatności</h1>

            <p>Szanujemy Twoją prywatność. Poniżej znajdziesz informacje o tym, jak przetwarzamy Twoje dane.</p>

            <h3 className="text-white font-bold mt-4">1. Administrator Danych</h3>
            <p>Administratorem Twoich danych osobowych jest WeUnite Jan Hofman. Kontakt: info@weunite.pl.</p>

            <h3 className="text-white font-bold mt-4">2. Cel przetwarzania</h3>
            <p>Dane zbieramy wyłącznie w celu realizacji zamówienia (wysyłka, płatność, kontakt w sprawie zamówienia). Nie sprzedajemy Twoich danych nikomu.</p>

            <h3 className="text-white font-bold mt-4">3. Stripe & Płatności</h3>
            <p>Dane płatnicze są przetwarzane bezpośrednio przez operatora płatności Stripe. My jako sklep nie mamy dostępu do Twojego pełnego numeru karty.</p>

            <h3 className="text-white font-bold mt-4">4. Cookies</h3>
            <p>Używamy plików cookies w celu analizy ruchu (Microsoft Clarity) oraz utrzymania sesji koszyka.</p>
        </div>
    );
}