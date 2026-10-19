
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { fetchNewArrivalApi } from '../../../api/productApi';
import { fetchWishlistApi, toggleWishlistApi } from '../../../api/wishlistApi';
import { useAuth } from '../../../../../context/AuthContext';

export default function LuxeTrendingProducts() {
    const router = useRouter();
    const { isLoggedIn, loading: authLoading } = useAuth();

    const [products, setProducts] = useState([]);
    const [wishlistedIds, setWishlistedIds] = useState([]);
    const [busyId, setBusyId] = useState(null);
    const [error, setError] = useState('');

    // Fetch Luxe New Arrivals
    useEffect(() => {
        let active = true;

        fetchNewArrivalApi(true)
            .then(data => {
                if (active) {
                    setProducts((data?.products || []).slice(0, 4));
                }
            })
            .catch(err => {
                console.error('Luxe New Arrivals error:', err);
                if (active) setProducts([]);
            });

        return () => {
            active = false;
        };
    }, []);

    // Fetch wishlist ONCE, not once per product
    useEffect(() => {
        if (authLoading || !isLoggedIn) {
            setWishlistedIds([]);
            return;
        }

        let active = true;

        fetchWishlistApi()
            .then(res => {
                if (active && res.success) {
                    setWishlistedIds(
                        (res.products || []).map(p => String(p._id))
                    );
                }
            })
            .catch(err => console.error('Wishlist fetch failed:', err));

        return () => {
            active = false;
        };
    }, [isLoggedIn, authLoading]);

    const handleWishlist = async productId => {
        if (busyId || authLoading) return;

        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        const id = String(productId);
        const wasWishlisted = wishlistedIds.includes(id);

        setBusyId(id);
        setError('');

        // Instant heart update
        setWishlistedIds(previous =>
            wasWishlisted
                ? previous.filter(item => item !== id)
                : [...previous, id]
        );

        try {
            const res = await toggleWishlistApi(productId);

            if (!res.success) {
                throw new Error(res.error || 'Wishlist update failed');
            }

            setWishlistedIds(previous =>
                res.isWishlisted
                    ? [...new Set([...previous, id])]
                    : previous.filter(item => item !== id)
            );
        } catch (err) {
            // Restore previous state
            setWishlistedIds(previous =>
                wasWishlisted
                    ? [...new Set([...previous, id])]
                    : previous.filter(item => item !== id)
            );

            if (err.status === 401) {
                router.push('/login');
            } else {
                setError(err.message || 'Unable to update wishlist');
            }
        } finally {
            setBusyId(null);
        }
    };

    if (products.length === 0) return null;

    return (
        <section className="relative w-full py-16 md:py-44 px-6 lg:px-20 overflow-hidden bg-transparent">

            {/* Left Glow Background */}
            <div className="absolute inset-y-0 left-0 w-full md:w-[60%] z-0 pointer-events-none opacity-60 mix-blend-screen">
                <Image
                    src="/images/LeftGlow.webp"
                    alt=""
                    fill
                    className="object-cover object-left"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <span className="text-[#D6B693] font-sans font-semibold text-[13px] lg:text-[14px] uppercase tracking-[0.2em] block mb-2">
                        NEW ARRIVALS
                    </span>

                    <h2 className="font-serif font-normal text-white text-[32px] sm:text-[40px] leading-tight mb-2">
                        Beauty At Its Finest
                    </h2>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <p className="text-white/50 font-sans text-sm max-w-xl">
                            Discover the latest additions to Dwara Luxe.
                            Timeless elegance, exquisite craftsmanship,
                            and extraordinary designs.
                        </p>

                        <Link
                            href="/luxe/category?isNewArrival=true&isLuxe=true"
                            className="shrink-0 text-[#D6B693] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Explore More →
                        </Link>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="mb-4 text-sm text-red-300">
                        {error}
                    </p>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map(product => {
                        const currency =
                            product.price?.currency === 'USD' ? '$' : 'Rs. ';

                        const finalPrice = Number(product.price?.finalPrice);
                        const comparePrice = Number(product.price?.compareAtPrice);

                        const hasDiscount =
                            product.price?.finalPrice != null &&
                            product.price?.compareAtPrice != null &&
                            Number.isFinite(finalPrice) &&
                            Number.isFinite(comparePrice) &&
                            comparePrice > finalPrice;

                        const discount = hasDiscount
                            ? Math.round(
                                ((comparePrice - finalPrice) / comparePrice) * 100
                            )
                            : 0;

                        const outOfStock = Array.isArray(product.dimensions)
                            ? !product.dimensions.some(
                                option => Number(option.stock) > 0
                            )
                            : product.totalStock != null &&
                              Number(product.totalStock) <= 0;

                        const selected = wishlistedIds.includes(
                            String(product._id)
                        );

                        return (
                            <div
                                key={product._id}
                                className="group flex flex-col h-full relative"
                            >
                                {/* Image with Luxe Gradient Border */}
                                <div className="relative aspect-[373/281] w-full mb-4 bg-gradient-to-b from-[#D6B693] to-transparent p-[0.5px]">
                                    <div className="relative w-full h-full bg-[#0C0E17] overflow-hidden flex items-center justify-center">

                                        {/* Discount or New Badge */}
                                        {hasDiscount ? (
                                            <span className="absolute top-3 left-3 bg-[#D6B693] text-[#0C0E17] font-bold text-[10px] px-2 py-1 z-10 tracking-wider pointer-events-none">
                                                -{discount}%
                                            </span>
                                        ) : (
                                            <span className="absolute top-3 left-3 bg-[#D6B693] text-[#0C0E17] font-bold text-[10px] px-2 py-1 z-10 tracking-wider pointer-events-none">
                                                NEW
                                            </span>
                                        )}

                                        <Link
                                            href={`/luxe/product/${product._id}`}
                                            className="w-full h-full relative block"
                                        >
                                            <Image
                                                src={
                                                    product.thumbnail ||
                                                    product.images?.[0] ||
                                                    '/placeholder.webp'
                                                }
                                                alt={product.title}
                                                fill
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                            />
                                        </Link>

                                        {/* Out of Stock */}
                                        {outOfStock && (
                                            <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/75 py-2 text-center pointer-events-none">
                                                <span className="text-white text-[10px] tracking-widest">
                                                    OUT OF STOCK
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="flex flex-col flex-grow">
                                    <div className="flex justify-between items-start gap-2 mb-2">

                                        <Link
                                            href={`/luxe/product/${product._id}`}
                                            className="hover:text-[#E5D3C4] transition-colors"
                                        >
                                            <h3 className="text-white font-sans font-bold text-[13px] leading-snug line-clamp-2">
                                                {product.title}
                                            </h3>
                                        </Link>

                                        {/* Working Wishlist */}
                                        <button
                                            type="button"
                                            onClick={() => handleWishlist(product._id)}
                                            disabled={busyId !== null || authLoading}
                                            aria-label={
                                                selected
                                                    ? 'Remove from Wishlist'
                                                    : 'Add to Wishlist'
                                            }
                                            aria-pressed={selected}
                                            className="shrink-0 text-[#D6B693] hover:text-white transition-colors disabled:opacity-50"
                                        >
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill={selected ? 'currentColor' : 'none'}
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
                                        {hasDiscount && (
                                            <span className="text-white/40 text-xs line-through">
                                                {currency}
                                                {comparePrice.toLocaleString('en-IN')}
                                            </span>
                                        )}

                                        <span className="text-white font-sans font-bold text-[13px]">
                                            {product.price?.finalPrice != null &&
                                            Number.isFinite(finalPrice)
                                                ? `${currency}${finalPrice.toLocaleString('en-IN')}`
                                                : '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Gradient Border */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#F2DFCE] to-transparent z-20" />
        </section>
    );
}
