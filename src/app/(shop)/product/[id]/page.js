import { cache } from 'react';
import { notFound } from 'next/navigation';

import serverClient from '../../../api/serverClient';
import { fetchProductDetailApi } from '../../../api/productApi';

import FaqInsight from '../../components/Home/FaqInsight';
import RecentlyViewed from '../../components/Home/RecentlyViewed';
import RecentlyViewedTracker from '../../components/RecentlyViewedTracker';
import ProductDetails from '../components/ProductDetails';
import ProductGallery from '../components/ProductGallery';

const getProduct = cache(async (id) => {
    if (!/^[a-f\d]{24}$/i.test(id)) return null;

    try {
        const data = await fetchProductDetailApi(id, serverClient);
        return data.product || null;
    } catch (error) {
        if (error.status === 404) return null;

        throw error;
    }
});

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found | Dwara Jewels',
            description: 'The requested jewelry piece could not be found.',
        };
    }

    const imageUrl =
        product.thumbnail ||
        product.images?.[0] ||
        '/placeholder.webp';

    return {
        title: `${product.title} | Dwara Jewels`,
        description:
            product.description ||
            `Discover the exquisite ${product.title}.`,
        openGraph: {
            title: `${product.title} | Dwara Jewels`,
            images: [{ url: imageUrl, width: 800, height: 800 }],
        },
    };
}

export default async function ProductPage({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <main className="bg-white overflow-hidden">
            <RecentlyViewedTracker product={product} />

            <section className="py-12 lg:py-20 px-4 sm:px-8 lg:px-20 mx-auto max-w-[1440px]">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    <div className="w-full lg:w-1/2 flex flex-col order-2 lg:order-1">
                        <ProductDetails
                            key={product._id}
                            product={product}
                        />
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6 order-1 lg:order-2">
                        <ProductGallery
                            images={product.images || []}
                            thumbnail={product.thumbnail}
                        />
                    </div>
                </div>
            </section>

            <RecentlyViewed />
            <FaqInsight />
        </main>
    );
}