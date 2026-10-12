'use client';
import React, { useEffect, useState } from 'react';
import { getMyOrdersApi } from '../../../api/orderApi';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderSuccess() {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const loadOrder = async () => {
            try {
                const orderId = new URLSearchParams(
                    window.location.search
                ).get('orderId');

                if (!orderId) {
                    throw new Error('No order was selected.');
                }

                const response = await getMyOrdersApi();

                if (!active) return;

                if (!response.success || !Array.isArray(response.orders)) {
                    throw new Error('Unable to load your order.');
                }

                const selectedOrder = response.orders.find(
                    item => String(item._id) === orderId
                );

                if (!selectedOrder) {
                    throw new Error('Order not found.');
                }

                setOrder(selectedOrder);
            } catch (err) {
                if (!active) return;

                if (err.status === 401) {
                    window.location.replace('/login');
                    return;
                }

                setError(
                    err.data?.error ||
                    err.message ||
                    'Unable to load your order.'
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        loadOrder();

        return () => {
            active = false;
        };
    }, []);

    const shippingAddress = order?.shippingAddress || {};

    const formatPrice = value => {
        if (value == null || !Number.isFinite(Number(value))) {
            return '—';
        }

        return `Rs. ${Number(value).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const relatedProducts = [
        {
            id: 1,
            name: "Anes Narrow Diamond Ring in 18k rose old",
            price: "$699.00",
            img: "/images/Ring2.webp",
        },
        {
            id: 2,
            name: "Anes Narrow Diamond Ring in 18k rose old",
            price: "$699.00",
            img: "/images/Ring1.webp",
        }
    ];

    if (loading) {
        return (
            <main className="bg-white min-h-screen flex items-center justify-center">
                <p role="status" className="text-sm text-[#BF8F5F]">
                    Loading your order…
                </p>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="bg-white min-h-screen flex flex-col items-center justify-center gap-4 px-4">
                <p role="alert" className="text-sm text-red-500 text-center">
                    {error || 'Order not found.'}
                </p>

                <Link
                    href="/account/orders"
                    className="text-[#BF8F5F] text-sm font-bold hover:underline"
                >
                    View My Orders
                </Link>
            </main>
        );
    }

    return (
        <main className="bg-white min-h-screen pb-16 overflow-hidden flex flex-col">

            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto w-full mt-16 md:mt-24 lg:mt-[100px] flex-grow">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left Column: Order Confirmation Details */}
                    <div className="w-full lg:w-[60%] flex flex-col gap-10">

                        {/* Header */}
                        <div>
                            <h1 className="font-serif text-4xl lg:text-5xl text-[#222222] mb-4">
                                Thank You! For Placing An Order
                            </h1>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
                                Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks. We also provide certificates of authenticity for our diamond and gemstone jewelry.
                            </p>
                        </div>

                        {/* Ordered Products */}
                        <div className="flex flex-col gap-6">
                            {(order.items || []).map(item => {
                                const product = item.product;

                                return (
                                    <div key={item._id} className="flex items-start gap-6">
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#FCF6F2] rounded-sm flex items-center justify-center shrink-0">
                                            {product?.thumbnail && (
                                                <Image
                                                    src={product.thumbnail}
                                                    alt={product.title || 'Ordered product'}
                                                    width={100}
                                                    height={100}
                                                    className="object-contain w-full h-full"
                                                />
                                            )}
                                        </div>

                                        <div className="flex flex-col pt-1 min-w-0">
                                            <h3 className="font-bold text-[#222222] text-sm sm:text-base leading-tight mb-2 max-w-[90%]">
                                                {product?.title || 'Product unavailable'}
                                            </h3>

                                            <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm font-medium mb-3">
                                                {item._id && (
                                                    <span className="text-gray-400">
                                                        #{String(item._id).slice(-8).toUpperCase()}
                                                    </span>
                                                )}

                                                {item.size && (
                                                    <div className="flex gap-2">
                                                        <span className="text-[#222222]">
                                                            Size :
                                                        </span>
                                                        <span className="text-[#BF8F5F] font-bold">
                                                            {item.size}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex gap-2">
                                                    <span className="text-[#222222]">
                                                        Quantity :
                                                    </span>
                                                    <span className="text-[#BF8F5F] font-bold">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-[#BF8F5F] font-bold text-base sm:text-lg">
                                                {formatPrice(item.priceAtPurchase)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Shipping Address */}
                        <div>
                            <h2 className="font-serif text-2xl text-[#222222] mb-6">
                                Shipping Address
                            </h2>

                            <div className="border border-[#BF8F5F]/30 p-6 rounded-sm">
                                <h3 className="font-bold text-[#222222] text-base mb-3">
                                    {shippingAddress.fullName ||
                                        [
                                            shippingAddress.firstName,
                                            shippingAddress.lastName,
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                </h3>

                                <p className="text-gray-500 text-sm leading-relaxed max-w-md mb-6">
                                    {[
                                        shippingAddress.addressLine1,
                                        shippingAddress.addressLine2,
                                        shippingAddress.area,
                                        shippingAddress.city,
                                    ]
                                        .filter(Boolean)
                                        .join(', ')}

                                    <br className="hidden sm:block" />

                                    {[
                                        shippingAddress.dist,
                                        shippingAddress.state,
                                        shippingAddress.country || 'India',
                                        shippingAddress.pincode,
                                    ]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>

                                {shippingAddress.phone && (
                                    <div className="text-sm text-[#222222] flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-12">
                                        <span>Mobile:</span>
                                        <span className="font-bold">
                                            {shippingAddress.phone}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-4">
                            <Link
                                href="/"
                                className="inline-block bg-[#BF8F5F] text-white font-bold tracking-[0.2em] uppercase py-4 px-10 hover:bg-black transition-colors rounded-sm text-xs sm:text-sm text-center"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Vertical Divider (Desktop Only) */}
                    <div className="hidden lg:block w-px bg-gray-200"></div>

                    {/* Right Column: Related Products */}
                    <div className="w-full lg:w-[35%] flex flex-col pt-8 lg:pt-0 border-t lg:border-t-0 border-gray-200">
                        <div className="mb-8">
                            <span className="text-[#BF8F5F] font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-2 block">
                                RECENTLY VIEWED
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl text-[#222222] mb-4">
                                Related Products
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Discover our handpicked selection of exquisite jewelry pieces, curated
                            </p>
                        </div>

                        {/* Related Products Grid */}
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            {relatedProducts.map((product) => (
                                <div key={product.id} className="group cursor-pointer flex flex-col">
                                    <div className="relative aspect-square bg-[#FCF6F2] mb-4 overflow-hidden rounded-sm">
                                        <Image
                                            src={product.img}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <h3 className="text-[#222222] font-bold text-xs sm:text-sm leading-tight">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Image src="/icons/Heart.svg" alt="Wishlist" width={16} height={16} className="w-3.5 h-3.5 hover:opacity-50 transition-opacity" />
                                            <Image src="/icons/Cart.svg" alt="Add to Cart" width={16} height={16} className="w-3.5 h-3.5 hover:opacity-50 transition-opacity" />
                                        </div>
                                    </div>
                                    <p className="text-[#222222] font-bold text-xs sm:text-sm mt-2">
                                        {product.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}