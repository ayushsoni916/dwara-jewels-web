'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../../context/AuthContext';
import {
    fetchWishlistApi,
    toggleWishlistApi,
} from '../../../api/wishlistApi';

export default function RecentlyViewed() {
    const [recentProducts, setRecentProducts] = useState([]);
    const [isMounted, setIsMounted] = useState(false);


    const router = useRouter();
    const { isLoggedIn, loading: authLoading } = useAuth();

    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [busyIds, setBusyIds] = useState([]);
    const [wishlistError, setWishlistError] = useState('');

    useEffect(() => {
        if (authLoading || !isLoggedIn) {
            setWishlistedIds([]);
            return;
        }

        let active = true;

        fetchWishlistApi()
            .then(response => {
                if (active && response.success) {
                    setWishlistedIds(
                        (response.products || []).map(product =>
                            String(product._id)
                        )
                    );
                }
            })
            .catch(error => {
                console.error('Wishlist fetch failed:', error);
            });

        return () => {
            active = false;
        };
    }, [isLoggedIn, authLoading]);

    const handleWishlist = async productId => {
        const id = String(productId);

        if (busyIds.includes(id) || authLoading) return;

        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        const wasWishlisted = wishlistedIds.includes(id);

        // Instant heart update
        setWishlistedIds(previous =>
            wasWishlisted
                ? previous.filter(item => item !== id)
                : [...previous, id]
        );

        setBusyIds(previous => [...previous, id]);
        setWishlistError('');

        try {
            const response = await toggleWishlistApi(productId);

            if (!response.success) {
                throw new Error(
                    response.error || 'Unable to update wishlist.'
                );
            }

            setWishlistedIds(previous =>
                response.isWishlisted
                    ? [...new Set([...previous, id])]
                    : previous.filter(item => item !== id)
            );

        } catch (error) {
            // Roll back only this product
            setWishlistedIds(previous =>
                wasWishlisted
                    ? [...new Set([...previous, id])]
                    : previous.filter(item => item !== id)
            );

            if (error.status === 401) {
                router.push('/login');
                return;
            }

            setWishlistError(
                error.message || 'Unable to update wishlist.'
            );
        } finally {
            setBusyIds(previous =>
                previous.filter(item => item !== id)
            );
        }
    };



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
            {wishlistError && (
                <p role="alert" className="text-center text-sm text-red-500 mb-3">
                    {wishlistError}
                </p>
            )}
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


                                </div>

                                <p className="text-gray-500 text-[10px] sm:text-xs mb-3 capitalize">
                                    {product.subCategory || 'Exquisite Design'}
                                </p>



                                {/* Price + Wishlist */}
                                <div className="flex items-center justify-between gap-2 mt-auto">

                                    <div className="flex flex-wrap items-center gap-2 min-w-0">
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

                                    <button
                                        type="button"
                                        onClick={() => handleWishlist(product._id)}
                                        disabled={busyIds.includes(String(product._id)) || authLoading}
                                        aria-label={
                                            wishlistedIds.includes(String(product._id))
                                                ? 'Remove from Wishlist'
                                                : 'Add to Wishlist'
                                        }
                                        aria-pressed={wishlistedIds.includes(String(product._id))}
                                        className="shrink-0 text-[#BF8F5F] hover:text-[#222222] transition-colors"
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill={
                                                wishlistedIds.includes(String(product._id))
                                                    ? 'currentColor'
                                                    : 'none'
                                            }
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="transition-all duration-200"
                                        >
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </button>
                                </div>



                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}