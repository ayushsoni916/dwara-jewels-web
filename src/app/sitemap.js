
const BASE_URL = 'https://dwarajewels.in';

export default function sitemap() {
    const pages = [
        '',
        '/about',
        '/terms-and-conditions',
        '/warranty-policy',
        '/return-and-exchange-policy',
        '/cancellation-policy',
        '/gemstone-policy',
        '/privacy',
        '/faq',
        '/category',
    ];

    return pages.map(path => ({
        url: `${BASE_URL}${path}`,
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.7,
    }));
}
