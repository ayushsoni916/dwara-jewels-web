'use client';
import React, { useState } from 'react';
import Image from 'next/image';

export default function CheckoutAddress() {
    // State for toggle buttons & saved address view
    const [addressType, setAddressType] = useState('Home');
    const [billingAddress, setBillingAddress] = useState('Same');
    
    // Toggle between viewing saved address card vs editing/adding a new one
    const [savedAddress, setSavedAddress] = useState({
        fullName: "David George",
        addressLine1: "78, Shanti Nagar C, Gurjar Ki Thadi",
        addressLine2: "Mansarovar",
        city: "Jaipur",
        state: "Rajasthan",
        country: "India",
        pincode: "302019",
        phone: "+91 7865466543",
        estDelivery: "16th Dec"
    });

    const [isEditingAddress, setIsEditingAddress] = useState(!savedAddress);

    return (
        <main className="bg-white min-h-screen pb-16 overflow-hidden flex flex-col">
            
            {/* Checkout Progress Stepper */}
            <div className="w-full flex justify-center mt-8 md:mt-12 lg:mt-16 px-4">
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[10px] sm:text-sm md:text-base font-medium">
                    <div className="text-[#BF8F5F] font-bold pb-1">
                        Cart
                    </div>
                    <div className="w-8 sm:w-16 md:w-24 border-t-2 border-dashed border-[#BF8F5F]"></div>
                    <div className="text-[#BF8F5F] font-bold border-b-2 border-[#BF8F5F] pb-1">
                        Address
                    </div>
                    <div className="w-8 sm:w-16 md:w-24 border-t-2 border-dashed border-gray-300"></div>
                    <div className="text-gray-400 pb-1">
                        Payment
                    </div>
                </div>
            </div>

            {/* Main Checkout Section */}
            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto w-full mt-10 md:mt-12 lg:mt-[60px] flex-grow">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    
                    {/* Left Column: Shopping Address & Billing */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-10">
                        
                        {/* Shopping Address Section */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif text-2xl text-[#222222]">Shopping Address</h2>
                                {savedAddress && !isEditingAddress && (
                                    <button 
                                        onClick={() => setIsEditingAddress(true)}
                                        className="text-[#BF8F5F] text-xs font-bold uppercase tracking-wider hover:underline"
                                    >
                                        Change Address
                                    </button>
                                )}
                            </div>

                            {savedAddress && !isEditingAddress ? (
                                /* Saved Address Card (Matches screenshot image_4df7d7.png) */
                                <div className="border border-[#BF8F5F]/40 bg-white rounded-sm overflow-hidden">
                                    <div className="bg-[#FCF6F2] px-6 py-4 flex justify-between items-center border-b border-[#BF8F5F]/20">
                                        <span className="text-xs font-medium text-[#222222]">
                                            Est. Delivery <strong className="font-bold">{savedAddress.estDelivery}</strong>
                                        </span>
                                        <button className="text-[#BF8F5F] text-xs font-bold hover:underline">
                                            Change Date
                                        </button>
                                    </div>
                                    <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                        <div>
                                            <h3 className="font-bold text-[#222222] text-base mb-2">{savedAddress.fullName}</h3>
                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md">
                                                {savedAddress.addressLine1}, {savedAddress.addressLine2}, {savedAddress.city}, {savedAddress.state}, {savedAddress.country} - {savedAddress.pincode}
                                            </p>
                                        </div>
                                        <div className="text-xs font-medium text-[#222222] shrink-0">
                                            Mobile: <span className="font-bold ml-1">{savedAddress.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Address Input Form UI */
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-[#222222] font-medium">Address Line 1</label>
                                            <input type="text" placeholder="Address Line 1" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-[#222222] font-medium">Address Line 2</label>
                                            <input type="text" placeholder="Address Line 2" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-[#222222] font-medium">Area</label>
                                            <input type="text" placeholder="Area" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-[#222222] font-medium">Landmark <span className="text-gray-400">(Optional)</span></label>
                                            <input type="text" placeholder="Landmark" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-[#222222] font-medium">City</label>
                                            <input type="text" placeholder="City" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-[#222222] font-medium">Pincode</label>
                                            <input type="text" placeholder="Pincode" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-[#222222] font-medium">State</label>
                                            <input type="text" placeholder="State" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs text-[#222222] font-medium">Country</label>
                                            <input type="text" placeholder="Country" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                        </div>
                                    </div>

                                    {/* Address Type Selection */}
                                    <div className="mt-2">
                                        <h3 className="font-serif text-xl text-[#222222] mb-1">Address Type</h3>
                                        <p className="text-[10px] sm:text-xs text-gray-400 mb-4">Preferences will help us plan your delivery.</p>
                                        <div className="flex gap-4">
                                            <button 
                                                onClick={() => setAddressType('Home')}
                                                className={`py-3 px-6 text-xs font-bold rounded-sm border transition-colors ${addressType === 'Home' ? 'border-[#BF8F5F] text-[#BF8F5F]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}
                                            >
                                                Home (7am-9pm)
                                            </button>
                                            <button 
                                                onClick={() => setAddressType('Office')}
                                                className={`py-3 px-6 text-xs font-bold rounded-sm border transition-colors ${addressType === 'Office' ? 'border-[#BF8F5F] text-[#BF8F5F]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}
                                            >
                                                Office (10am-9pm)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Contact Details */}
                                    <div className="mt-2">
                                        <h3 className="font-serif text-xl text-[#222222] mb-4">Contact Details</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs text-[#222222] font-medium">First Name</label>
                                                <input type="text" placeholder="First Name" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs text-[#222222] font-medium">Last Name</label>
                                                <input type="text" placeholder="Last Name" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs text-[#222222] font-medium">Phone No.</label>
                                                <div className="flex">
                                                    <span className="bg-[#FCF6F2] px-4 py-3 text-sm text-[#BF8F5F]/70 border-r border-white rounded-l-sm">+91</span>
                                                    <input type="tel" placeholder="987 653 XXXX" className="w-full bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-r-sm" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs text-[#222222] font-medium">Email <span className="text-gray-400">(Optional)</span></label>
                                                <input type="email" placeholder="Email" className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {savedAddress && (
                                        <div>
                                            <button 
                                                onClick={() => setIsEditingAddress(false)}
                                                className="text-xs font-bold text-[#BF8F5F] hover:underline"
                                            >
                                                ← Cancel and use saved address
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Billing Address Section */}
                        <div className="pt-4 border-t border-gray-100">
                            <h2 className="font-serif text-2xl text-[#222222] mb-1">Billing Address</h2>
                            <p className="text-[10px] sm:text-xs text-gray-400 mb-4">We will not send an invoice to the shipping address</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setBillingAddress('Same')}
                                    className={`py-3 w-full text-xs font-bold rounded-sm border transition-colors ${billingAddress === 'Same' ? 'border-[#BF8F5F] text-[#BF8F5F]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}
                                >
                                    Same as Shipping Address
                                </button>
                                <button 
                                    onClick={() => setBillingAddress('Different')}
                                    className={`py-3 w-full text-xs font-bold rounded-sm border transition-colors ${billingAddress === 'Different' ? 'border-[#BF8F5F] text-[#BF8F5F]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}
                                >
                                    Use a Different Billing Address
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Vertical Divider (Desktop Only) */}
                    <div className="hidden lg:block w-px bg-gray-200"></div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-[30%] flex flex-col pt-8 lg:pt-0 border-t lg:border-t-0 border-gray-200">
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
                                Save & Continue
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