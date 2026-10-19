'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../../../../../context/AuthContext';
import { addToCartApi } from '../../../api/cartApi';
import LoginModal from '../../components/LoginModal';
import { fetchWishlistApi, toggleWishlistApi } from '../../../api/wishlistApi';
import Link from 'next/link';

const getStock = option =>
    Number.isSafeInteger(Number(option?.stock))
        ? Math.max(0, Number(option.stock))
        : 0;

const getDimensionDetails = option =>
    [
        option.width?.trim() && `W: ${option.width.trim()}`,
        option.length?.trim() && `L: ${option.length.trim()}`,
    ]
        .filter(Boolean)
        .join(' · ');

export default function ProductHeader({
    product,
    dimensions = [],
    selectedDimension,
    onSelectDimension,
}) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const router = useRouter();
    const { isLoggedIn, loading: authLoading } = useAuth();

    const [quantity, setQuantity] = useState(1);
    const [showAllDimensions, setShowAllDimensions] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState(null);
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const pendingRef = useRef(false);

    const [ringGuideOpen, setRingGuideOpen] = useState(false);

    const isRingProduct =
        String(product.category?._id || product.category) ===
        '6acd09e9b2210243220ab66b' ||
        product.category?.name?.toLowerCase() === 'rings';


    useEffect(() => {
        if (authLoading || !isLoggedIn) {
            setIsWishlisted(false);
            return;
        }

        let active = true;

        fetchWishlistApi()
            .then(res => {
                if (active && res.success) {
                    setIsWishlisted(
                        (res.products || []).some(
                            item => String(item._id) === String(product._id)
                        )
                    );
                }
            })
            .catch(err => console.error('Wishlist load failed:', err));

        return () => {
            active = false;
        };
    }, [product._id, isLoggedIn, authLoading]);

    const handleWishlist = async () => {
        if (wishlistLoading || authLoading) return;

        if (!isLoggedIn) {
            setIsLoginOpen(true);
            return;
        }

        setWishlistLoading(true);

        try {
            const res = await toggleWishlistApi(product._id);

            if (!res.success) {
                throw new Error(res.error || 'Unable to update wishlist');
            }

            setIsWishlisted(Boolean(res.isWishlisted));
        } catch (error) {
            if (error.status === 401) {
                setIsLoginOpen(true);
            } else {
                setMessage({
                    type: 'error',
                    text: error.message || 'Unable to update wishlist.',
                });
            }
        } finally {
            setWishlistLoading(false);
        }
    };


    const handleShare = async () => {
        const url = `${window.location.origin}/product/${product._id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.title,
                    text: `Check out ${product.title} at Dwara Jewels`,
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);

                setMessage({
                    type: 'success',
                    text: 'Product link copied!',
                });
            }
        } catch (error) {
            // User closed the native share sheet
            if (error.name === 'AbortError') return;

            try {
                await navigator.clipboard.writeText(url);

                setMessage({
                    type: 'success',
                    text: 'Product link copied!',
                });
            } catch {
                setMessage({
                    type: 'error',
                    text: 'Unable to share product link.',
                });
            }
        }
    };





    const [isAdded, setIsAdded] = useState(false);

    // Flip back when the selected option or quantity changes.
    useEffect(() => {
        setIsAdded(false);
    }, [product?._id, selectedDimension?._id, quantity]);

    const selectedStock = getStock(selectedDimension);
    const isInStock = selectedStock > 0;
    const hasStock = dimensions.some(option => getStock(option) > 0);

    const canPurchase =
        !!selectedDimension?._id &&
        isInStock &&
        quantity >= 1 &&
        quantity <= selectedStock;

    useEffect(() => {
        setQuantity(1);
        setMessage(null);
    }, [product?._id, selectedDimension?._id]);

    useEffect(() => {
        setQuantity(previous =>
            Math.max(1, Math.min(previous, selectedStock))
        );
    }, [selectedStock]);

    const firstFive = dimensions.slice(0, 5);

    // Keep a selected option visible after collapsing the list.
    const collapsedDimensions =
        selectedDimension &&
            dimensions.length > 5 &&
            !firstFive.some(option => option._id === selectedDimension._id)
            ? [...dimensions.slice(0, 4), selectedDimension]
            : firstFive;

    const visibleDimensions = showAllDimensions
        ? dimensions
        : collapsedDimensions;

    const selectDimension = option => {
        if (pendingRef.current || getStock(option) === 0) return;

        setQuantity(1);
        setMessage(null);
        onSelectDimension(option._id);
    };

    const increaseQty = () => {
        if (pendingRef.current || !isInStock) return;

        setQuantity(previous => Math.min(previous + 1, selectedStock));
    };

    const decreaseQty = () => {
        if (pendingRef.current) return;

        setQuantity(previous => Math.max(previous - 1, 1));
    };

    const handleAddToCart = async (buyNow = false) => {
        if (pendingRef.current || authLoading) return;

        setMessage(null);

        if (!canPurchase) {
            setMessage({
                type: 'error',
                text: 'Please select an available option.',
            });
            return;
        }

        if (!isLoggedIn) {
            setIsLoginOpen(true);
            return;
        }

        if (isAdded) {
            router.push('/account/cart');
            return;
        }

        pendingRef.current = true;
        setBusy(true);

        try {
            await addToCartApi(
                product._id,
                quantity,
                selectedDimension._id
            );

            setIsAdded(true)

            setMessage({
                type: 'success',
                text: 'Added to cart successfully.',
            });

            if (buyNow) {
                router.push('/account/cart');
            }
        } catch (error) {
            if (error.status === 401) {
                setIsLoginOpen(true);
            }

            if (error.status === 400 || error.status === 409) {
                router.refresh();
            }

            setMessage({
                type: 'error',
                text: error.message,
            });
        } finally {
            pendingRef.current = false;
            setBusy(false);
        }
    };

    if (!product) return null;

    const finalPrice = Number(product.price?.finalPrice || 0);
    const compareAtPrice = Number(product.price?.compareAtPrice || 0);
    const currency = product.price?.currency === 'USD' ? '$' : 'Rs. ';

    const hasDiscount = compareAtPrice > finalPrice;

    const discountPercentage = hasDiscount
        ? Math.round(((compareAtPrice - finalPrice) / compareAtPrice) * 100)
        : 0;

    const collectionName =
        product.collection?.name || product.category?.name;

    const collectionHref = product.collection?._id
        ? `/category?collection=${product.collection._id}`
        : product.category?._id
            ? `/category?category=${product.category._id}`
            : null;

    return (
        <div className="flex flex-col pb-8 border-b border-gray-100 mb-8 font-sans">
            {/* Header & Price */}
            <h1 className="text-[#222222] font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
                {product.title}
            </h1>

            <p className="text-[#222222] font-serif text-[28px] mb-8 flex flex-wrap items-center gap-3">
                {hasDiscount && (
                    <span className="text-gray-400 text-xl line-through">
                        {currency}{compareAtPrice.toLocaleString('en-IN')}
                    </span>
                )}

                <span>
                    {currency}{finalPrice.toLocaleString('en-IN')}
                </span>

                {hasDiscount && (
                    <span className="text-[#BF8F5F] font-sans font-bold text-sm">
                        {discountPercentage}% OFF
                    </span>
                )}
            </p>

            {/* Collection & Reviews */}
            <div className="flex flex-wrap items-center gap-3 mb-8 text-[11px] sm:text-xs">
                {collectionName && (
                    <>

                        {collectionHref ? (
                            <Link
                                href={collectionHref}
                                className="text-[#BF8F5F] font-bold uppercase tracking-widest hover:underline transition-colors"
                            >
                                {collectionName}
                            </Link>
                        ) : (
                            <span className="text-[#BF8F5F] font-bold uppercase tracking-widest">
                                {collectionName}
                            </span>
                        )}

                        <span className="text-[#BF8F5F]">|</span>
                    </>
                )}

                <div className="flex items-center text-[#FFC107]">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <svg
                            key={index}
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                </div>

                <span className="text-gray-400 ml-1">
                    ({product.rating?.count || 0} Reviews)
                </span>
            </div>

            {/* Wishlist & Share */}
            <div className="flex items-center gap-6 mb-8">

                <button
                    type="button"
                    onClick={handleWishlist}
                    disabled={wishlistLoading || authLoading}
                    aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    aria-pressed={isWishlisted}
                    className="text-[#BF8F5F] hover:scale-110 transition-transform disabled:opacity-50"
                >
                    <svg
                        className="w-[22px] h-[22px]"
                        fill={isWishlisted ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                    </svg>
                </button>


                <button
                    type="button"
                    onClick={handleShare}
                    className="text-[#222222] hover:text-[#BF8F5F] transition-colors"
                    aria-label="Share Product"
                >
                    <svg
                        className="w-[22px] h-[22px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                        />
                    </svg>
                </button>
            </div>

            {/* Dimension Options */}
            {dimensions.length > 0 && (
                <div className="mb-6">
                    <p className="text-sm font-bold text-[#222222] mb-3">
                        {dimensions.some(option => option.size?.trim())
                            ? 'Select Size'
                            : 'Select Option'}
                    </p>

                    <div className="flex flex-wrap items-stretch gap-2">
                        {visibleDimensions.map(option => {
                            const outOfStock = getStock(option) === 0;
                            const selected =
                                selectedDimension?._id === option._id;

                            const size = option.size?.trim();
                            const details = getDimensionDetails(option);

                            return (
                                <button
                                    key={option._id}
                                    type="button"
                                    disabled={outOfStock || busy}
                                    aria-pressed={selected}
                                    aria-label={[
                                        size ? `Size ${size}` : 'Standard',
                                        details,
                                        outOfStock ? 'Out of stock' : '',
                                    ].filter(Boolean).join(', ')}
                                    onClick={() => selectDimension(option)}
                                    className={`relative min-w-[64px] max-w-[170px] border px-3 py-2.5 text-center transition-colors ${outOfStock
                                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                        : selected
                                            ? 'border-[#BF8F5F] bg-[#F9F1E7] text-[#BF8F5F]'
                                            : 'border-gray-200 text-[#222222] hover:border-[#BF8F5F]'
                                        }`}
                                >
                                    <span
                                        className={`block text-sm font-semibold ${outOfStock ? 'line-through' : ''
                                            }`}
                                    >
                                        {size || details || 'Standard'}
                                    </span>

                                    {size && details && (
                                        <span className="block mt-1 text-[10px] leading-relaxed">
                                            {details}
                                        </span>
                                    )}

                                    {outOfStock && (
                                        <span
                                            className="absolute top-0 right-1 text-xs"
                                            aria-hidden="true"
                                        >
                                            ×
                                        </span>
                                    )}
                                </button>
                            );
                        })}

                        {dimensions.length > 5 && (
                            <button
                                type="button"
                                disabled={busy}
                                aria-expanded={showAllDimensions}
                                onClick={() =>
                                    setShowAllDimensions(previous => !previous)
                                }
                                className="px-3 py-2 text-xs font-bold text-[#BF8F5F] hover:underline disabled:opacity-50"
                            >
                                {showAllDimensions
                                    ? 'Show Less'
                                    : `+ More (${dimensions.length - collapsedDimensions.length})`}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {isRingProduct && (
                <button
                    type="button"
                    onClick={() => setRingGuideOpen(true)}
                    className="mb-6 flex items-center gap-2 text-left text-sm font-medium text-[#BF8F5F] hover:underline"
                >
                    Not sure about your size? View Ring Size Guide
                    <span aria-hidden="true">↗</span>
                </button>
            )}

            {/* Cart & Buy Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                <div className="flex items-center border border-[#222222] h-[50px] w-full sm:w-[120px] shrink-0">
                    <button
                        type="button"
                        onClick={decreaseQty}
                        disabled={busy || !isInStock || quantity <= 1}
                        aria-label="Decrease quantity"
                        className="w-1/3 h-full flex items-center justify-center text-[#222222] hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        −
                    </button>

                    <span className="w-1/3 text-center text-[15px] font-bold text-[#222222]">
                        {quantity}
                    </span>

                    <button
                        type="button"
                        onClick={increaseQty}
                        disabled={
                            busy ||
                            !isInStock ||
                            quantity >= selectedStock
                        }
                        aria-label="Increase quantity"
                        className="w-1/3 h-full flex items-center justify-center text-[#222222] hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        +
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => handleAddToCart()}
                    disabled={
                        busy ||
                        authLoading ||
                        (!isAdded && !canPurchase)
                    }
                    aria-label={
                        busy ? 'Adding to cart' : isAdded ? 'Go To Cart' : 'Add To Cart'
                    }
                    className="group/cart relative w-full h-[50px] disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ perspective: '800px' }}
                >
                    <span
                        className="relative block w-full h-full transition-transform duration-500 ease-in-out motion-reduce:transition-none"
                        style={{
                            transformStyle: 'preserve-3d',
                            transform: isAdded ? 'rotateX(180deg)' : 'rotateX(0deg)',
                        }}
                    >
                        {/* Front */}
                        <span
                            aria-hidden={isAdded}
                            className="absolute inset-0 flex items-center justify-center border border-[#222222] bg-white text-[#222222] font-bold text-xs uppercase tracking-[0.15em] group-hover/cart:bg-[#222222] group-hover/cart:text-white transition-colors"
                            style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                            }}
                        >
                            {busy ? 'Adding…' : 'Add To Cart'}
                        </span>

                        {/* Back */}
                        <span
                            aria-hidden={!isAdded}
                            className="absolute inset-0 flex items-center justify-center gap-2 border border-[#BF8F5F] bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-[0.15em] group-hover/cart:bg-[#a67b50] transition-colors"
                            style={{
                                transform: 'rotateX(180deg)',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                            }}
                        >
                            Go To Cart <span aria-hidden="true">→</span>
                        </span>
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    disabled={!canPurchase || busy || authLoading}
                    className="w-full h-[50px] bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#a67b50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Buy Now
                </button>
            </div>

            {/* Stock Status */}
            <div className="mt-4 text-xs font-bold tracking-wider">
                {!hasStock ? (
                    <span className="text-red-500">OUT OF STOCK</span>
                ) : isInStock ? (
                    <span className="text-green-700">
                        {selectedStock === 1
                            ? 'ONLY 1 LEFT IN STOCK'
                            : 'IN STOCK'}
                    </span>
                ) : (
                    <span className="text-red-500">
                        THIS OPTION IS OUT OF STOCK
                    </span>
                )}
            </div>

            {message && (
                <p
                    role={message.type === 'error' ? 'alert' : 'status'}
                    className={`mt-3 text-sm ${message.type === 'error'
                        ? 'text-red-600'
                        : 'text-green-700'
                        }`}
                >
                    {message.text}
                </p>
            )}

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSuccess={() => {
                    setIsLoginOpen(false);
                    setMessage({
                        type: 'success',
                        text: 'Signed in. You can now add this item to cart.',
                    });
                    router.refresh();
                }}
            />

            {ringGuideOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setRingGuideOpen(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="ring-guide-title"
                        className="relative w-full max-w-[600px] max-h-[90vh] overflow-hidden bg-white shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                            <div>
                                <p className="text-[10px] tracking-[0.25em] text-[#BF8F5F]">
                                    DWARA JEWELS
                                </p>
                                <h2
                                    id="ring-guide-title"
                                    className="mt-1 font-serif text-xl text-[#222222]"
                                >
                                    Find Your Perfect Fit
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setRingGuideOpen(false)}
                                aria-label="Close size guide"
                                className="text-2xl text-[#222222] hover:text-[#BF8F5F]"
                            >
                                ×
                            </button>
                        </div>

                        {/* Size Guide Images */}
                        <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6">
                            <img
                                src="/images/ring-guide-1.png"
                                alt="Dwara Jewels ring size guide - page 1"
                                className="mb-5 h-auto w-full"
                            />

                            <img
                                src="/images/ring-guide-2.png"
                                alt="Dwara Jewels ring size guide - page 2"
                                className="h-auto w-full"
                            />

                            <p className="mt-5 text-center text-xs text-gray-500">
                                Measure your finger 2–3 times for a more accurate fit.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 px-5 py-4">
                            <button
                                type="button"
                                onClick={() => setRingGuideOpen(false)}
                                className="w-full bg-[#BF8F5F] py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#a67b50] transition-colors"
                            >
                                Got It
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}