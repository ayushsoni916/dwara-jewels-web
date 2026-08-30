'use client';
import React, { useState } from 'react';

export default function ProductHeader({ product }) {
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    const finalPrice = product.price?.finalPrice?.toLocaleString() || "0.00";
    const currency = product.price?.currency === 'USD' ? '$' : '₹';
    
    // Removed the hardcoded fallback
    const collectionName = product.collection?.name || product.category?.name; 
    const isInStock = product.stock > 0;

    const increaseQty = () => {
        if (quantity < product.stock) setQuantity(prev => prev + 1);
    };
    
    const decreaseQty = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    return (
        <div className="flex flex-col pb-8 border-b border-gray-100 mb-8 font-sans">
            {/* Header & Price */}
            <h1 className="text-[#222222] font-serif text-4xl lg:text-5xl leading-tight mb-4">
                {product.title}
            </h1>
            <p className="text-[#222222] font-serif text-[28px] mb-8">
                {currency}{finalPrice}
            </p>
            
            {/* Meta: Collection, Reviews */}
            <div className="flex flex-wrap items-center gap-3 mb-8 text-[11px] sm:text-xs">
                {/* Only render this block if collectionName exists */}
                {collectionName && (
                    <>
                        <span className="text-[#BF8F5F] font-bold uppercase tracking-widest">
                            {collectionName}
                        </span>
                        <span className="text-[#BF8F5F]">|</span>
                    </>
                )}
                
                <div className="flex items-center text-[#FFC107]">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                </div>
                <span className="text-gray-400 ml-1">( {product.rating?.count || 0} Reviews )</span>
            </div>

            {/* Quick Action Icons (Wishlist & Share) */}
            <div className="flex items-center gap-6 mb-8">
                <button className="text-[#222222] hover:text-[#BF8F5F] transition-colors" aria-label="Add to Wishlist">
                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                </button>
                <button className="text-[#222222] hover:text-[#BF8F5F] transition-colors" aria-label="Share">
                    <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
                </button>
            </div>

            {/* Cart & Buy Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <div className="flex items-center border border-[#222222] h-[50px] w-full sm:w-[120px] shrink-0">
                    <button onClick={decreaseQty} className="w-1/3 h-full flex items-center justify-center text-[#222222] hover:bg-gray-50 transition-colors" disabled={!isInStock}>-</button>
                    <span className="w-1/3 text-center text-[15px] font-bold text-[#222222]">{quantity}</span>
                    <button onClick={increaseQty} className="w-1/3 h-full flex items-center justify-center text-[#222222] hover:bg-gray-50 transition-colors" disabled={!isInStock}>+</button>
                </div>

                <button disabled={!isInStock} className="w-full h-[50px] border border-[#222222] text-[#222222] font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#222222] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Add To Cart
                </button>
                <button disabled={!isInStock} className="w-full h-[50px] bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#a67b50] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Buy Now
                </button>
            </div>

            {/* Stock Status */}
            <div className="mt-5 text-xs font-bold tracking-wider">
                {isInStock ? (
                    <span className="text-green-600">IN STOCK ({product.stock})</span>
                ) : (
                    <span className="text-red-500">OUT OF STOCK</span>
                )}
            </div>

        </div>
    );
}