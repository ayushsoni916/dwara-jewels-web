'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export default function CheckoutPayment() {
    // State to toggle between Payment Options ("Online" or "COD")
    const [selectedPayment, setSelectedPayment] = useState('Online');

    // Saved address data from the previous step
    const savedAddress = {
        fullName: "David George",
        addressLine1: "78, Shanti Nagar C, Gurjar Ki Thadi",
        addressLine2: "Mansarovar",
        city: "Jaipur",
        state: "Rajasthan",
        country: "India",
        pincode: "302019",
        phone: "+91 7865466543"
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
                                onClick={() => setSelectedPayment('Online')}
                                className={`p-5 rounded-sm border cursor-pointer transition-all flex items-start gap-4 ${
                                    selectedPayment === 'Online' 
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
                                onClick={() => setSelectedPayment('COD')}
                                className={`p-5 rounded-sm border cursor-pointer transition-all flex items-start gap-4 ${
                                    selectedPayment === 'COD' 
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
                                <button className="text-[#BF8F5F] text-xs font-bold hover:underline">
                                    Change Address
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <div>
                                    <h3 className="font-bold text-[#222222] text-base mb-2">{savedAddress.fullName}</h3>
                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                        {savedAddress.addressLine1}, {savedAddress.addressLine2}, {savedAddress.city}, {savedAddress.state}, {savedAddress.country} - {savedAddress.pincode}
                                    </p>
                                </div>
                                <div className="text-xs font-medium text-[#222222] pt-2 border-t border-gray-100">
                                    Mobile: <span className="font-bold ml-1">{savedAddress.phone}</span>
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
                                    <span className="font-bold">$45,568</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#222222]">You Saved</span>
                                    <span className="font-bold text-green-500">-$7680</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#222222]">Coupon Discount</span>
                                    <button className="font-bold text-[#BF8F5F] hover:underline">Apply Discount</button>
                                </div>
                                <div className="flex justify-between items-center text-[#222222]">
                                    <span>Shipping (Standard)</span>
                                    <span className="font-bold">Free</span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-200 mb-6"></div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-lg text-[#222222]">Total Cost</span>
                                <span className="font-bold text-xl sm:text-2xl text-[#BF8F5F]">$45,568</span>
                            </div>

                            <button className="w-full bg-[#BF8F5F] text-white font-bold tracking-[0.2em] uppercase py-4 hover:bg-black transition-colors rounded-sm text-sm sm:text-base">
                                Pay Now
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