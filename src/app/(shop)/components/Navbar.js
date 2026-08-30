"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LogoutModal from './LogoutModal';
import LoginModal from './LoginModal';

// Subcategories data
// Hardcoded core categories with their actual database IDs
const navCategories = [
    {
        id: '6966693ce0b407002bea0b10',
        name: 'Earrings',
        subcategories: ['Studs', 'Jhumkas', 'Hoops', 'Drops', 'Chandbali']
    },
    {
        id: '69666926e0b407002bea0b0d',
        name: 'Necklaces',
        subcategories: ['Chokers', 'Pendants', 'Chains', 'Mangalsutra']
    },
    {
        id: '69666943e0b407002bea0b13',
        name: 'Rings',
        subcategories: ['Engagement', 'Solitaire', 'Bands', 'Cocktail']
    },
    {
        id: '69bbb14e0685b07e948ae4a6', 
        name: 'Bracelets',
        subcategories: ['Chain', 'Bangle', 'Cuff']
    }
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openMobileCat, setOpenMobileCat] = useState(null);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // --- Search Autocomplete States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    // Toggle this to test logged in vs logged out dropdown
    const isLoggedIn = true;

    // Function to handle the actual logout logic
    const handleLogout = () => {
        console.log("User logged out!");
        setIsLogoutModalOpen(false);
        // Add your redirect or auth clearing logic here
    };

    // --- Debounced Search Effect ---
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                setShowSearchDropdown(false);
                return;
            }

            setIsSearching(true);
            setShowSearchDropdown(true);

            try {
                // Fetching from your local backend API
                const res = await fetch(`http://localhost:4500/api/product?search=${encodeURIComponent(searchQuery)}&limit=4`);
                const data = await res.json();

                if (data.success) {
                    setSearchResults(data.products);
                }
            } catch (error) {
                console.error("Search fetch error:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchSearchResults();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    return (
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm">

            {/* 1. TOP BAR */}
            <div className="flex items-center justify-between px-20 h-8.5 lg:h-12.25 text-[10px] lg:text-[13px] leading-6 uppercase tracking-[0.65px] border-b border-[#0000001A] text-[#222222] font-sans">
                <div className="hidden lg:flex gap-6 ">
                    <span>Monday - Friday</span>
                    <span>9:00AM - 6:00PM</span>
                </div>
                <div className="font-bold">
                    — 25% Discount For All Rings —
                </div>
                <div className="hidden lg:flex gap-6">
                    <Link href="/faq" className="hover:text-[#BF8F5F] transition-colors">FAQ</Link>
                    <Link href="/career" className="hover:text-[#BF8F5F] transition-colors">Career</Link>
                    <Link href="/support" className="hover:text-[#BF8F5F] transition-colors">Support</Link>
                    <Link href="/about" className="hover:text-[#BF8F5F] transition-colors">About Us</Link>
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
                            width={200}
                            height={50}
                            className="h-8.75 lg:h-12.5 w-auto object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex gap-8 font-sans text-[13px] lg:text-[16px] leading-6 font-medium text-[#222222]">
                    {navCategories.map((cat) => (
                        <div key={cat.name} className="relative group py-4">
                            {/* Updated Main Category Link */}
                            <Link href={`/category?category=${cat.id}`} className="hover:text-[#BF8F5F] flex items-center gap-1 transition-colors">
                                {cat.name} ▾
                            </Link>

                            {/* Desktop Subcategory Dropdown */}
                            <div className="absolute top-full left-0 mt-1 bg-white shadow-[0px_4px_22.3px_0px_#BF8F5F63] min-w-[200px] flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                {cat.subcategories.map((sub, idx) => (
                                    /* Updated Subcategory Link */
                                    <Link
                                        key={idx}
                                        href={`/category?category=${cat.id}&subCategory=${encodeURIComponent(sub)}`}
                                        className="block px-6 py-3 text-[14px] font-normal hover:bg-[#F9F1E7] hover:text-[#BF8F5F] transition-colors"
                                    >
                                        {sub}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-4 lg:gap-8">

                    {/* Desktop Search Bar with Autocomplete Dropdown */}
                    <div className="hidden md:flex items-center gap-3.5 relative">
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)} 
                            className="bg-transparent text-sm outline-none pr-2 w-40 border-b border-[#BF8F5F] py-1"
                        />

                        {/* Search Results Dropdown */}
                        {showSearchDropdown && (
                            <div className="absolute top-full right-0 mt-4 w-[350px] bg-white shadow-[0px_4px_22.3px_0px_#BF8F5F63] z-50 flex flex-col border-t-2 border-[#BF8F5F]">
                                {isSearching ? (
                                    <div className="p-4 text-center text-sm text-[#999999] font-sans">Searching...</div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product._id}
                                                href={`/product/${product._id}`}
                                                className="flex items-center gap-4 p-4 hover:bg-[#F9F1E7] transition-colors border-b border-gray-100 last:border-0"
                                            >
                                                <div className="w-12 h-12 relative shrink-0 bg-gray-50 overflow-hidden">
                                                    <Image
                                                        src={product.thumbnail || '/images/Placeholder.webp'}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="font-sans font-semibold text-[13px] text-[#222222] truncate">
                                                        {product.title}
                                                    </span>
                                                    <span className="font-serif text-[13px] text-[#BF8F5F]">
                                                        ${product.price?.finalPrice}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                        {/* Updated View All Results Link */}
                                        <Link
                                            href={`/category?search=${encodeURIComponent(searchQuery)}`}
                                            className="p-3 text-center text-[12px] font-bold text-[#BF8F5F] hover:text-black uppercase tracking-widest bg-gray-50 transition-colors font-sans"
                                        >
                                            View All Results
                                        </Link>
                                    </>
                                ) : (
                                    <div className="p-6 text-center text-sm text-[#999999] font-sans">
                                        No products found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        {/* Profile Wrapper with Dropdown */}
                        <div className="relative group flex items-center py-4">
                            <Link href={isLoggedIn ? "/account/info" : "/login"} className="text-gray-700 hover:text-[#BF8F5F] transition-colors">
                                <div className="relative h-3.5 w-3.5 lg:h-5 lg:w-5">
                                    <Image src="/icons/User.svg" alt="User Profile" fill className="object-contain" />
                                </div>
                            </Link>

                            <div className="absolute top-full right-0 mt-2 bg-white shadow-[0px_4px_22.3px_0px_#BF8F5F63] w-[320px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                {isLoggedIn ? (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-4 p-6 border-b border-gray-50">
                                            <div className="w-[60px] h-[60px] bg-[#F9F1E7] p-1.5 shrink-0">
                                                <Image src="/images/UserAvatar.webp" alt="User" width={48} height={48} className="object-cover w-full h-full" />
                                            </div>
                                            <div>
                                                <h3 className="font-serif text-[18px] text-[#222222] leading-tight">Mr. Rakesh Kumar</h3>
                                                <p className="text-[#BF8F5F] text-[14px] mt-1">#345674532</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col p-2 text-[14px] font-medium text-[#222222]">
                                            <Link href="/account/info" className="px-4 py-2.5 hover:bg-[#F9F1E7] hover:text-[#BF8F5F] transition-colors flex items-center gap-3">
                                                <span className="w-4 h-4 flex items-center justify-center border border-current rounded-full" /> Account Information
                                            </Link>
                                            <Link href="/account/orders" className="px-4 py-2.5 hover:bg-[#F9F1E7] hover:text-[#BF8F5F] transition-colors flex items-center justify-between">
                                                <div className="flex items-center gap-3"><span className="w-4 h-4 flex items-center justify-center border border-current" /> Orders</div>
                                                <span>›</span>
                                            </Link>
                                            <Link href="/about" className="px-4 py-2.5 hover:bg-[#F9F1E7] hover:text-[#BF8F5F] transition-colors flex items-center gap-3">
                                                <span className="w-4 h-4 flex items-center justify-center border border-current rounded-full" /> About Us
                                            </Link>
                                            <Link href="/support" className="px-4 py-2.5 hover:bg-[#F9F1E7] hover:text-[#BF8F5F] transition-colors flex items-center gap-3">
                                                <span className="w-4 h-4 flex items-center justify-center border border-current rounded-full" /> Customer Support
                                            </Link>
                                            <Link href="/career" className="px-4 py-2.5 hover:bg-[#F9F1E7] hover:text-[#BF8F5F] transition-colors flex items-center gap-3">
                                                <span className="w-4 h-4 flex items-center justify-center border border-current" /> Career
                                            </Link>
                                            <Link href="/blog" className="px-4 py-2.5 hover:bg-[#F9F1E7] hover:text-[#BF8F5F] transition-colors flex items-center gap-3">
                                                <span className="w-4 h-4 flex items-center justify-center border border-current" /> Blog
                                            </Link>
                                            <button
                                                onClick={() => setIsLogoutModalOpen(true)}
                                                className="px-4 py-2.5 hover:text-red-500 transition-colors flex items-center gap-3 text-left mt-1 border-t border-gray-50 w-full"
                                            >
                                                <span className="w-4 h-4 flex items-center justify-center border border-current" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col p-8 lg:p-10">
                                        <h3 className="font-serif text-[28px] text-[#222222] mb-2 leading-tight">
                                            Login/Sign Up
                                        </h3>
                                        <p className="text-[#999999] text-[15px] mb-8">
                                            Lorem ipsum is a simple dummy text
                                        </p>
                                        <button
                                            onClick={() => setIsLoginModalOpen(true)}
                                            className="w-full bg-[#BF8F5F] text-white text-center py-4 font-bold text-[12px] uppercase tracking-[0.2em] hover:bg-black transition-colors rounded-none border-0"
                                        >
                                            Login/Sign Up
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Link href="/cart" className="text-gray-700 hover:text-[#BF8F5F] transition-colors relative">
                            <div className="relative h-3.5 w-3.5 lg:h-5 lg:w-5">
                                <Image src="/icons/Cart.svg" alt="Shopping Cart" fill className="object-contain" />
                            </div>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden text-[#BF8F5F]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <div className="relative h-7 w-7">
                            <Image src="/icons/Toggle.svg" alt="Menu Toggle" fill className="object-contain" />
                        </div>
                    </button>
                </div>

            </nav>

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-[0px_4px_22.3px_0px_#BF8F5F63] p-6 border-t border-gray-50 flex flex-col gap-4 animate-in slide-in-from-top max-h-[80vh] overflow-y-auto">
                    {navCategories.map((cat) => (
                        <div key={cat.name} className="flex flex-col">
                            <button
                                onClick={() => setOpenMobileCat(openMobileCat === cat.name ? null : cat.name)}
                                className="flex justify-between items-center py-2 font-medium text-[#222222]"
                            >
                                {cat.name}
                                <span className={`text-[12px] transition-transform ${openMobileCat === cat.name ? 'rotate-180 text-[#BF8F5F]' : ''}`}>▼</span>
                            </button>

                            {/* Subcategories Accordion */}
                            {openMobileCat === cat.name && (
                                <div className="flex flex-col pl-4 mt-2 gap-3 border-l-2 border-[#BF8F5F]/30">
                                    {cat.subcategories.map((sub, idx) => (
                                        /* Updated Mobile Subcategory Link */
                                        <Link
                                            key={idx}
                                            href={`/category?category=${cat.id}&subCategory=${encodeURIComponent(sub)}`}
                                            className="text-[14px] text-gray-600 hover:text-[#BF8F5F]"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {sub}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Mobile Quick Links separated at bottom */}
                    <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-3">
                        <Link href={isLoggedIn ? "/account/info" : "/login"} className="text-[14px] font-medium text-gray-600 hover:text-[#BF8F5F]">My Account</Link>
                        <Link href="/faq" className="text-[14px] font-medium text-gray-600 hover:text-[#BF8F5F]">FAQ</Link>
                        <Link href="/support" className="text-[14px] font-medium text-gray-600 hover:text-[#BF8F5F]">Customer Support</Link>
                    </div>
                </div>
            )}
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onLogout={handleLogout}
            />
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSuccess={() => console.log('Successfully logged in!')}
            />
        </header>
    );
}