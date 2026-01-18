import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/product';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://twoja-domena.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const productUrls = PRODUCTS.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...productUrls,
    ];
}