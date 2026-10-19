import { notFound } from 'next/navigation';
import Image from 'next/image';
import LuxeProductHeader from '@/app/(shop)/components/Luxe/LuxeProductHeader';
import LuxeProductGallery from '@/app/(shop)/components/Luxe/LuxeProductGallery';
import LuxeRecentlyViewed from '@/app/(shop)/components/Luxe/LuxeRecentlyViewed';
import LuxeProductAccordions from '@/app/(shop)/components/Luxe/LuxeProductAccordions';
import { cache } from 'react';
import serverClient from '../../../../api/serverClient';
import { fetchProductDetailApi } from '../../../../api/productApi';
import RecentlyViewedTracker from '@/app/(shop)/components/RecentlyViewedTracker';

// --- Server-Side Data Fetching ---
const getProduct = cache(async (id) => {
    if (!/^[a-f\d]{24}$/i.test(id)) return null;

    try {
        const data = await fetchProductDetailApi(id, serverClient);
        return data?.product || null;
    } catch (error) {
        if (error.status === 404) return null;

        throw error;
    }
});

// --- Dynamic SEO Metadata ---
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.id);

    if (!product) {
        return {
            title: 'Product Not Found | Luxe Dwara Jewels',
            description: 'The requested luxury piece could not be found.'
        };
    }

    const imageUrl = product.thumbnail || (product.images && product.images[0]) || '/placeholder.webp';

    return {
        title: `${product.title} | Luxe Collection | Dwara Jewels`,
        description: product.description || `Discover the exquisite ${product.title}.`,
        openGraph: {
            title: `${product.title} | Luxe Dwara Jewels`,
            images: [{ url: imageUrl, width: 800, height: 800 }],
        }
    };
}

// --- Main Page Component ---
export default async function LuxeProductPage({ params }) {
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.id);

    if (!product) {
        notFound();
    }

    return (
        <main
            className="relative min-h-screen w-full flex flex-col selection:bg-[#E5D3C4] selection:text-black overflow-hidden"
            style={{ background: 'radial-gradient(69.72% 78.08% at 47.07% 0%, #1F2A40 0%, #0C0E17 100%)' }}
        >
            <RecentlyViewedTracker product={product} />
            {/* Starry Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60">
                <Image
                    src="/images/Background.png"
                    alt="Luxury Starry Background"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Change this line: */}
            <section className="relative z-10 pt-32 lg:pt-44 pb-16 lg:pb-24 px-6 lg:px-20 mx-auto max-w-7xl w-full">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

                    {/* Left Side: Product Info */}
                    <div className="w-full lg:w-1/2 flex flex-col order-2 lg:order-1">
                        <LuxeProductHeader product={product} />
                        <LuxeProductAccordions product={product} />
                    </div>

                    {/* Right Side: Image Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6 order-1 lg:order-2">
                        <LuxeProductGallery images={product.images || []} thumbnail={product.thumbnail} />
                    </div>

                </div>
            </section>

            {/* Bottom Gradient Border Line before Recommendations */}
            <div className="relative z-20 h-[2px] w-full bg-gradient-to-r from-transparent via-[#F2DFCE] to-transparent mb-10" />

            <div className="relative z-10">
                <LuxeRecentlyViewed />
            </div>

        </main>
    );
}