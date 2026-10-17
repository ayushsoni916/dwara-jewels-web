
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProductApi } from '../../../api/productApi';

const ENGAGEMENT_COLLECTION_ID = '6acd0c40b2210243220ab67d';

const COLLECTION_LINK =
    `/category?collectionId=${ENGAGEMENT_COLLECTION_ID}`;

export default function NewArrivalWithCollection() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let active = true;

        const loadEngagementProducts = async () => {
            try {
                const data = await fetchProductApi({
                    collection: ENGAGEMENT_COLLECTION_ID,
                });

                if (active) {
                    setProducts(data?.products || []);
                }
            } catch (error) {
                console.error('Engagement products error:', error);

                if (active) {
                    setProducts([]);
                }
            }
        };

        loadEngagementProducts();

        return () => {
            active = false;
        };
    }, []);

    const collectionImg = '/images/NewArrival.webp';

    if (!products.length) return null;

    return (
        <section className="horizontal-padding mt-16 md:mt-24 lg:mt-50.5 flex flex-col lg:grid lg:grid-cols-[3fr_1fr] gap-6">

            {/* Left Side: Engagement Products */}
            <div className="w-full min-w-0">

                {/* Header Section */}
                <div>
                    <h2 className="text-[#BF8F5F] heading-tag uppercase">
                        Engagement Collection
                    </h2>

                    <h1 className="heading-main">
                        A Promise of Forever
                    </h1>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-2 gap-4">
                        <p className="heading-des text-gray-500">
                            Celebrate your forever with timeless jewellery,
                            thoughtfully crafted for life's most beautiful
                            promises.
                        </p>

                        <Link
                            href={COLLECTION_LINK}
                            className="text-[#BF8F5F] text-sm font-medium whitespace-nowrap hover:text-[#222222] transition-colors"
                        >
                            Explore More →
                        </Link>
                    </div>
                </div>

                {/* Product Grid - Maximum 6 Products */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 lg:mt-10">
                    {products.slice(0, 6).map((product) => {
                        const finalPrice = Number(
                            product.price?.finalPrice
                        );

                        const comparePrice = Number(
                            product.price?.compareAtPrice
                        );

                        const hasDiscount =
                            product.price?.finalPrice != null &&
                            product.price?.compareAtPrice != null &&
                            Number.isFinite(finalPrice) &&
                            Number.isFinite(comparePrice) &&
                            comparePrice > finalPrice;

                        const currency =
                            product.price?.currency === 'USD'
                                ? '$'
                                : 'Rs. ';

                        return (
                            <div
                                key={product._id}
                                className="group flex flex-col h-full relative min-w-0"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square bg-[#FCF6F2] mb-4 overflow-hidden rounded-none flex items-center justify-center">

                                    <Link
                                        href={`/product/${product._id}`}
                                        className="w-full h-full relative block z-0"
                                    >
                                        <Image
                                            src={
                                                product.thumbnail ||
                                                product.images?.[0] ||
                                                '/placeholder.webp'
                                            }
                                            alt={product.title}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </Link>

                                    {/* Quick Action Icons */}
                                    <div className="absolute bottom-4 left-0 right-0 hidden lg:flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">

                                        <button
                                            type="button"
                                            aria-label="Add to Wishlist"
                                            className="bg-white p-2.5 shadow-sm hover:bg-[#BF8F5F] transition-colors rounded-none pointer-events-auto"
                                        >
                                            <Image
                                                src="/icons/Heart.svg"
                                                alt=""
                                                width={18}
                                                height={18}
                                            />
                                        </button>

                                        <button
                                            type="button"
                                            aria-label="Add to Cart"
                                            className="bg-white p-2.5 shadow-sm hover:bg-[#BF8F5F] transition-colors rounded-none pointer-events-auto"
                                        >
                                            <Image
                                                src="/icons/Cart.svg"
                                                alt=""
                                                width={18}
                                                height={18}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Product Title */}
                                <Link
                                    href={`/product/${product._id}`}
                                    className="hover:text-[#BF8F5F] transition-colors inline-block w-fit"
                                >
                                    <h3 className="text-[#222222] font-bold text-xs sm:text-sm leading-tight mb-1 line-clamp-2">
                                        {product.title}
                                    </h3>
                                </Link>

                                {/* Metal Details */}
                                {product.metal?.type && (
                                    <p className="text-gray-500 text-[10px] sm:text-xs mb-2 capitalize">
                                        {product.metal?.color}{' '}
                                        {product.metal?.type}{' '}
                                        {product.metal?.quality}
                                    </p>
                                )}

                                {/* Price */}
                                <div className="flex flex-wrap items-center gap-2 mt-auto">

                                    {hasDiscount && (
                                        <span className="text-gray-400 line-through text-[10px] sm:text-xs">
                                            {currency}
                                            {comparePrice.toLocaleString('en-IN')}
                                        </span>
                                    )}

                                    <span className="text-[#BF8F5F] font-bold text-xs sm:text-sm">
                                        {product.price?.finalPrice != null &&
                                        Number.isFinite(finalPrice)
                                            ? `${currency}${finalPrice.toLocaleString('en-IN')}`
                                            : '—'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Side: Engagement Collection Banner */}
            <Link
                href={COLLECTION_LINK}
                className="relative hidden lg:block w-full lg:h-auto lg:min-h-[600px] overflow-hidden rounded-none mt-0 group"
            >
                <Image
                    src={collectionImg}
                    alt="Dwara Jewels Engagement Collection"
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

                {/* Top Label */}
                <div className="absolute top-8 left-8 flex items-center gap-4 z-10">
                    <span className="text-white text-xs tracking-[0.2em] uppercase font-medium">
                        Engagement Collection
                    </span>
                    <div className="w-px h-4 bg-white/50" />
                </div>

                {/* Bottom Text */}
                <div className="absolute bottom-10 left-8 right-8 flex flex-col items-start text-white z-10">

                    <h3 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">
                        A Promise of Forever
                    </h3>

                    <p className="text-white/90 text-sm leading-relaxed mb-8 max-w-xs font-light">
                        Discover exquisite jewellery designed to celebrate
                        love, commitment, and every beautiful beginning.
                    </p>

                    {/* Explore Link */}
                    <div className="flex items-center gap-3 text-sm font-bold group-hover:text-[#BF8F5F] transition-colors">
                        Explore Collection

                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform group-hover:translate-x-2"
                        >
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <polyline points="14 6 20 12 14 18" />
                        </svg>
                    </div>
                </div>
            </Link>
        </section>
    );
}
