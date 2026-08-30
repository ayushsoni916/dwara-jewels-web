"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

const MATERIALS = ['Gold', 'Silver', 'Platinum'];

// Define absolute min and max for your store
const MIN_PRICE = 0;
const MAX_PRICE = 10000;

export default function ProductFilterSidebar({ categories = [], products = [], currentCategory = '' }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // --- State for Price Slider ---
    // Initialize with URL params or default values
    const [priceRange, setPriceRange] = useState([
        Number(searchParams.get('minPrice')) || MIN_PRICE,
        Number(searchParams.get('maxPrice')) || MAX_PRICE
    ]);

    // Keep local state in sync if URL changes externally (e.g., hitting "Clear Filters")
    useEffect(() => {
        setPriceRange([
            Number(searchParams.get('minPrice')) || MIN_PRICE,
            Number(searchParams.get('maxPrice')) || MAX_PRICE
        ]);
    }, [searchParams.get('minPrice'), searchParams.get('maxPrice')]);

    // --- URL Update Handlers ---
    const handleFilterClick = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get(key) === value) params.delete(key);
        else params.set(key, value);
        
        if (key === 'category') params.delete('subCategory');
        router.push(`/category?${params.toString()}`, { scroll: false });
    };

    // Only update the URL when the user STOPS dragging the slider
    const handlePriceCommit = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (priceRange[0] > MIN_PRICE) params.set('minPrice', priceRange[0]);
        else params.delete('minPrice');

        if (priceRange[1] < MAX_PRICE) params.set('maxPrice', priceRange[1]);
        else params.delete('maxPrice');

        router.push(`/category?${params.toString()}`, { scroll: false });
    };

    const handleClearFilters = () => {
        const currentCat = searchParams.get('category');
        router.push(currentCat ? `/category?category=${currentCat}` : '/category');
    };

    const activeCategoryObj = categories.find(cat => cat._id === currentCategory);
    const validSubCategories = activeCategoryObj?.subCategories || [];

    const availableStones = useMemo(() => {
        const stones = products.flatMap(p => p.stones?.map(s => s.type) || []);
        return [...new Set(stones.filter(Boolean))];
    }, [products]);

    const availableSizes = useMemo(() => {
        const sizes = products.map(p => p.dimensions?.size);
        return [...new Set(sizes.filter(Boolean))];
    }, [products]);

    const activeSubCat = searchParams.get('subCategory');
    const activeMetal = searchParams.get('metal');
    const activeStone = searchParams.get('stone');
    const activeSize = searchParams.get('size');

    // Calculate percentages for the gold active track between the thumbs
    const percent1 = ((priceRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
    const percent2 = ((priceRange[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

    return (
        <aside className="w-full lg:max-w-[280px] lg:pr-8 space-y-10 font-sans">
            
            {/* Categories */}
            <div>
                <h3 className="text-[#222222] text-[20px] font-bold leading-tight mb-4">Categories</h3>
                <ul className="space-y-3">
                    {categories?.map((cat) => (
                        <li 
                            key={cat._id}
                            onClick={() => handleFilterClick('category', cat._id)}
                            className={`cursor-pointer transition-all flex items-center gap-3 
                                ${currentCategory === cat._id ? 'text-[#222222] font-semibold' : 'text-gray-500 hover:text-[#222222]'}`}
                        >
                            <div className={`w-1 h-5 transition-colors ${currentCategory === cat._id ? 'bg-[#BF8F5F]' : 'bg-transparent'}`} />
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </div>
            <hr className="border-gray-100" />

            {/* Price Slider */}
            <div>
                <h3 className="text-[#222222] text-[20px] font-bold leading-tight mb-6">Price</h3>
                
                <div className="relative w-full h-1 mt-6 mb-4">
                    {/* Background Track (Gray) */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#E5E7EB] rounded-full"></div>
                    
                    {/* Active Track (Gold) */}
                    <div 
                        className="absolute top-0 h-1 bg-[#C29B70] rounded-full"
                        style={{ left: `${percent1}%`, right: `${100 - percent2}%` }}
                    ></div>

                    {/* Min Price Thumb */}
                    <input 
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        value={priceRange[0]}
                        onChange={(e) => {
                            const value = Math.min(Number(e.target.value), priceRange[1] - 100);
                            setPriceRange([value, priceRange[1]]);
                        }}
                        onMouseUp={handlePriceCommit}
                        onTouchEnd={handlePriceCommit}
                        className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#C29B70] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#C29B70] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:pointer-events-auto"
                    />

                    {/* Max Price Thumb */}
                    <input 
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        value={priceRange[1]}
                        onChange={(e) => {
                            const value = Math.max(Number(e.target.value), priceRange[0] + 100);
                            setPriceRange([priceRange[0], value]);
                        }}
                        onMouseUp={handlePriceCommit}
                        onTouchEnd={handlePriceCommit}
                        className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#C29B70] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#C29B70] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:pointer-events-auto"
                    />
                </div>
                
                {/* Formatting with toLocaleString gives you the comma separators like $ 5,000 */}
                <p className="text-[14px] text-gray-600 mt-5">
                    Price: $ {priceRange[0].toLocaleString()} - $ {priceRange[1].toLocaleString()}
                </p>
            </div>
            <hr className="border-gray-100" />

            {/* Subcategories */}
            {validSubCategories.length > 0 && (
                <>
                    <div>
                        <h3 className="text-[#222222] text-[20px] font-bold leading-tight mb-4">Type</h3>
                        <ul className="space-y-3">
                            {validSubCategories.map((sub) => (
                                <li 
                                    key={sub}
                                    onClick={() => handleFilterClick('subCategory', sub)}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors
                                        ${activeSubCat === sub ? 'bg-[#BF8F5F] border-[#BF8F5F]' : 'border-gray-400 group-hover:border-[#BF8F5F]'}`}
                                    >
                                        {activeSubCat === sub && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`text-[15px] ${activeSubCat === sub ? 'text-[#222222] font-medium' : 'text-gray-600'}`}>{sub}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <hr className="border-gray-100" />
                </>
            )}

            {/* Material */}
            <div>
                <h3 className="text-[#222222] text-[20px] font-bold leading-tight mb-4">Material</h3>
                <ul className="space-y-3">
                    {MATERIALS.map((metal) => (
                        <li 
                            key={metal}
                            onClick={() => handleFilterClick('metal', metal)}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors
                                ${activeMetal === metal ? 'bg-[#BF8F5F] border-[#BF8F5F]' : 'border-gray-400 group-hover:border-[#BF8F5F]'}`}
                            >
                                {activeMetal === metal && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                            <span className={`text-[15px] ${activeMetal === metal ? 'text-[#222222] font-medium' : 'text-gray-600'}`}>{metal}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Stones */}
            {availableStones.length > 0 && (
                <>
                    <hr className="border-gray-100" />
                    <div>
                        <h3 className="text-[#222222] text-[20px] font-bold leading-tight mb-4">Stones</h3>
                        <ul className="space-y-3">
                            {availableStones.map((stone) => (
                                <li 
                                    key={stone}
                                    onClick={() => handleFilterClick('stone', stone)}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors
                                        ${activeStone === stone ? 'bg-[#BF8F5F] border-[#BF8F5F]' : 'border-gray-400 group-hover:border-[#BF8F5F]'}`}
                                    >
                                        {activeStone === stone && (
                                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`text-[15px] ${activeStone === stone ? 'text-[#222222] font-medium' : 'text-gray-600'}`}>{stone}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}

            {/* Size */}
            {availableSizes.length > 0 && (
                <>
                    <hr className="border-gray-100" />
                    <div>
                        <h3 className="text-[#222222] text-[20px] font-bold leading-tight mb-4">Size</h3>
                        <div className="flex flex-wrap gap-3">
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleFilterClick('size', size)}
                                    className={`min-w-[40px] px-3 h-10 flex items-center justify-center text-[14px] transition-all border
                                        ${activeSize === size ? 'bg-[#BF8F5F] border-[#BF8F5F] text-white font-bold' : 'bg-transparent border-gray-200 text-[#222222] hover:border-[#BF8F5F]'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
            <hr className="border-gray-100" />

            {/* Clear Filters */}
            <div className="pt-2">
                <button 
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 text-[13px] font-bold text-[#222222] uppercase tracking-wider hover:text-[#BF8F5F] transition-colors"
                >
                    <X size={16} strokeWidth={2.5} /> CLEAR ALL FILTERS
                </button>
            </div>
        </aside>
    );
}