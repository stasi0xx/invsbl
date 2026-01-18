import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://twoja-domena.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/success'], // Nie chcemy indeksować strony sukcesu po zakupie
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}