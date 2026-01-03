// src/types/inpost.d.ts
export {};

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "inpost-geowidget": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                token?: string;
                language?: string;
                config?: string;
                onpoint?: string;
            },
                HTMLElement
            >;
        }
    }
}