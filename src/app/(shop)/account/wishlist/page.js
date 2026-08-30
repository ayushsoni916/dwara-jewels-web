'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Dummy data for wishlist items
const initialWishlist = [
    {
        id: 1,
        name: "Anes Narrow Diamond Ring",
        material: "in 18k rose gold",
        price: "$699.00",
        img: "/images/Ring1.webp", // Replace with your actual paths
        stockStatus: "In Stock"
    },
    {
        id: 2,
        name: "Elsa Peretti Diamonds",
        material: "by the Yard",
        price: "$1,299.00",
        img: "/images/Jhumkas.webp",
        stockStatus: "Low Stock"
    },
    {
        id: 3,
        name: "Tiffany HardWear dangle",
        material: "ring in 18k gold",
        price: "$1,599.00",
        img: "/images/Rings.webp",
        stockStatus: "In Stock"
    },
    {
        id: 4,
        name: "Tiffany Embrace band",
        material: "in platinum & diamonds",
        price: "$899.00",
        img: "/images/Earring1.webp",
        stockStatus: "Out of Stock"
    }
];

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState(initialWishlist);

    // Function to simulate removing an item
    const handleRemove = (id) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
    };

    return (
        <main className="bg-white min-h-screen pb-16 lg:pb-20 overflow-hidden">
            <section className="horizontal-padding mt-16 md:mt-24 lg:mt-[100px] max-w-[1440px] mx-auto">
                
                {/* Page Header */}
                <div className="flex flex-col mb-8 lg:mb-15">
                    <span className="text-[#BF8F5F] font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-2 sm:mb-3 text-center sm:text-left">
                        MY ACCOUNT
                    </span>
                    <h1 className="heading-main text-3xl sm:text-4xl lg:text-5xl text-center sm:text-left">
                        Your Wishlist
                    </h1>
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-3 sm:mt-4 gap-2 sm:gap-4 text-center sm:text-left">
                        <p className="heading-des text-gray-500 max-w-md text-xs sm:text-sm">
                            Review and manage the exquisite pieces you've saved for later.
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-[#222222]">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved
                        </p>
                    </div>
                    <div className="bg-[#BF8F5F] h-px w-full mt-4 lg:mt-[28px]" />
                </div>

                {/* Empty State */}
                {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 lg:py-20 text-center px-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 text-gray-300">
                            <svg fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <h2 className="title-main text-xl sm:text-2xl mb-2 sm:mb-4">Your wishlist is empty</h2>
                        <p className="title-des text-xs sm:text-base mb-6 sm:mb-8">Looks like you haven't saved any items yet.</p>
                        <Link 
                            href="/shop" 
                            className="bg-[#BF8F5F] text-white font-bold text-[10px] sm:text-xs uppercase tracking-widest py-3 sm:py-4 px-8 sm:px-10 hover:bg-black transition-colors rounded-sm"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    /* Wishlist Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                        {wishlistItems.map((product) => (
                            <div key={product.id} className="group flex flex-col mb-4 sm:mb-6">
                                
                                {/* Product Image Container */}
                                <div className="bg-[#FCF6F2] mb-3 sm:mb-4 overflow-hidden relative w-full aspect-square rounded-sm">
                                    
                                    {/* Remove Button */}
                                    <button 
                                        onClick={() => handleRemove(product.id)}
                                        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                                        aria-label="Remove from Wishlist"
                                    >
                                        <svg className="w-3 h-3 sm:w-[14px] sm:h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>

                                    {/* Product Image */}
                                    <Link href={`/product/${product.id}`} className="absolute inset-0 flex items-center justify-center cursor-pointer">
                                        <Image 
                                            src={product.img} 
                                            alt={product.name} 
                                            fill
                                            className="object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-110" 
                                        />
                                    </Link>

                                    {/* Add to Cart Overlay */}
                                    <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2 sm:px-4 pointer-events-none">
                                        <button 
                                            disabled={product.stockStatus === "Out of Stock"}
                                            className={`pointer-events-auto w-full py-2 sm:py-3 rounded-sm shadow-md font-bold text-[9px] sm:text-xs uppercase tracking-wider sm:tracking-widest transition-colors ${
                                                product.stockStatus === "Out of Stock" 
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                                                : "bg-white/90 backdrop-blur-sm text-[#222222] hover:bg-[#BF8F5F] hover:text-white"
                                            }`}
                                        >
                                            {product.stockStatus === "Out of Stock" ? "Out of Stock" : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Product Details (Exact matching fonts) */}
                                <div className="flex flex-col text-center lg:text-left px-1">
                                    <h3 className="text-[#222222] font-bold text-sm leading-tight mb-1 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 text-xs mb-2 truncate">
                                        {product.material}
                                    </p>
                                    <div className="flex items-center justify-center lg:justify-between mt-auto">
                                        <p className="text-[#BF8F5F] font-bold text-sm">
                                            {product.price}
                                        </p>
                                        {/* Stock indicator hidden on mobile for space, visible on desktop */}
                                        <span className={`hidden lg:block text-[10px] uppercase tracking-wider font-bold ${
                                            product.stockStatus === "In Stock" ? "text-green-600" :
                                            product.stockStatus === "Low Stock" ? "text-orange-500" : "text-red-500"
                                        }`}>
                                            {product.stockStatus}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}