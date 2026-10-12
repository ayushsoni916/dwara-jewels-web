'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { getCart } from '../../../api/cartApi';
import { getAddresses } from '../../../api/addressApi';
import { placeOrderApi } from '../../../api/orderApi';

export default function CheckoutPayment() {
    const router = useRouter();
    const submittingRef = useRef(false);

    const [selectedPayment, setSelectedPayment] = useState('Online');
    const [savedAddress, setSavedAddress] = useState(null);
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;

        const loadCheckout = async () => {
            try {
                const addressId = new URLSearchParams(
                    window.location.search
                ).get('addressId');

                if (!addressId) {
                    router.replace('/account/address');
                    return;
                }

                const [addressResponse, cartResponse] = await Promise.all([
                    getAddresses(),
                    getCart(),
                ]);

                if (!active) return;

                if (
                    !addressResponse.success ||
                    !Array.isArray(addressResponse.addresses)
                ) {
                    throw new Error('Unable to load your address.');
                }

                if (!cartResponse.success) {
                    throw new Error('Unable to load your cart.');
                }

                const address = addressResponse.addresses.find(
                    item => String(item._id) === addressId
                );

                if (!address) {
                    router.replace('/account/address');
                    return;
                }

                if (!cartResponse.cart?.items?.length) {
                    router.replace('/account/cart');
                    return;
                }

                setSavedAddress(address);
                setCartData(cartResponse.cart);
            } catch (err) {
                if (!active) return;

                if (err.status === 401) {
                    window.location.replace('/login');
                    return;
                }

                setError(
                    err.data?.error ||
                    err.message ||
                    'Unable to load checkout.'
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCheckout();

        return () => {
            active = false;
        };
    }, [router]);

    const summary = cartData?.summary || {};

    const formatPrice = value => {
        if (loading) return '…';
        if (!cartData) return '—';

        return `Rs. ${Number(value ?? 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const canPlaceOrder =
        !loading &&
        !placingOrder &&
        Boolean(savedAddress?._id) &&
        Boolean(cartData?.items?.length);

    const handlePlaceOrder = async () => {
        if (submittingRef.current || !canPlaceOrder) return;

        submittingRef.current = true;
        setPlacingOrder(true);
        setError('');

        let orderCreated = false;

        try {
            const response = await placeOrderApi(
                savedAddress,
                selectedPayment
            );

            if (!response.success || !response.order?._id) {
                throw new Error(
                    response.error ||
                    response.message ||
                    'Unable to place your order.'
                );
            }

            orderCreated = true;

            router.replace(
                `/account/success?orderId=${encodeURIComponent(
                    response.order._id
                )}`
            );
        } catch (err) {
            if (err.status === 401) {
                window.location.replace('/login');
                return;
            }

            setError(
                err.data?.error ||
                err.message ||
                'Unable to place your order.'
            );
        } finally {
            // Keep the button locked after success while navigating.
            if (!orderCreated) {
                submittingRef.current = false;
                setPlacingOrder(false);
            }
        }
    };


    return (
        <main className="bg-white min-h-screen pb-16 overflow-hidden flex flex-col">

            {/* Checkout Progress Stepper - Updated to 'Payment' Active Step */}
            <div className="w-full flex justify-center mt-8 md:mt-12 lg:mt-16 px-4">
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[10px] sm:text-sm md:text-base font-medium">
                    {/* Cart (Completed) */}
                    <div className="text-[#BF8F5F] font-bold pb-1">
                        Cart
                    </div>
                    <div className="w-8 sm:w-16 md:w-24 border-t-2 border-dashed border-[#BF8F5F]"></div>

                    {/* Address (Completed) */}
                    <div className="text-[#BF8F5F] font-bold pb-1">
                        Address
                    </div>
                    <div className="w-8 sm:w-16 md:w-24 border-t-2 border-dashed border-[#BF8F5F]"></div>

                    {/* Payment (Active) */}
                    <div className="text-[#BF8F5F] font-bold border-b-2 border-[#BF8F5F] pb-1">
                        Payment
                    </div>
                </div>
            </div>

            {/* Main Checkout Section */}
            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto w-full mt-10 md:mt-12 lg:mt-[60px] flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

                    {/* Column 1: Payment Options */}
                    <div className="flex flex-col">
                        <h2 className="font-serif text-2xl text-[#222222] mb-6">Payment Options</h2>
                        <div className="flex flex-col gap-4">

                            {/* Pay Online Option Card */}
                            <div
                                onClick={() => {
                                    if (!submittingRef.current) setSelectedPayment('Online');
                                }}

                                className={`p-5 rounded-sm border cursor-pointer transition-all flex items-start gap-4 ${selectedPayment === 'Online'
                                    ? 'border-[#BF8F5F] bg-[#FCF6F2]/50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <div className="w-10 h-10 bg-[#FCF6F2] rounded flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-[#BF8F5F]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-[#222222] mb-1">Pay Online</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">Credit, Debit , UPI, Net banking & More</p>
                                </div>
                            </div>

                            {/* Cash On Delivery Option Card */}
                            <div
                                onClick={() => {
                                    if (!submittingRef.current) setSelectedPayment('COD');
                                }}
                                className={`p-5 rounded-sm border cursor-pointer transition-all flex items-start gap-4 ${selectedPayment === 'COD'
                                    ? 'border-[#BF8F5F] bg-[#FCF6F2]/50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                            >
                                <div className="w-10 h-10 bg-[#FCF6F2] rounded flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-[#BF8F5F]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path d="M21 8v13H3V8M1 3h22v5H1V3zm10 9h4" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-[#222222] mb-1">Cash On Delivery</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">An Applicable Fees will be charged</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Column 2: Billing Address Review */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-serif text-2xl text-[#222222]">Billing Address</h2>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 mb-4">We will not send an invoice to the shipping address</p>

                        {/* Address Summary Card matching screenshot */}
                        <div className="border border-[#BF8F5F]/40 bg-white rounded-sm overflow-hidden">
                            <div className="bg-[#FCF6F2] px-6 py-4 flex justify-between items-center border-b border-[#BF8F5F]/20">
                                <span className="text-xs font-medium text-[#222222]">Address</span>
                                <button
                                    type="button"
                                    onClick={() => router.push('/account/address')}
                                    disabled={loading || placingOrder}
                                    className="text-[#BF8F5F] text-xs font-bold hover:underline"
                                >
                                    Change Address
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <div>
                                    <h3 className="font-bold text-[#222222] text-base mb-2">
                                        {loading
                                            ? 'Loading…'
                                            : [savedAddress?.firstName, savedAddress?.lastName]
                                                .filter(Boolean)
                                                .join(' ')}
                                    </h3>

                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                        {savedAddress && (
                                            <>
                                                {[
                                                    savedAddress.addressLine1,
                                                    savedAddress.addressLine2,
                                                    savedAddress.area,
                                                    savedAddress.city,
                                                    savedAddress.dist,
                                                    savedAddress.state,
                                                    savedAddress.country || 'India',
                                                ]
                                                    .filter(Boolean)
                                                    .join(', ')}
                                                {' - '}
                                                {savedAddress.pincode}
                                            </>
                                        )}
                                    </p>
                                </div>

                                <div className="text-xs font-medium text-[#222222] pt-2 border-t border-gray-100">
                                    Mobile:
                                    <span className="font-bold ml-1">
                                        {loading ? '…' : savedAddress?.phone || '—'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Order Summary & Pay Button */}
                    <div className="flex flex-col border-t lg:border-t-0 lg:border-l lg:pl-12 border-gray-200 pt-8 lg:pt-0">
                        <div>
                            <h2 className="font-serif text-2xl text-[#222222] mb-6">Order Summary</h2>

                            <div className="flex flex-col gap-4 text-sm mb-6">
                                <div className="flex justify-between items-center text-[#222222]">
                                    <span>Subtotal</span>
                                    <span className="font-bold">
                                        {formatPrice(summary.subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-[#222222]">You Saved</span>
                                    <span className="font-bold text-green-500">
                                        {cartData ? '- ' : ''}
                                        {formatPrice(summary.discount)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-[#222222]">Coupon Discount</span>

                                    {cartData?.coupon?.code ? (
                                        <span className="font-bold text-[#BF8F5F]">
                                            {cartData.coupon.code}
                                        </span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => router.replace('/account/cart')}
                                            disabled={loading || placingOrder}
                                            className="font-bold text-[#BF8F5F] hover:underline"
                                        >
                                            Apply Discount
                                        </button>
                                    )}
                                </div>

                                {Number(summary.tax) > 0 && (
                                    <div className="flex justify-between items-center text-[#222222]">
                                        <span>Tax</span>
                                        <span className="font-bold">
                                            {formatPrice(summary.tax)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-[#222222]">
                                    <span>Shipping (Standard)</span>
                                    <span className="font-bold">
                                        {cartData && Number(summary.shipping ?? 0) === 0
                                            ? 'Free'
                                            : formatPrice(summary.shipping)}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-200 mb-6" />

                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-lg text-[#222222]">
                                    Total Cost
                                </span>
                                <span className="font-bold text-xl sm:text-2xl text-[#BF8F5F]">
                                    {formatPrice(summary.totalCost)}
                                </span>
                            </div>

                            {error && (
                                <p role="alert" className="text-sm text-red-500 mb-4">
                                    {error}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                disabled={!canPlaceOrder}
                                aria-busy={placingOrder}
                                className="w-full bg-[#BF8F5F] text-white font-bold tracking-[0.2em] uppercase py-4 hover:bg-black transition-colors rounded-sm text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? 'Loading…'
                                    : placingOrder
                                        ? 'Placing Order…'
                                        : 'Place Order'}
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            {/* Bottom 4 Section (Trust Badges) */}
            <div className="w-full max-w-[1440px] mx-auto mt-20 lg:mt-32 pt-10 border-t border-gray-100">
                <div className="px-4 sm:px-8 lg:px-20 grid grid-cols-2 lg:flex lg:justify-between gap-y-8 gap-x-4 lg:gap-6 relative z-10 pb-6 lg:pb-0">

                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image src="/icons/Certified.svg" alt="Certified" width={40} height={40} className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0" />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">Certified</h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">Available certificates of authenticity</p>
                        </div>
                    </div>

                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image src="/icons/Secure.svg" alt="Secure" width={40} height={40} className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0" />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">Secure</h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">Certified marketplace since 2017</p>
                        </div>
                    </div>

                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image src="/icons/Ship.svg" alt="Shipping" width={40} height={40} className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0" />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">Shipping</h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">Free, fast, and reliable worldwide</p>
                        </div>
                    </div>

                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image src="/icons/Transparent.svg" alt="Transparent" width={40} height={40} className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0" />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">Transparent</h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">Hassle-free return policy</p>
                        </div>
                    </div>

                </div>
            </div>

        </main>
    );
}