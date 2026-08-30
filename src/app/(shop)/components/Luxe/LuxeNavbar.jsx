"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import LoginModal from '../LoginModal';
import LogoutModal from '../LogoutModal';

// Hardcoded Luxe categories mapped to their exact database IDs
const navCategories = [
    { 
        id: '69bbb1020685b07e948ae4a2',
        name: 'Necklaces', 
        subcategories: ['Chokers', 'Pendants', 'Chains', 'Mangalsutra'] 
    },
    { 
        id: '69bba51293da9551888cea6a',
        name: 'Rings', 
        subcategories: ['Engagement', 'Solitaire', 'Bands', 'Cocktail'] 
    },
    { 
        id: '69bbb14e0685b07e948ae4a6',
        name: 'Bracelet', 
        subcategories: ['Chain', 'Bangle', 'Cuff'] 
    }
];

export default function LuxeNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // --- Search Autocomplete States ---
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);

    const isLoggedIn = true;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                // Fetching from backend API restricted to luxe products only
                const res = await fetch(`https://dwarajewels.in/api/product?search=${encodeURIComponent(searchQuery)}&limit=4&luxe=true`);
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

    const handleLogout = () => {
        console.log("User logged out!");
        setIsLogoutModalOpen(false);
    };

    return (
        <header className={`fixed top-0 left-0 z-50 w-full text-white transition-all duration-300 ${scrolled ? 'bg-[#12141D]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
            
            {/* 1. TOP BAR */}
            <div className="flex items-center justify-between px-20 h-8.5 lg:h-12.25 text-[10px] lg:text-[13px] leading-6 uppercase tracking-[0.65px] border-b border-white/10 font-sans">
                <div className="hidden lg:flex gap-6 text-gray-300">
                    <span>Monday - Friday</span>
                    <span>9:00AM - 6:00PM</span>
                </div>
                <div className="font-bold tracking-widest text-[#E5D3C4]">
                    — 25% Discount For All Rings —
                </div>
                <div className="hidden lg:flex gap-6 text-gray-300">
                    <Link href="/faq" className="hover:text-[#E5D3C4] transition-colors">FAQ</Link>
                    <Link href="/career" className="hover:text-[#E5D3C4] transition-colors">Career</Link>
                    <Link href="/support" className="hover:text-[#E5D3C4] transition-colors">Support</Link>
                    <Link href="/about" className="hover:text-[#E5D3C4] transition-colors">About Us</Link>
                </div>
            </div>

            {/* 2. MAIN NAVBAR */}
            <nav className="flex items-center justify-between px-7.5 lg:px-20 py-5 h-22.25 lg:h-25">
                
                <Link href="/luxe" className="flex items-center gap-3">
                    <div className="h-8.75 lg:h-12.5 shrink-0">
                        <Image 
                            src="/images/LuxeLogo.webp" 
                            alt="Dwara Jewels Luxe" 
                            width={200} 
                            height={50} 
                            className="h-8.75 lg:h-12.5 w-auto object-contain" 
                            priority 
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-8 font-sans text-[13px] lg:text-[16px] leading-6 font-medium text-white">
                    {navCategories.map((cat) => (
                        <div key={cat.name} className="relative group py-4">
                            <Link href={`/luxe/category?category=${cat.id}`} className="hover:text-[#E5D3C4] flex items-center gap-1 transition-colors">
                                {cat.name} <span className="text-xs ml-1">▾</span>
                            </Link>

                            <div className="absolute top-full left-0 mt-1 bg-[#1A1C26]/95 backdrop-blur-sm shadow-xl min-w-[200px] flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-white/10">
                                {cat.subcategories.map((sub, idx) => (
                                    <Link key={idx} href={`/luxe/category?category=${cat.id}&subCategory=${encodeURIComponent(sub)}`} className="block px-6 py-3 text-[14px] font-normal text-gray-300 hover:bg-white/10 hover:text-[#E5D3C4] transition-colors">
                                        {sub}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search & Actions */}
                <div className="flex items-center gap-4 lg:gap-8">
                    
                    {/* Dynamic Search Bar */}
                    <div className="hidden md:flex items-center gap-3.5 relative">
                        <Image src="/icons/Search.svg" alt="Search" width={20} height={20} className="object-contain brightness-0 invert" />
                        <input 
                            type="text" 
                            placeholder="Search here" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                            className="bg-transparent text-sm outline-none pr-2 w-40 border-b border-gray-400 focus:border-[#E5D3C4] py-1 text-white placeholder:text-gray-300 transition-colors" 
                        />

                        {/* Luxe Search Dropdown */}
                        {showSearchDropdown && (
                            <div className="absolute top-full right-0 mt-4 w-[350px] bg-[#1A1C26] shadow-2xl z-50 flex flex-col border border-white/10 border-t-2 border-t-[#E5D3C4]">
                                {isSearching ? (
                                    <div className="p-4 text-center text-sm text-gray-400 font-sans">Searching...</div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        {searchResults.map((product) => (
                                            <Link
                                                key={product._id}
                                                href={`/product/${product._id}`}
                                                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/10 last:border-0"
                                            >
                                                <div className="w-12 h-12 relative shrink-0 bg-[#0C0E17] overflow-hidden border border-white/5">
                                                    <Image
                                                        src={product.thumbnail || '/images/Placeholder.webp'}
                                                        alt={product.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="font-sans font-medium text-[13px] text-white truncate">
                                                        {product.title}
                                                    </span>
                                                    <span className="font-serif text-[13px] text-[#E5D3C4]">
                                                        ${product.price?.finalPrice?.toLocaleString()}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                        <Link
                                            href={`/luxe/category?search=${encodeURIComponent(searchQuery)}`}
                                            className="p-3 text-center text-[12px] font-bold text-[#E5D3C4] hover:text-white uppercase tracking-widest bg-white/5 transition-colors font-sans"
                                        >
                                            View All Results
                                        </Link>
                                    </>
                                ) : (
                                    <div className="p-6 text-center text-sm text-gray-400 font-sans">
                                        No luxury products found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <button onClick={() => isLoggedIn ? setIsLogoutModalOpen(true) : setIsLoginModalOpen(true)} className="hover:opacity-70 transition-opacity">
                            <div className="relative h-3.5 w-3.5 lg:h-5 lg:w-5">
                                <Image src="/icons/User.svg" alt="User Profile" fill className="object-contain brightness-0 invert" />
                            </div>
                        </button>
                        <Link href="/cart" className="hover:opacity-70 transition-opacity relative">
                            <div className="relative h-3.5 w-3.5 lg:h-5 lg:w-5">
                                <Image src="/icons/Cart.svg" alt="Shopping Cart" fill className="object-contain brightness-0 invert" />
                            </div>
                        </Link>
                    </div>

                    <button className="lg:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <div className="relative h-7 w-7">
                            <Image src="/icons/Toggle.svg" alt="Menu Toggle" fill className="object-contain brightness-0 invert" />
                        </div>
                    </button>
                </div>
            </nav>

            <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onLogout={handleLogout} />
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSuccess={() => console.log('Logged in!')} />
        </header>
    );
}