"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-navbar">
            {/* 1. TOP BAR - Essential for Trust & Marketing */}
            <div className="flex items-center justify-between px-20 h-8.5 lg:h-12.25 text-[10px] lg:text-[13px] leading-6 uppercase tracking-[0.65px] border-b border-[#0000001A] text-[#222222] font-sans">
                <div className="hidden lg:flex gap-6 ">
                    <span>Monday - Friday</span>
                    <span>9:00AM - 6:00PM</span>
                </div>
                <div className="text-brand-dark font-medium">
                    — 25% Discount For All Rings —
                </div>
                <div className="hidden lg:flex gap-6">
                    <Link href="/faq" className="hover:text-brand-gold">FAQ</Link>
                    <Link href="/career" className="hover:text-brand-gold">Career</Link>
                    <Link href="/support" className="hover:text-brand-gold">Support</Link>
                    <Link href="/about" className="hover:text-brand-gold">About Us</Link>
                </div>
            </div>

            {/* 2. MAIN NAVBAR */}
            <nav className="flex items-center justify-between px-7.5 lg:px-20 py-5 bg-white h-22.25 lg:h-25">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-8.75 lg:h-12.5 shrink-0">
                        <Image
                            src="/images/LogoName.svg"
                            alt="Dwara Jewels"
                            width={200} // Set these to match your Figma ratio
                            height={50}
                            className="h-8.75 lg:h-12.5 w-auto object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Navigation Links - SEO Rich */}
                <div className="hidden lg:flex gap-8 font-sans text-[13px] lg:text-[16px] leading-6 font-medium text-[#222222]">
                    <Link href="/category/earrings" className="hover:text-brand-gold flex items-center gap-1">Earrings ▾</Link>
                    <Link href="/category/necklace" className="hover:text-brand-gold flex items-center gap-1">Necklace ▾</Link>
                    <Link href="/category/rings" className="hover:text-brand-gold flex items-center gap-1">Rings ▾</Link>
                    <Link href="/category/jhumkas" className="hover:text-brand-gold flex items-center gap-1">Jhumkas ▾</Link>
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-4 lg:gap-8">
                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex items-center gap-3.5">
                        <Image
                            src="/icons/Search.svg"
                            alt="Search"
                            width={20}
                            height={20}
                            className="object-contain"
                        />
                        <input
                            type="text"
                            placeholder="Search here"
                            className="bg-transparent text-sm outline-none pr-2 w-40 border-b border-[#BF8F5F] py-1"
                        />

                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <Link href="/profile" className="text-gray-700 hover:text-brand-gold">
                            {/* <img src="/icons/User.svg" alt="Dwara Jewels Icon" className="w-full h-3.75 lg:h-full object-contain" /> */}
                            <div className="relative h-3.5 w-3.5 lg:h-5 lg:w-5">
                                <Image
                                    src="/icons/User.svg"
                                    alt="User Profile"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <Link href="/cart" className="text-gray-700 hover:text-brand-gold relative">
                            {/* <img src="/icons/Cart.svg" alt="Dwara Jewels Icon" className="w-full h-3.75 lg:h-full object-contain" /> */}
                            <div className="relative h-3.5 w-3.5 lg:h-5 lg:w-5">
                                <Image
                                    src="/icons/Cart.svg"
                                    alt="Shopping Cart"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span> */}
                        </Link>
                    </div>
                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden text-brand-gold"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="relative h-7 w-7">
                            <Image 
                                src="/icons/Toggle.svg" 
                                alt="Menu Toggle" 
                                fill 
                                className="object-contain" 
                            />
                        </div>

                    </button>
                </div>


            </nav>

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl p-6 border-t border-gray-100 flex flex-col gap-4 animate-in slide-in-from-top">
                    <Link href="/category/earrings" className="font-medium">Earrings</Link>
                    <Link href="/category/necklace" className="font-medium">Necklace</Link>
                    <Link href="/category/rings" className="font-medium">Rings</Link>
                    <Link href="/category/jhumkas" className="font-medium">Jhumkas</Link>
                </div>
            )}
        </header>
    );
}