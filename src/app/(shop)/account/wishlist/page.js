'use client';
import React, { useEffect, useRef, useState } from 'react';

import {
    fetchWishlistApi,
    toggleWishlistApi,
    moveWishlistToCartApi,
} from '../../../api/wishlistApi';
import Image from 'next/image';
import Link from 'next/link';

const prepareProducts = products =>
    products.filter(Boolean).map(product => {
        const dimensions = Array.isArray(product.dimensions)
            ? product.dimensions
            : [];

        const available = dimensions.some(
            dimension => Number(dimension.stock) > 0
        );

        const price = typeof product.price === 'object'
            ? product.price?.finalPrice
            : product.price;

        const material = [
            product.metal?.quality,
            product.metal?.type,
        ].filter(Boolean).join(' ');

        return {
            id: product._id,
            name: product.title,
            img: product.thumbnail,
            material: material ? `in ${material}` : '',
            price: price == null
                ? '—'
                : `Rs. ${Number(price).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`,
            dimensions,
            stockStatus: available ? 'In Stock' : 'Out of Stock',
            href: product.isLuxe
                ? `/luxe/product/${product._id}`
                : `/product/${product._id}`,
        };
    });

const dimensionLabel = dimension =>
    [
        dimension.size ? `Size: ${dimension.size}` : '',
        dimension.width ? `W: ${dimension.width}` : '',
        dimension.length ? `L: ${dimension.length}` : '',
    ].filter(Boolean).join(' | ') || 'Standard';

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [selectedDimensions, setSelectedDimensions] = useState({});
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const actionRef = useRef(false);

    useEffect(() => {
        let active = true;

        const loadWishlist = async () => {
            try {
                const response = await fetchWishlistApi();

                if (!response.success || !Array.isArray(response.products)) {
                    throw new Error('Unable to load your wishlist.');
                }

                if (active) {
                    setWishlistItems(prepareProducts(response.products));
                }
            } catch (err) {
                if (!active) return;

                if (err.status === 401) {
                    window.location.replace('/login');
                    return;
                }

                setError(err.data?.error || err.message || 'Unable to load wishlist.');
            } finally {
                if (active) setLoading(false);
            }
        };

        loadWishlist();

        return () => {
            active = false;
        };
    }, []);

    const getSelectedDimension = product => {
        const selectedId = selectedDimensions[product.id];

        if (selectedId) {
            return product.dimensions.find(
                dimension => String(dimension._id) === selectedId
            );
        }

        const available = product.dimensions.filter(
            dimension => Number(dimension.stock) > 0
        );

        return available.length === 1 ? available[0] : null;
    };

    const canMoveToCart = product =>
        !busyId &&
        Number(getSelectedDimension(product)?.stock) > 0;

    const runAction = async (productId, operation, successMessage) => {
        if (actionRef.current) return;

        actionRef.current = true;
        setBusyId(productId);
        setError('');
        setMessage('');

        try {
            const response = await operation();

            if (!response.success) {
                throw new Error(response.error || 'Unable to update wishlist.');
            }

            if (response.isWishlisted === true) {
                throw Object.assign(
                    new Error('This item is still saved. Please try again.'),
                    { status: 409 }
                );
            }

            setWishlistItems(previous =>
                previous.filter(product => product.id !== productId)
            );

            setMessage(successMessage);
        } catch (err) {
            if (err.status === 401) {
                window.location.replace('/login');
                return;
            }

            setError(err.data?.error || err.message || 'Request failed.');

            if (err.status === 409) {
                try {
                    const response = await fetchWishlistApi();

                    if (response.success && Array.isArray(response.products)) {
                        setWishlistItems(prepareProducts(response.products));
                    }
                } catch {
                    // Keep the original error visible.
                }
            }
        } finally {
            actionRef.current = false;
            setBusyId(null);
        }
    };

    const handleRemove = productId =>
        runAction(
            productId,
            () => toggleWishlistApi(productId),
            'Removed from wishlist.'
        );

    const handleMoveToCart = product => {
        const dimension = getSelectedDimension(product);

        if (!dimension || Number(dimension.stock) <= 0) {
            setError('Please select an available size or dimension.');
            return;
        }

        return runAction(
            product.id,
            () => moveWishlistToCartApi(
                product.id,
                String(dimension._id),
                1
            ),
            'Moved to cart successfully.'
        );
    };

    return (
        <main className="bg-white min-h-screen pb-16 lg:pb-20 overflow-hidden">
            <section className="horizontal-padding mt-16 md:mt-24 lg:mt-[100px] max-w-[1440px] mx-auto">

                {/* Page Header */}
                <div className="flex flex-col mb-8 lg:mb-15">
                    <span className="text-[#BF8F5F] font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-2 sm:mb-3 text-center sm:text-left">
                        MY ACCOUNT
                    </span>
                    <h1 className="heading-main text-3xl sm:text-4xl lg:text-5xl text-center sm:text-left">
                        Your Wishlist
                    </h1>
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-3 sm:mt-4 gap-2 sm:gap-4 text-center sm:text-left">
                        <p className="heading-des text-gray-500 max-w-md text-xs sm:text-sm">
                            Review and manage the exquisite pieces you've saved for later.
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-[#222222]">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved
                        </p>
                    </div>
                    <div className="bg-[#BF8F5F] h-px w-full mt-4 lg:mt-[28px]" />
                </div>


                {error && (
                    <p role="alert" className="text-sm text-red-500 mb-6">
                        {error}
                    </p>
                )}

                {message && (
                    <p role="status" className="text-sm text-[#BF8F5F] mb-6">
                        {message}
                    </p>
                )}


                {/* Empty State */}
                {loading ? (
                    <p role="status" className="text-sm text-[#BF8F5F] py-12 text-center">
                        Loading your wishlist…
                    </p>
                ) : error && wishlistItems.length === 0 ? null : wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 lg:py-20 text-center px-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 text-gray-300">
                            <svg fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <h2 className="title-main text-xl sm:text-2xl mb-2 sm:mb-4">Your wishlist is empty</h2>
                        <p className="title-des text-xs sm:text-base mb-6 sm:mb-8">Looks like you haven't saved any items yet.</p>
                        <Link
                            href="/shop"
                            className="bg-[#BF8F5F] text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest py-3 sm:py-4 px-8 sm:px-10 hover:bg-black transition-colors rounded-sm"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                        {wishlistItems.map((product) => (
                            <div key={product.id} className="group flex flex-col mb-4 sm:mb-6">

                                {/* Product Image Container */}
                                <div className="bg-[#FCF6F2] mb-3 sm:mb-4 overflow-hidden relative w-full aspect-square rounded-sm">

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => handleRemove(product.id)}
                                        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                                        aria-label="Remove from Wishlist"
                                        type="button"
                                        disabled={Boolean(busyId)}
                                    >
                                        <svg className="w-3 h-3 sm:w-[14px] sm:h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>

                                    {/* Product Image */}
                                    <Link
                                        href={product.href}
                                        className="absolute inset-0 w-full h-full cursor-pointer"
                                    >
                                        {product.img && (
                                            <Image
                                                src={product.img}
                                                alt={product.name}
                                                fill
                                                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        )}
                                    </Link>

                                    {/* Add to Cart Overlay */}
                                    <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 sm:px-4 pointer-events-none">
                                        <button
                                            // disabled={product.stockStatus === "Out of Stock"}
                                            className={`pointer-events-auto w-full py-2 sm:py-3 rounded-sm shadow-md font-bold text-[9px] sm:text-xs uppercase tracking-wider sm:tracking-widest transition-colors ${product.stockStatus === "Out of Stock"
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-white/90 backdrop-blur-sm text-[#222222] hover:bg-[#BF8F5F] hover:text-white"
                                                }`}
                                            type="button"
                                            disabled={!canMoveToCart(product)}
                                            onClick={() => handleMoveToCart(product)}
                                        >
                                            {busyId === product.id
                                                ? 'Updating…'
                                                : product.stockStatus === 'Out of Stock'
                                                    ? 'Out of Stock'
                                                    : !getSelectedDimension(product)
                                                        ? 'Select an Option'
                                                        : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>

                                {/* Product Details (Exact matching fonts) */}
                                <div className="flex flex-col text-center lg:text-left px-1">
                                    <h3 className="text-[#222222] font-bold text-sm leading-tight mb-1 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 text-xs mb-2 truncate">
                                        {product.material}
                                    </p>
                                    <label htmlFor={`dimension-${product.id}`} className="sr-only">
                                        Select size or dimensions for {product.name}
                                    </label>

                                    <select
                                        id={`dimension-${product.id}`}
                                        value={String(getSelectedDimension(product)?._id || '')}
                                        disabled={
                                            Boolean(busyId) ||
                                            product.stockStatus === 'Out of Stock'
                                        }
                                        onChange={event => setSelectedDimensions(previous => ({
                                            ...previous,
                                            [product.id]: event.target.value,
                                        }))}
                                        className="w-full min-w-0 border border-[#BF8F5F]/30 bg-white text-[#222222] text-[10px] sm:text-xs px-2 py-2 mb-3 rounded-sm outline-none disabled:opacity-50"
                                    >
                                        <option value="" disabled>
                                            {product.stockStatus === 'Out of Stock'
                                                ? 'No available options'
                                                : 'Select size / dimensions'}
                                        </option>

                                        {product.dimensions.map(dimension => (
                                            <option
                                                key={dimension._id}
                                                value={String(dimension._id)}
                                                disabled={Number(dimension.stock) <= 0}
                                            >
                                                {Number(dimension.stock) <= 0 ? '× ' : ''}
                                                {dimensionLabel(dimension)}
                                                {Number(dimension.stock) <= 0 ? ' — Out of stock' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="flex items-center justify-center lg:justify-between mt-auto">
                                        <p className="text-[#BF8F5F] font-bold text-sm">
                                            {product.price}
                                        </p>
                                        {/* Stock indicator hidden on mobile for space, visible on desktop */}
                                        <span className={`hidden lg:block text-[10px] uppercase tracking-wider font-bold ${product.stockStatus === "In Stock" ? "text-green-600" :
                                            product.stockStatus === "Low Stock" ? "text-orange-500" : "text-red-500"
                                            }`}>
                                            {product.stockStatus}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}