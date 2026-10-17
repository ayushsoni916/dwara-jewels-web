'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RecentlyViewed() {
    const [recentProducts, setRecentProducts] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Ensures safe client-side execution (prevents hydration mismatch)

        try {
            const stored = localStorage.getItem('recentlyViewed');
            if (stored) {
                setRecentProducts(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error reading recently viewed products:", error);
        }
    }, []);

    // 1. Return null during server-side render
    if (!isMounted) return null;

    // 2. If the user hasn't viewed anything yet, hide the entire section
    if (recentProducts.length === 0) return null;

    return (
        <section className="bg-white py-12 lg:py-20 px-4 sm:px-6 lg:px-20 overflow-hidden mt-16 md:mt-24 lg:mt-[100px]">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-8 lg:mb-12">
                    <span className="text-[#BF8F5F] font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-3 block">
                        RECENTLY VIEWED
                    </span>
                    <h2 className="text-[#222222] font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
                        Pieces That Caught Your Eye
                    </h2>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                            Revisit the pieces you loved and find the perfect sparkle to make yours.
                        </p>

                        {/* Carousel Dots */}
                        {/* <div className="flex items-center gap-1.5 shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors"></div>
                            <div className="w-6 h-1.5 rounded-full bg-[#BF8F5F] cursor-pointer"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors"></div>
                        </div> */}
                    </div>
                </div>

                {/* Product Grid Area */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
                    {recentProducts.map((product) => {
                        const currency = product.price?.currency === 'USD' ? '$' : 'Rs. ';

                        const finalPrice = Number(product.price?.finalPrice);
                        const comparePrice = Number(product.price?.compareAtPrice);

                        const hasDiscount =
                            product.price?.finalPrice != null &&
                            product.price?.compareAtPrice != null &&
                            Number.isFinite(finalPrice) &&
                            Number.isFinite(comparePrice) &&
                            comparePrice > finalPrice;

                        return (
                            <div key={product._id} className="group cursor-pointer flex flex-col">

                                {/* Image Container with SEO Link */}
                                <div className="relative aspect-square bg-[#FCF6F2] mb-4 overflow-hidden rounded-sm">
                                    <Link href={`/product/${product._id}`} className="w-full h-full relative block">
                                        <Image
                                            src={product.thumbnail || (product.images && product.images[0]) || "/placeholder.webp"}
                                            alt={product.title}
                                            fill
                                            className="object-cover p-0 transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </Link>
                                </div>

                                {/* Product Info (Preserving your exact layout & icon positions) */}
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <Link href={`/product/${product._id}`} className="hover:text-[#BF8F5F] transition-colors">
                                        <h3 className="text-[#222222] font-bold text-xs sm:text-sm leading-tight line-clamp-1">
                                            {product.title}
                                        </h3>
                                    </Link>

                                    {/* Quick Action Icons next to title */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button aria-label="Wishlist">
                                            <Image
                                                src="/icons/Heart.svg"
                                                alt="Wishlist"
                                                width={16}
                                                height={16}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 hover:opacity-50 transition-opacity"
                                            />
                                        </button>
                                        <button aria-label="Cart">
                                            <Image
                                                src="/icons/Cart.svg"
                                                alt="Add to Cart"
                                                width={16}
                                                height={16}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 hover:opacity-50 transition-opacity"
                                            />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-500 text-[10px] sm:text-xs mb-3 capitalize">
                                    {product.subCategory || 'Exquisite Design'}
                                </p>


                                <div className="flex flex-wrap items-center gap-2 mt-auto">
                                    {hasDiscount && (
                                        <span className="text-gray-400 font-normal line-through text-[10px] sm:text-xs">
                                            {currency}{comparePrice.toLocaleString('en-IN')}
                                        </span>
                                    )}

                                    <span className="text-[#222222] font-bold text-xs sm:text-sm">
                                        {Number.isFinite(finalPrice) && product.price?.finalPrice != null
                                            ? `${currency}${finalPrice.toLocaleString('en-IN')}`
                                            : '—'}
                                    </span>
                                </div>


                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}