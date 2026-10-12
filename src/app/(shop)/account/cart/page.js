'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
    getCart,
    updateCart,
    removeItem,
    applyCoupon,
} from '../../../api/cartApi';

const EMPTY_CART = {
    items: [],
    coupon: null,
    summary: {
        totalQty: 0,
        subtotal: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
        totalCost: 0,
    },
};

const trustBadges = [
    {
        title: 'Certified',
        icon: '/icons/Certified.svg',
        description: 'Available certificates of authenticity',
    },
    {
        title: 'Secure',
        icon: '/icons/Secure.svg',
        description: 'Certified marketplace since 2017',
    },
    {
        title: 'Shipping',
        icon: '/icons/Ship.svg',
        description: 'Free, fast, and reliable worldwide',
    },
    {
        title: 'Transparent',
        icon: '/icons/Transparent.svg',
        description: 'Hassle-free return policy',
    },
];

const formatPrice = (value) =>
    `Rs. ${Number(value || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const getOptions = (item) =>
    Array.isArray(item?.dimensions)
        ? item.dimensions.filter(option => option?._id)
        : [];

const getSelectedDimension = (item) =>
    getOptions(item).find(
        option => String(option._id) === String(item.dimensionId)
    );

const getStock = (option) => {
    const stock = Number(option?.stock);

    return Number.isInteger(stock) && stock >= 0 ? stock : 0;
};

const getDimensionLabel = (option) => {
    const parts = [];

    if (option?.size?.trim()) parts.push(`Size ${option.size}`);
    if (option?.width?.trim()) parts.push(`W: ${option.width}`);
    if (option?.length?.trim()) parts.push(`L: ${option.length}`);

    return parts.join(' · ') || 'Standard';
};

// Include any other cart line already using this product and dimension.
const getRequiredStock = (cart, item, dimensionId) =>
    Number(item.quantity) +
    cart.items.reduce((total, other) => {
        const sameOption =
            String(other._id) !== String(item._id) &&
            String(other.productId) === String(item.productId) &&
            String(other.dimensionId) === String(dimensionId);

        return total + (sameOption ? Number(other.quantity) : 0);
    }, 0);

const itemIsAvailable = (cart, item) => {
    const option = getSelectedDimension(item);
    const quantity = Number(item.quantity);

    return (
        Boolean(option) &&
        Number.isInteger(quantity) &&
        quantity >= 1 &&
        getRequiredStock(cart, item, option._id) <= getStock(option)
    );
};

const cartIsAvailable = (cart) =>
    cart.items.length > 0 &&
    cart.items.every(item => itemIsAvailable(cart, item));

const readCartResponse = (response) => {
    if (response?.success !== true) {
        throw new Error(response?.error || 'Unable to load your cart.');
    }

    if (response.cart === null) return EMPTY_CART;

    if (!Array.isArray(response.cart?.items) || !response.cart?.summary) {
        throw new Error('The server returned an invalid cart response.');
    }

    return response.cart;
};

function CloseIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M18 6 6 18M6 6l12 12" />
        </svg>
    );
}

export default function ShoppingCart() {
    const router = useRouter();

    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [sizeItemId, setSizeItemId] = useState(null);

    const pendingRef = useRef(false);
    const requestVersionRef = useRef(0);
    const dialogRef = useRef(null);

    const cartItems = cartData?.items || [];
    const summary = cartData?.summary || EMPTY_CART.summary;
    const busy = loading || Boolean(processing);

    const sizeItem = cartItems.find(item => item._id === sizeItemId);

    const sizeOptions = [...getOptions(sizeItem)].sort((a, b) =>
        String(a.size || '').localeCompare(
            String(b.size || ''),
            undefined,
            { numeric: true }
        )
    );

    const canCheckout = cartData && cartIsAvailable(cartData);

    const loadCart = useCallback(async () => {
        const version = ++requestVersionRef.current;

        setLoading(true);
        setFeedback(null);

        try {
            const cart = readCartResponse(await getCart());

            if (version === requestVersionRef.current) {
                setCartData(cart);
            }
        } catch (error) {
            if (version !== requestVersionRef.current) return;

            if (error.status === 401) {
                window.location.replace('/login');
                return;
            }

            setFeedback({
                error: true,
                text: error.message || 'Unable to load your cart.',
            });
        } finally {
            if (version === requestVersionRef.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        loadCart();

        return () => {
            requestVersionRef.current += 1;
        };
    }, [loadCart]);

    // Open a native modal dialog for selecting a dimension.
    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (!sizeItem?._id) {
            if (dialog.open) dialog.close();
            return;
        }

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';
        if (!dialog.open) dialog.showModal();

        return () => {
            if (dialog.open) dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, [sizeItem?._id]);

    // Serialize mutations and always replace the cart with the API response.
    const performAction = async (
        action,
        label,
        successMessage,
        afterSuccess
    ) => {
        if (pendingRef.current || loading) return;

        pendingRef.current = true;
        const version = ++requestVersionRef.current;

        setProcessing(label);
        setFeedback(null);

        try {
            const nextCart = readCartResponse(await action());

            if (version !== requestVersionRef.current) return;

            setCartData(nextCart);

            if (successMessage) {
                setFeedback({
                    error: false,
                    text: successMessage,
                });
            }

            afterSuccess?.(nextCart);
        } catch (error) {
            if (version !== requestVersionRef.current) return;

            if (error.status === 401) {
                window.location.replace('/login');
                return;
            }

            setFeedback({
                error: true,
                text: error.message || 'Unable to update your cart.',
            });

            // Refresh stock and totals after a rejected cart operation.
            try {
                const freshCart = readCartResponse(await getCart());

                if (version === requestVersionRef.current) {
                    setCartData(freshCart);
                }
            } catch (refreshError) {
                if (
                    version === requestVersionRef.current &&
                    refreshError.status === 401
                ) {
                    window.location.replace('/login');
                }
            }
        } finally {
            pendingRef.current = false;

            if (version === requestVersionRef.current) {
                setProcessing('');
            }
        }
    };

    const handleQuantity = (item, type) => {
        const option = getSelectedDimension(item);
        const quantity = Number(item.quantity);

        if (type === 'decrement' && quantity <= 1) return;

        if (
            type === 'increment' &&
            (
                !option ||
                !itemIsAvailable(cartData, item) ||
                getRequiredStock(cartData, item, option._id) >= getStock(option)
            )
        ) {
            return;
        }

        performAction(
            () => updateCart(item._id, type),
            `quantity:${item._id}`
        );
    };

    const handleSizeChange = (option) => {
        if (!sizeItem || pendingRef.current) return;

        const required = getRequiredStock(cartData, sizeItem, option._id);

        if (required > getStock(option)) return;

        if (String(option._id) === String(sizeItem.dimensionId)) {
            setSizeItemId(null);
            return;
        }

        performAction(
            () => updateCart(sizeItem._id, 'change_dimension', option._id),
            'size',
            'Size updated successfully.',
            () => setSizeItemId(null)
        );
    };

    const handleCoupon = (event) => {
        event.preventDefault();

        if (!couponCode.trim()) {
            setFeedback({
                error: true,
                text: 'Please enter a coupon code.',
            });
            return;
        }

        performAction(
            () => applyCoupon(couponCode.trim()),
            'coupon',
            'Coupon applied successfully.'
        );
    };

    const handleCheckout = () => {
        if (!canCheckout) return;

        // Recheck current inventory before moving to the address screen.
        performAction(
            getCart,
            'checkout',
            null,
            (freshCart) => {
                if (!cartIsAvailable(freshCart)) {
                    setFeedback({
                        error: true,
                        text: 'Please update or remove unavailable items before continuing.',
                    });
                    return;
                }

                router.replace('/account/address');
            }
        );
    };

    const feedbackContent = feedback && (
        <p
            role={feedback.error ? 'alert' : 'status'}
            className={`text-sm ${
                feedback.error ? 'text-red-600' : 'text-green-700'
            }`}
        >
            {feedback.text}
        </p>
    );

    return (
        <main className="bg-white min-h-screen pb-16 overflow-hidden flex flex-col">
            {/* Checkout progress */}
            <div className="w-full flex justify-center mt-8 md:mt-12 lg:mt-16 px-4">
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[10px] sm:text-sm md:text-base font-medium">
                    <span className="text-[#BF8F5F] font-bold border-b-2 border-[#BF8F5F] pb-1">
                        Cart
                    </span>
                    <span className="w-8 sm:w-16 md:w-24 border-t-2 border-dashed border-[#BF8F5F] opacity-60" />
                    <span className="text-gray-400 pb-1">Address</span>
                    <span className="w-8 sm:w-16 md:w-24 border-t-2 border-dashed border-gray-300" />
                    <span className="text-gray-400 pb-1">Payment</span>
                </div>
            </div>

            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto w-full mt-10 md:mt-12 lg:mt-[60px] flex-grow">
                {!sizeItem && feedback && (
                    <div className="mb-6">{feedbackContent}</div>
                )}

                {loading ? (
                    <p role="status" className="py-16 text-center text-gray-500">
                        Loading your cart…
                    </p>
                ) : !cartData ? (
                    <div className="py-16 text-center">
                        <button
                            onClick={loadCart}
                            className="border border-[#BF8F5F] px-6 py-3 text-[#BF8F5F]"
                        >
                            Try Again
                        </button>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="py-16 text-center">
                        <h1 className="font-serif text-3xl mb-3">
                            Your cart is empty
                        </h1>
                        <p className="text-gray-500 mb-6">
                            Find a little sparkle to make it yours.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-[#BF8F5F] text-white px-8 py-3 text-sm font-bold"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                        {/* Cart items */}
                        <div className="w-full lg:w-[60%] min-w-0">
                            <div className="flex flex-wrap justify-between items-end gap-3 mb-8 lg:mb-12">
                                <h1 className="font-serif text-3xl sm:text-4xl text-[#222222]">
                                    Shopping Cart
                                </h1>
                                <span className="text-[#BF8F5F] font-bold text-sm">
                                    {summary.totalQty} Items in Cart
                                </span>
                            </div>

                            <div className="flex flex-col gap-8 lg:gap-10">
                                {cartItems.map((item) => {
                                    const option = getSelectedDimension(item);
                                    const stock = getStock(option);
                                    const quantity = Number(item.quantity);
                                    const available = itemIsAvailable(cartData, item);

                                    const canIncrease =
                                        available &&
                                        getRequiredStock(cartData, item, option._id) < stock;

                                    return (
                                        <article
                                            key={item._id}
                                            className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6 relative"
                                        >
                                            <Link
                                                href={`/product/${item.productId}`}
                                                className="w-24 h-24 sm:w-32 sm:h-32 bg-[#FCF6F2] rounded-sm shrink-0"
                                            >
                                                <Image
                                                    src={item.thumbnail || '/placeholder.webp'}
                                                    alt={item.title}
                                                    width={128}
                                                    height={128}
                                                    className="object-contain w-full h-full"
                                                />
                                            </Link>

                                            <div className="flex-grow min-w-0 w-full">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="min-w-0">
                                                        <Link
                                                            href={`/product/${item.productId}`}
                                                            className="block text-[#222222] font-bold text-sm leading-snug mb-2 hover:text-[#BF8F5F]"
                                                        >
                                                            {item.title}
                                                        </Link>

                                                        {item.sku && (
                                                            <p className="text-gray-500 text-xs mb-1">
                                                                {item.sku}
                                                            </p>
                                                        )}

                                                        <p className="text-[#BF8F5F] font-bold text-sm mb-1">
                                                            {formatPrice(item.price)}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        disabled={busy}
                                                        onClick={() =>
                                                            performAction(
                                                                () => removeItem(item._id),
                                                                `remove:${item._id}`,
                                                                'Item removed from your cart.'
                                                            )
                                                        }
                                                        aria-label={`Remove ${item.title}`}
                                                        className="absolute top-0 right-0 sm:relative w-8 h-8 sm:w-10 sm:h-10 border border-[#BF8F5F] text-[#BF8F5F] flex items-center justify-center rounded-sm hover:bg-[#BF8F5F] hover:text-white transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <CloseIcon />
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-bold text-[#222222]">
                                                    <button
                                                        type="button"
                                                        disabled={busy || getOptions(item).length === 0}
                                                        onClick={() => {
                                                            setFeedback(null);
                                                            setSizeItemId(item._id);
                                                        }}
                                                        aria-haspopup="dialog"
                                                        className="flex items-center gap-2 disabled:opacity-40"
                                                    >
                                                        <span>Size :</span>
                                                        <span className="text-[#BF8F5F]">
                                                            {option
                                                                ? option.size?.trim() || 'Standard'
                                                                : 'Choose Option'}
                                                        </span>
                                                        <span className="text-[#BF8F5F]" aria-hidden="true">
                                                            ▾
                                                        </span>
                                                    </button>

                                                    <div className="flex items-center gap-2">
                                                        <span className="mr-1">Quantity :</span>
                                                        <button
                                                            type="button"
                                                            disabled={busy || quantity <= 1}
                                                            onClick={() => handleQuantity(item, 'decrement')}
                                                            aria-label={`Decrease quantity of ${item.title}`}
                                                            className="w-8 h-8 text-[#BF8F5F] hover:bg-[#FCF6F2] disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="text-[#BF8F5F] min-w-4 text-center">
                                                            {quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            disabled={busy || !canIncrease}
                                                            onClick={() => handleQuantity(item, 'increment')}
                                                            aria-label={`Increase quantity of ${item.title}`}
                                                            className="w-8 h-8 text-[#BF8F5F] hover:bg-[#FCF6F2] disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {(option?.width?.trim() || option?.length?.trim()) && (
                                                    <p className="mt-0 text-xs text-gray-500">
                                                        {[
                                                            option.width?.trim() && `W: ${option.width}`,
                                                            option.length?.trim() && `L: ${option.length}`,
                                                        ].filter(Boolean).join(' · ')}
                                                    </p>
                                                )}

                                                {!available && (
                                                    <p className="mt-3 text-xs font-bold text-red-600">
                                                        {!option
                                                            ? 'Please choose an available size or remove this item.'
                                                            : stock === 0
                                                                ? 'OUT OF STOCK'
                                                                : `Only ${stock} available. Reduce the quantity or change the size.`}
                                                    </p>
                                                )}

                                                <p className="mt-3 text-xs text-gray-500">
                                                    Item total: {formatPrice(item.itemTotal)}
                                                </p>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="hidden lg:block w-px bg-gray-200 shrink-0" />

                        {/* Coupon and summary */}
                        <div className="w-full lg:w-[35%] min-w-0 pt-8 lg:pt-0 border-t lg:border-t-0 border-gray-200">
                            <div className="mb-10">
                                <h2 className="font-serif text-2xl text-[#222222] mb-5">
                                    Apply Coupon
                                </h2>

                                <form onSubmit={handleCoupon} className="flex h-12">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={event => setCouponCode(event.target.value)}
                                        disabled={busy}
                                        placeholder="Coupon Code"
                                        aria-label="Coupon code"
                                        className="min-w-0 flex-grow bg-[#FCF6F2] px-4 text-sm text-[#222222] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#BF8F5F]"
                                    />
                                    <button
                                        type="submit"
                                        disabled={busy || !couponCode.trim()}
                                        aria-label="Apply coupon"
                                        className="bg-[#BF8F5F] w-12 shrink-0 flex items-center justify-center text-white hover:bg-black transition-colors disabled:opacity-40"
                                    >
                                        {processing === 'coupon' ? '…' : '→'}
                                    </button>
                                </form>

                                {cartData.coupon?.code && (
                                    <p className="mt-3 text-xs font-bold text-green-700">
                                        Applied: {cartData.coupon.code}
                                    </p>
                                )}
                            </div>

                            <h2 className="font-serif text-2xl text-[#222222] mb-6">
                                Order Summary
                            </h2>

                            <div className="flex flex-col gap-4 text-sm mb-6">
                                <div className="flex justify-between gap-4">
                                    <span>Subtotal</span>
                                    <span className="font-bold">
                                        {formatPrice(summary.subtotal)}
                                    </span>
                                </div>

                                {Number(summary.discount) > 0 && (
                                    <div className="flex justify-between gap-4">
                                        <span>Coupon Discount</span>
                                        <span className="font-bold text-green-700">
                                            −{formatPrice(summary.discount)}
                                        </span>
                                    </div>
                                )}

                                {Number(summary.tax) > 0 && (
                                    <div className="flex justify-between gap-4">
                                        <span>Tax</span>
                                        <span className="font-bold">
                                            {formatPrice(summary.tax)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between gap-4">
                                    <span>Shipping (Standard)</span>
                                    <span className="font-bold">
                                        {Number(summary.shipping) === 0
                                            ? 'Free'
                                            : formatPrice(summary.shipping)}
                                    </span>
                                </div>
                            </div>

                            <hr className="border-gray-200 mb-6" />

                            <div className="flex justify-between items-center gap-4 mb-8">
                                <span className="font-bold text-lg text-[#222222]">
                                    Total Cost
                                </span>
                                <span className="font-bold text-xl sm:text-2xl text-[#BF8F5F]">
                                    {formatPrice(summary.totalCost)}
                                </span>
                            </div>

                            {!canCheckout && (
                                <p className="text-xs text-red-600 mb-4">
                                    Update or remove unavailable items to continue.
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleCheckout}
                                disabled={busy || !canCheckout}
                                className="w-full bg-[#BF8F5F] text-white font-bold tracking-[0.15em] uppercase py-4 hover:bg-black transition-colors rounded-sm text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {processing === 'checkout'
                                    ? 'Checking Cart…'
                                    : 'Continue To Address'}
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Trust badges */}
            <div className="w-full max-w-[1440px] mx-auto mt-20 lg:mt-32 pt-10 border-t border-gray-100">
                <div className="px-4 sm:px-8 lg:px-20 grid grid-cols-2 lg:flex lg:justify-between gap-y-8 gap-x-4 lg:gap-6 pb-6 lg:pb-0">
                    {trustBadges.map(badge => (
                        <div
                            key={badge.title}
                            className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start"
                        >
                            <Image
                                src={badge.icon}
                                alt=""
                                width={40}
                                height={40}
                                className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                            />
                            <div>
                                <h3 className="text-[#222222] font-sans font-bold text-xs lg:text-base leading-snug mb-0.5">
                                    {badge.title}
                                </h3>
                                <p className="text-[#222222] font-sans text-[10px] lg:text-sm leading-tight opacity-50">
                                    {badge.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Size picker */}
            <dialog
                ref={dialogRef}
                aria-labelledby="cart-size-title"
                onCancel={(event) => {
                    event.preventDefault();

                    if (!pendingRef.current) setSizeItemId(null);
                }}
                onClick={(event) => {
                    if (
                        event.target !== event.currentTarget ||
                        pendingRef.current
                    ) {
                        return;
                    }

                    const bounds = event.currentTarget.getBoundingClientRect();

                    if (
                        event.clientX < bounds.left ||
                        event.clientX > bounds.right ||
                        event.clientY < bounds.top ||
                        event.clientY > bounds.bottom
                    ) {
                        setSizeItemId(null);
                    }
                }}
                style={{ height: 'fit-content' }}
                className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none max-h-[80dvh] overflow-y-auto p-0 bg-white text-[#222222] rounded-t-2xl shadow-xl sm:rounded-sm sm:inset-0 sm:m-auto sm:w-[calc(100%-2rem)] sm:max-w-[480px] [&::backdrop]:bg-black/40"
            >
                {sizeItem && (
                    <div className="p-5 sm:p-7">
                        <div className="flex justify-between items-start gap-4 mb-5">
                            <div>
                                <h2
                                    id="cart-size-title"
                                    className="font-serif text-2xl mb-1"
                                >
                                    Choose Size / Dimension
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {sizeItem.title}
                                </p>
                            </div>
                            <button
                                type="button"
                                autoFocus
                                disabled={busy}
                                onClick={() => setSizeItemId(null)}
                                aria-label="Close size picker"
                                className="w-8 h-8 shrink-0 border border-[#BF8F5F] text-[#BF8F5F] flex items-center justify-center disabled:opacity-40"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {feedback && (
                            <div className="mb-4">{feedbackContent}</div>
                        )}

                        {processing === 'size' && (
                            <p role="status" className="text-sm text-gray-500 mb-4">
                                Updating size…
                            </p>
                        )}

                        <div className="flex flex-col gap-2">
                            {sizeOptions.map(option => {
                                const stock = getStock(option);
                                const soldOut = stock === 0;
                                const required = getRequiredStock(
                                    cartData,
                                    sizeItem,
                                    option._id
                                );
                                const insufficient = required > stock;
                                const selected =
                                    String(option._id) === String(sizeItem.dimensionId);

                                return (
                                    <button
                                        key={option._id}
                                        type="button"
                                        disabled={busy || insufficient}
                                        onClick={() => handleSizeChange(option)}
                                        aria-pressed={selected}
                                        className={`flex items-center justify-between gap-4 p-4 border text-left transition-colors ${
                                            selected
                                                ? 'border-[#BF8F5F] bg-[#FCF6F2]'
                                                : 'border-gray-200 hover:border-[#BF8F5F]'
                                        } disabled:cursor-not-allowed ${
                                            insufficient ? 'opacity-50' : ''
                                        }`}
                                    >
                                        <div>
                                            <span
                                                className={`block text-sm font-medium ${
                                                    soldOut ? 'line-through' : ''
                                                }`}
                                            >
                                                {getDimensionLabel(option)}
                                            </span>

                                            {insufficient && (
                                                <span className="block mt-1 text-xs text-red-600">
                                                    {soldOut
                                                        ? 'Out of stock'
                                                        : `Only ${stock} available for this option`}
                                                </span>
                                            )}
                                        </div>

                                        <span
                                            aria-hidden="true"
                                            className={soldOut ? 'text-red-600' : 'text-[#BF8F5F]'}
                                        >
                                            {soldOut ? '×' : selected ? '✓' : ''}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </dialog>
        </main>
    );
}