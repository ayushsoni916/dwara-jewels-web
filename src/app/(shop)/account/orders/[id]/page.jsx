'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AccountSidebar from '../../../components/AccountSidebar';
import { getOrderDetailsApi } from '../../../../api/orderApi';

const formatPrice = value =>
    value == null || !Number.isFinite(Number(value))
        ? '—'
        : `Rs. ${Number(value).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

const formatDate = value => {
    if (!value) return '—';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
};

export default function OrderDetailsPage() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        let active = true;

        const loadOrder = async () => {
            setLoading(true);
            setError('');
            setOrder(null);

            try {
                const response = await getOrderDetailsApi(id);
                if (active) setOrder(response.order);
            } catch (err) {
                if (!active) return;

                if (err.status === 401) {
                    window.location.replace('/login');
                    return;
                }

                setError(
                    err.data?.error || err.message || 'Unable to load order.'
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        loadOrder();

        return () => {
            active = false;
        };
    }, [id]);

    const address = order?.shippingAddress || {};
    const items = order?.items || [];
    const summary = order?.summary || {};

    return (
        <main className="bg-white min-h-screen pb-16">
            <div className="w-full bg-[#FCF6F2] py-8 lg:py-12 px-4 sm:px-8 lg:px-20 mb-10 lg:mb-16">
                <div className="max-w-[1440px] mx-auto flex gap-3 text-xs sm:text-[13px] font-medium">
                    <Link href="/" className="text-gray-400">Home</Link>
                    <span className="text-gray-300">|</span>
                    <Link href="/account/orders" className="text-gray-400">
                        Orders
                    </Link>
                    <span className="text-gray-300">|</span>
                    <span className="text-[#BF8F5F] font-bold">
                        Order Details
                    </span>
                </div>
            </div>

            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    <AccountSidebar activeTab="orders" />

                    <div className="flex-1 lg:pl-4 min-w-0">
                        <Link
                            href="/account/orders"
                            className="text-[#BF8F5F] text-xs font-bold hover:underline"
                        >
                            ← Back to Orders
                        </Link>

                        <h1 className="font-serif text-3xl text-[#222222] mt-6 mb-3">
                            Order Details
                        </h1>

                        {loading && (
                            <p role="status" className="text-sm text-[#BF8F5F]">
                                Loading your order…
                            </p>
                        )}

                        {error && (
                            <p role="alert" className="text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        {!loading && order && (
                            <div className="flex flex-col gap-8">
                                <div>
                                    <p className="text-[13px] text-gray-400 break-all mb-4">
                                        #{String(order._id).toUpperCase()}
                                    </p>
                                    <p className="text-sm text-[#222222] mb-2">
                                        Order Status:{' '}
                                        <span className="text-[#BF8F5F] font-bold">
                                            {order.status}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Placed on:{' '}
                                        {formatDate(order.orderDate || order.createdAt)}
                                    </p>
                                </div>

                                <div>
                                    <h2 className="font-serif text-2xl text-[#222222] mb-6">
                                        Shipping Address
                                    </h2>
                                    <div className="border border-[#BF8F5F]/30 p-6 rounded-sm">
                                        <h3 className="font-bold text-[#222222] mb-3">
                                            {address.fullName ||
                                                [address.firstName, address.lastName]
                                                    .filter(Boolean)
                                                    .join(' ')}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {[
                                                address.addressLine1,
                                                address.addressLine2,
                                                address.area,
                                                address.city,
                                                address.dist,
                                                address.state,
                                                address.country || 'India',
                                                address.pincode,
                                            ].filter(Boolean).join(', ')}
                                        </p>
                                        {address.phone && (
                                            <p className="text-sm text-[#222222] mt-4">
                                                Mobile:{' '}
                                                <span className="font-bold">
                                                    {address.phone}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="font-serif text-2xl text-[#222222] mb-6">
                                        Items ({items.length})
                                    </h2>

                                    <div className="flex flex-col gap-6">
                                        {items.map(item => (
                                            <div
                                                key={item._id}
                                                className="flex items-start gap-6 pb-6 border-b border-gray-100"
                                            >
                                                <div className="w-24 h-24 bg-[#FCF6F2] shrink-0">
                                                    {item.product?.thumbnail && (
                                                        <Image
                                                            src={item.product.thumbnail}
                                                            alt={item.product.title || 'Ordered product'}
                                                            width={100}
                                                            height={100}
                                                            className="object-contain w-full h-full"
                                                        />
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-[#222222] text-sm mb-3">
                                                        {item.product?.title || 'Product unavailable'}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                                                        {item.size && (
                                                            <span>
                                                                Size:{' '}
                                                                <strong className="text-[#BF8F5F]">
                                                                    {item.size}
                                                                </strong>
                                                            </span>
                                                        )}
                                                        <span>
                                                            Quantity:{' '}
                                                            <strong className="text-[#BF8F5F]">
                                                                {item.quantity}
                                                            </strong>
                                                        </span>
                                                    </div>
                                                    <p className="font-bold text-[#BF8F5F]">
                                                        {formatPrice(item.priceAtPurchase)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h2 className="font-serif text-2xl text-[#222222] mb-6">
                                        Payment Summary
                                    </h2>

                                    <div className="flex flex-col gap-4 text-sm">
                                        <div className="flex justify-between gap-4">
                                            <span>Subtotal</span>
                                            <span className="font-bold">
                                                {formatPrice(summary.subtotal)}
                                            </span>
                                        </div>

                                        {Number(summary.discount) > 0 && (
                                            <div className="flex justify-between gap-4">
                                                <span>Discount</span>
                                                <span className="font-bold text-green-500">
                                                    - {formatPrice(summary.discount)}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between gap-4">
                                            <span>Shipping Fees</span>
                                            <span className="font-bold">
                                                {formatPrice(summary.shipping)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4 border-t border-gray-200 pt-5">
                                            <span className="font-bold">Total Amount</span>
                                            <span className="font-bold text-lg text-[#BF8F5F]">
                                                {formatPrice(summary.totalCost)}
                                            </span>
                                        </div>

                                        {order.paymentType && (
                                            <p className="text-xs text-gray-500">
                                                Payment Method: {order.paymentType}
                                            </p>
                                        )}

                                        {order.paymentStatus && (
                                            <p className="text-xs text-gray-500">
                                                Payment Status: {order.paymentStatus}
                                            </p>
                                        )}
                                    </div>

                                </div>

                                {/* Cancel / Return / Exchange Support */}
                                <div className="border border-[#BF8F5F]/30 bg-[#FCF6F2] p-5 sm:p-6 rounded-sm">
                                    <h2 className="font-serif text-xl text-[#222222] mb-2">
                                        Need Help With Your Order?
                                    </h2>

                                    <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                                        For cancellations, returns or exchanges, contact our support
                                        team. Return and exchange requests should be made within
                                        3 days of delivery. Report damaged or incorrect items
                                        within 24 hours of delivery.
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        {[
                                            { label: 'Cancel Order', type: 'Cancellation' },
                                            { label: 'Return Order', type: 'Return' },
                                            { label: 'Exchange Order', type: 'Exchange' },
                                        ].map(action => (
                                            <a
                                                key={action.type}
                                                href={`mailto:dwarajewels.official@gmail.com?subject=${encodeURIComponent(
                                                    `${action.type} Request - Order #${order._id}`
                                                )}&body=${encodeURIComponent(
                                                    `Hello Dwara Jewels Team,\n\nI would like to request a ${action.type.toLowerCase()} for my order.\n\nOrder ID: ${order._id}\n\nReason: \n\nThank you.`
                                                )}`}
                                                className="border border-[#BF8F5F] px-4 py-2.5 text-xs font-bold text-[#BF8F5F] hover:bg-[#BF8F5F] hover:text-white transition-colors"
                                            >
                                                {action.label}
                                            </a>
                                        ))}
                                    </div>

                                    <p className="mt-4 text-[11px] text-gray-500">
                                        Our team will review your request and assist you.
                                    </p>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}