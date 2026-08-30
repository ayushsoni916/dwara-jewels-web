'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const initialCartItems = [
    {
        id: 1,
        name: "Anes Narrow Diamond Ring in 18k rose old",
        sku: "JYU78956782",
        price: "$699.00",
        size: "M",
        qty: 1,
        img: "/images/Ring1.webp", // Replace with actual path
    },
    {
        id: 2,
        name: "Anes Narrow Diamond Ring in 18k rose old",
        sku: "JYU78956782",
        price: "$699.00",
        size: "M",
        qty: 1,
        img: "/images/Ring2.webp",
    }
];

export default function ShoppingCart() {
    const [cartItems, setCartItems] = useState(initialCartItems);

    const handleRemove = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    return (
        <main className="bg-white min-h-screen pb-16 overflow-hidden flex flex-col">
            
            {/* Checkout Progress Stepper */}
            <div className="w-full flex justify-center mt-8 md:mt-12 lg:mt-16 px-4">
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[10px] sm:text-sm md:text-base font-medium">
                    <div className="text-[#BF8F5F] font-bold border-b-2 border-[#BF8F5F] pb-1">
                        Cart
                    </div>
                    <div className="w-8 sm:w-16 md:w-24 border-t-2 border-dashed border-[#BF8F5F] opacity-60"></div>
                    <div className="text-gray-400 pb-1">
                        Address
                    </div>
                    <div className="w-8 sm:w-16 md:w-24 border-t-2 border-dashed border-gray-300"></div>
                    <div className="text-gray-400 pb-1">
                        Payment
                    </div>
                </div>
            </div>

            {/* Main Cart Section */}
            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto w-full mt-10 md:mt-12 lg:mt-[60px] flex-grow">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    
                    {/* Left Column: Cart Items */}
                    <div className="w-full lg:w-[60%] flex flex-col">
                        
                        {/* Header */}
                        <div className="flex justify-between items-end mb-8 lg:mb-12">
                            <h1 className="font-serif text-3xl sm:text-4xl text-[#222222]">Shopping Cart</h1>
                            <span className="text-[#BF8F5F] font-bold text-sm sm:text-base">
                                {cartItems.length} Items in Cart
                            </span>
                        </div>

                        {/* Items List */}
                        <div className="flex flex-col gap-8 lg:gap-10">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row items-start gap-6 relative">
                                    
                                    {/* Product Image */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#FCF6F2] rounded-sm flex items-center justify-center shrink-0 p-4">
                                        <Image 
                                            src={item.img} 
                                            alt={item.name} 
                                            width={100} 
                                            height={100} 
                                            className="object-contain w-full h-full"
                                        />
                                    </div>

                                    {/* Product Details - FONT SIZES FIXED HERE */}
                                    <div className="flex flex-col flex-grow w-full">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <h3 className="text-[#222222] font-bold text-sm leading-tight mb-1 max-w-[85%]">
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-500 text-xs mb-2">
                                                    {item.sku}
                                                </p>
                                                <p className="text-[#BF8F5F] font-bold text-sm mb-4 sm:mb-6">
                                                    {item.price}
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button 
                                                onClick={() => handleRemove(item.id)}
                                                className="absolute top-0 right-0 sm:relative w-8 h-8 sm:w-10 sm:h-10 border border-[#BF8F5F] text-[#BF8F5F] flex items-center justify-center rounded-sm hover:bg-[#BF8F5F] hover:text-white transition-colors shrink-0"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Selectors (Size & Quantity) */}
                                        <div className="flex items-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-[#222222]">
                                            <div className="flex items-center gap-2 cursor-pointer group">
                                                <span>Size :</span>
                                                <span className="text-[#BF8F5F]">{item.size}</span>
                                                <span className="text-[#BF8F5F] group-hover:translate-y-0.5 transition-transform">v</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span>Quantity :</span>
                                                <button className="text-[#BF8F5F] hover:text-black">-</button>
                                                <span className="text-[#BF8F5F]">{item.qty}</span>
                                                <button className="text-[#BF8F5F] hover:text-black">+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Vertical Divider (Desktop Only) */}
                    <div className="hidden lg:block w-px bg-gray-200"></div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-[35%] flex flex-col pt-8 lg:pt-0 border-t lg:border-t-0 border-gray-200">
                        
                        {/* Apply Coupon Section */}
                        <div className="mb-10">
                            <div className="flex justify-between items-end mb-4 sm:mb-6">
                                <h2 className="font-serif text-2xl text-[#222222]">Apply Coupon</h2>
                                <button className="text-[#BF8F5F] text-xs sm:text-sm font-bold hover:underline">
                                    Show all coupons
                                </button>
                            </div>
                            <div className="flex h-12">
                                <input 
                                    type="text" 
                                    placeholder="Coupon Code" 
                                    className="flex-grow bg-[#FCF6F2] px-4 text-sm text-[#222222] focus:outline-none placeholder-gray-400"
                                />
                                <button className="bg-[#BF8F5F] w-12 flex items-center justify-center text-white hover:bg-black transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Section */}
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
                                Place Order
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Bottom 4 Section (Trust Badges) */}
            <div className="w-full max-w-[1440px] mx-auto mt-20 lg:mt-32 pt-10 border-t border-gray-100">
                <div className="px-4 sm:px-8 lg:px-20 grid grid-cols-2 lg:flex lg:justify-between gap-y-8 gap-x-4 lg:gap-6 relative z-10 pb-6 lg:pb-0">
                    
                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image
                            src="/icons/Certified.svg" 
                            alt="Certified"
                            width={40} 
                            height={40}
                            className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                        />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                                Certified
                            </h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                                Available certificates of authenticity
                            </p>
                        </div>
                    </div>

                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image
                            src="/icons/Secure.svg"
                            alt="Secure"
                            width={40} 
                            height={40}
                            className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                        />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                                Secure
                            </h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                                Certified marketplace since 2017
                            </p>
                        </div>
                    </div>

                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image
                            src="/icons/Ship.svg"
                            alt="Shipping"
                            width={40} 
                            height={40}
                            className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                        />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                                Shipping
                            </h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                                Free, fast, and reliable worldwide
                            </p>
                        </div>
                    </div>

                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image
                            src="/icons/Transparent.svg"
                            alt="Transparent"
                            width={40} 
                            height={40}
                            className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                        />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                                Transparent
                            </h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                                Hassle-free return policy
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </main>
    );
}