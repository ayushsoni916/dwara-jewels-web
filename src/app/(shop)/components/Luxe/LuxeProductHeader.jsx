'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { fetchWishlistApi, toggleWishlistApi } from '../../../api/wishlistApi';
import LoginModal from '../../components/LoginModal';
import { useRouter } from 'next/navigation';
import { addToCartApi } from '../../../api/cartApi';

export default function LuxeProductHeader({ product }) {
    const [quantity, setQuantity] = useState(1);


    const { isLoggedIn, loading: authLoading } = useAuth();

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [actionMessage, setActionMessage] = useState('');

    const router = useRouter();
    const pendingRef = useRef(false);

    const [cartBusy, setCartBusy] = useState(false);
    const [isAdded, setIsAdded] = useState(false);



    // Check if this product is already wishlisted
    useEffect(() => {
        if (authLoading || !isLoggedIn || !product?._id) {
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
            .catch(err => console.error('Wishlist fetch failed:', err));

        return () => {
            active = false;
        };
    }, [product?._id, isLoggedIn, authLoading]);




    const handleWishlist = async () => {
        if (wishlistLoading || authLoading) return;

        if (!isLoggedIn) {
            setIsLoginOpen(true);
            return;
        }

        setWishlistLoading(true);
        setActionMessage('');

        try {
            const res = await toggleWishlistApi(product._id);

            if (!res.success) {
                throw new Error(res.error || 'Unable to update wishlist');
            }

            setIsWishlisted(Boolean(res.isWishlisted));
        } catch (err) {
            if (err.status === 401) {
                setIsLoginOpen(true);
            } else {
                setActionMessage(
                    err.message || 'Unable to update wishlist.'
                );
            }
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleShare = async () => {
        const url = `https://dwarajewels.in/luxe/product/${product._id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: product.title,
                    text: `Discover ${product.title} at Dwara Luxe`,
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                setActionMessage('Product link copied!');
            }
        } catch (err) {
            if (err.name === 'AbortError') return;

            try {
                await navigator.clipboard.writeText(url);
                setActionMessage('Product link copied!');
            } catch {
                setActionMessage('Unable to share product link.');
            }
        }
    };


    const handleAddToCart = async (buyNow = false) => {
        if (pendingRef.current || authLoading) return;

        setActionMessage('');

        if (!canPurchase) {
            setActionMessage('Please select an available size or option.');
            return;
        }

        if (!isLoggedIn) {
            setIsLoginOpen(true);
            return;
        }

        // If already added, open cart instead of adding twice.
        if (isAdded) {
            router.push('/account/cart');
            return;
        }

        pendingRef.current = true;
        setCartBusy(true);

        try {
            await addToCartApi(
                product._id,
                quantity,
                selectedDimension._id
            );

            setIsAdded(true);
            setActionMessage('Added to cart successfully!');

            if (buyNow) {
                router.push('/account/cart');
            }
        } catch (error) {
            if (error.status === 401) {
                setIsLoginOpen(true);
            } else {
                setActionMessage(
                    error.message || 'Unable to add product to cart.'
                );
            }

            if (error.status === 400 || error.status === 409) {
                router.refresh();
            }
        } finally {
            pendingRef.current = false;
            setCartBusy(false);
        }
    };



    const dimensions = (
        Array.isArray(product?.dimensions) ? product.dimensions : []
    )
        .filter(option => option?._id)
        .slice()
        .sort((a, b) =>
            String(a.size || '').localeCompare(
                String(b.size || ''),
                undefined,
                { numeric: true }
            )
        );

    const [selectedId, setSelectedId] = useState(() =>
        dimensions.find(option => Number(option.stock) > 0)?._id ||
        dimensions[0]?._id ||
        null
    );

   const selectedDimension =
    dimensions.find(option => option._id === selectedId) ||
    dimensions[0];

// 1. First calculate stock
const selectedStock = Math.max(
    0,
    Number(selectedDimension?.stock) || 0
);

// 2. Then availability
const isInStock = selectedStock > 0;

const hasStock = dimensions.some(
    option => Number(option.stock) > 0
);

// 3. Finally purchase validation
const canPurchase =
    !!selectedDimension?._id &&
    isInStock &&
    quantity >= 1 &&
    quantity <= selectedStock;
    useEffect(() => {
        setIsAdded(false);
    }, [product._id, selectedDimension?._id, quantity]);



    if (!product) return null;

    const finalPrice = Number(product.price?.finalPrice);
    const comparePrice = Number(product.price?.compareAtPrice);

    const currency = product.price?.currency === 'USD' ? '$' : 'Rs. ';

    const hasDiscount =
        product.price?.finalPrice != null &&
        product.price?.compareAtPrice != null &&
        Number.isFinite(finalPrice) &&
        Number.isFinite(comparePrice) &&
        comparePrice > finalPrice;

    const discountPercentage = hasDiscount
        ? Math.round(((comparePrice - finalPrice) / comparePrice) * 100)
        : 0;

    const collectionName = product.collection?.name || product.category?.name;


    const increaseQty = () => {
        setQuantity(prev => Math.min(prev + 1, selectedStock));
    };

    const decreaseQty = () => {
        setQuantity(prev => Math.max(prev - 1, 1));
    };

    const selectDimension = option => {
        if (pendingRef.current || Number(option.stock) <= 0) return;

        setSelectedId(option._id);
        setQuantity(1);
    };


    return (
        <div className="flex flex-col pb-8 border-b border-white/10 mb-8 font-sans">
            {/* Header & Price */}
            <h1 className="text-white font-serif font-normal text-4xl lg:text-5xl leading-tight mb-4">
                {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-8">
                {/* Cross Price */}
                {hasDiscount && (
                    <span className="text-white/40 font-serif text-xl line-through">
                        {currency}{comparePrice.toLocaleString('en-IN')}
                    </span>
                )}

                {/* Selling Price */}
                <span className="text-white font-serif text-[28px] tracking-wide">
                    {product.price?.finalPrice != null && Number.isFinite(finalPrice)
                        ? `${currency}${finalPrice.toLocaleString('en-IN')}`
                        : '—'}
                </span>

                {/* Discount Percentage */}
                {hasDiscount && (
                    <span className="text-[#D6B693] font-sans text-sm font-bold">
                        {discountPercentage}% OFF
                    </span>
                )}
            </div>


            {/* Meta: Collection, Reviews */}
            <div className="flex flex-wrap items-center gap-3 mb-8 text-[11px] sm:text-xs">
                {collectionName && (
                    <>
                        <span className="text-[#D6B693] font-bold uppercase tracking-[0.2em]">
                            {collectionName}
                        </span>
                        <span className="text-white/30">|</span>
                    </>
                )}

                <div className="flex items-center text-[#D6B693]">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                </div>
                <span className="text-white/60 ml-1">( {product.rating?.count || 0} Reviews )</span>
            </div>


            {/* Wishlist & Share */}
            <div className="flex items-center gap-6 mb-8 text-[#D6B693]">

                {/* Wishlist */}
                <button
                    type="button"
                    onClick={handleWishlist}
                    disabled={wishlistLoading || authLoading}
                    aria-label={
                        isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'
                    }
                    aria-pressed={isWishlisted}
                    className="hover:text-white transition-colors disabled:opacity-50"
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

                {/* Share */}
                <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share Product"
                    className="hover:text-white transition-colors"
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


            {/* Size / Option Selection */}
            {dimensions.length > 0 && (
                <div className="mb-6">
                    <p className="text-white text-sm font-bold mb-3">
                        {dimensions.some(option => option.size?.trim())
                            ? 'Select Size'
                            : 'Select Option'}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {dimensions.map(option => {
                            const outOfStock = Number(option.stock) <= 0;
                            const selected = selectedDimension?._id === option._id;

                            return (
                                <button
                                    key={option._id}
                                    type="button"
                                    disabled={outOfStock || cartBusy}
                                    onClick={() => selectDimension(option)}
                                    aria-pressed={selected}
                                    className={`relative min-w-[64px] border px-4 py-3 text-sm transition-colors ${outOfStock
                                        ? 'border-white/10 text-white/30 cursor-not-allowed'
                                        : selected
                                            ? 'border-[#D6B693] bg-[#D6B693]/10 text-[#D6B693]'
                                            : 'border-white/30 text-white hover:border-[#D6B693]'
                                        }`}
                                >
                                    <span className={outOfStock ? 'line-through' : ''}>
                                        {option.size?.trim() ||
                                            option.width?.trim() ||
                                            option.length?.trim() ||
                                            'Standard'}
                                    </span>

                                    {outOfStock && (
                                        <span className="absolute top-0 right-1 text-xs" >
                                            ×
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Cart & Buy Actions */}

            {/* Cart & Buy Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">

                {/* Quantity */}
                <div className="flex items-center border border-white/30 h-[50px] w-full sm:w-[120px] shrink-0">
                    <button
                        type="button"
                        onClick={decreaseQty}
                        disabled={cartBusy || !isInStock || quantity <= 1}
                        aria-label="Decrease quantity"
                        className="w-1/3 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                    >
                        −
                    </button>

                    <span className="w-1/3 text-center text-[15px] font-bold text-white">
                        {quantity}
                    </span>

                    <button
                        type="button"
                        onClick={increaseQty}
                        disabled={
                            cartBusy ||
                            !isInStock ||
                            quantity >= selectedStock
                        }
                        aria-label="Increase quantity"
                        className="w-1/3 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors disabled:opacity-30"
                    >
                        +
                    </button>
                </div>

                {/* Add To Cart / Go To Cart */}
                <button
                    type="button"
                    onClick={() => handleAddToCart(false)}
                    disabled={
                        cartBusy ||
                        authLoading ||
                        (!isAdded && !canPurchase)
                    }
                    className={`w-full h-[50px] border font-bold text-xs uppercase tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isAdded
                        ? 'bg-[#D6B693] border-[#D6B693] text-[#0C0E17] hover:bg-white'
                        : 'border-[#E5D3C4]/60 text-white hover:bg-[#E5D3C4] hover:text-[#0C0E17]'
                        }`}
                >
                    {cartBusy
                        ? 'Adding...'
                        : isAdded
                            ? 'Go To Cart →'
                            : 'Add To Cart'}
                </button>

                {/* Buy Now */}
                <button
                    type="button"
                    onClick={() => handleAddToCart(true)}
                    disabled={!canPurchase || cartBusy || authLoading}
                    className="w-full h-[50px] bg-[#D6B693] text-[#0C0E17] font-bold text-xs uppercase tracking-[0.15em] hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Buy Now
                </button>
            </div>


            {/* Stock Status */}
            <div className="mt-5 text-xs font-bold tracking-wider">
                {!hasStock ? (
                    <span className="text-red-400">OUT OF STOCK</span>
                ) : isInStock ? (
                    <span className="text-[#D6B693]">
                        {selectedStock === 1 ? 'ONLY 1 LEFT IN STOCK' : 'IN STOCK'}
                    </span>
                ) : (
                    <span className="text-red-400">
                        THIS OPTION IS OUT OF STOCK
                    </span>
                )}
            </div>


            {actionMessage && (
                <p role="status" className="mt-3 text-sm text-[#D6B693]">
                    {actionMessage}
                </p>
            )}

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSuccess={() => {
                    setIsLoginOpen(false);
                    setActionMessage('Signed in successfully.');
                }}
            />


        </div>
    );
}