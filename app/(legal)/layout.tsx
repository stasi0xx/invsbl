export default function LegalLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
            <div className="prose prose-invert prose-zinc max-w-none">
                {children}
            </div>
        </div>
    );
}