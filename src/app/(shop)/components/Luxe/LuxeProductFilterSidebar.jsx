"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

const MATERIALS = ['Gold', 'Silver', 'Platinum'];
const MIN_PRICE = 0;
const MAX_PRICE = 150000; // Increased max price for Luxe items

export default function LuxeProductFilterSidebar({ categories = [], products = [], currentCategory = '' }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState([
        Number(searchParams.get('minPrice')) || MIN_PRICE,
        Number(searchParams.get('maxPrice')) || MAX_PRICE
    ]);

    useEffect(() => {
        setPriceRange([
            Number(searchParams.get('minPrice')) || MIN_PRICE,
            Number(searchParams.get('maxPrice')) || MAX_PRICE
        ]);
    }, [searchParams.get('minPrice'), searchParams.get('maxPrice')]);

    const handleFilterClick = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (params.get(key) === value) params.delete(key);
        else params.set(key, value);
        
        if (key === 'category') params.delete('subCategory');
        router.push(`/luxe/category?${params.toString()}`, { scroll: false });
    };

    const handlePriceCommit = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (priceRange[0] > MIN_PRICE) params.set('minPrice', priceRange[0]);
        else params.delete('minPrice');

        if (priceRange[1] < MAX_PRICE) params.set('maxPrice', priceRange[1]);
        else params.delete('maxPrice');

        router.push(`/luxe/category?${params.toString()}`, { scroll: false });
    };

    const handleClearFilters = () => {
        const currentCat = searchParams.get('category');
        router.push(currentCat ? `/luxe/category?category=${currentCat}` : '/luxe/category');
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

    const percent1 = ((priceRange[0] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
    const percent2 = ((priceRange[1] - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

    return (
        <aside className="w-full lg:pr-6 space-y-10 font-sans text-white border-r border-white/5 lg:min-h-[600px]">
            
            {/* Categories */}
            <div>
                <h3 className="text-white text-[18px] font-serif mb-4 tracking-wide">Collections</h3>
                <ul className="space-y-3">
                    {categories?.map((cat) => (
                        <li 
                            key={cat._id}
                            onClick={() => handleFilterClick('category', cat._id)}
                            className={`cursor-pointer transition-all flex items-center gap-3 
                                ${currentCategory === cat._id ? 'text-[#D6B693] font-semibold tracking-wide' : 'text-white/60 hover:text-white'}`}
                        >
                            <div className={`w-1 h-5 transition-colors ${currentCategory === cat._id ? 'bg-[#D6B693]' : 'bg-transparent'}`} />
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </div>
            <hr className="border-white/10 w-[85%]" />

            {/* Price Slider */}
            <div className="w-[85%]">
                <h3 className="text-white text-[18px] font-serif mb-6 tracking-wide">Investment</h3>
                
                <div className="relative w-full h-[2px] mt-6 mb-4">
                    {/* Background Track */}
                    <div className="absolute top-0 left-0 w-full h-full bg-white/20"></div>
                    
                    {/* Active Track */}
                    <div 
                        className="absolute top-0 h-full bg-[#D6B693]"
                        style={{ left: `${percent1}%`, right: `${100 - percent2}%` }}
                    ></div>

                    <input 
                        type="range" min={MIN_PRICE} max={MAX_PRICE} value={priceRange[0]}
                        onChange={(e) => {
                            const value = Math.min(Number(e.target.value), priceRange[1] - 500);
                            setPriceRange([value, priceRange[1]]);
                        }}
                        onMouseUp={handlePriceCommit} onTouchEnd={handlePriceCommit}
                        className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#D6B693] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                    />

                    <input 
                        type="range" min={MIN_PRICE} max={MAX_PRICE} value={priceRange[1]}
                        onChange={(e) => {
                            const value = Math.max(Number(e.target.value), priceRange[0] + 500);
                            setPriceRange([priceRange[0], value]);
                        }}
                        onMouseUp={handlePriceCommit} onTouchEnd={handlePriceCommit}
                        className="absolute top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#D6B693] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                </div>
                
                <p className="text-[12px] text-white/50 tracking-wider mt-5">
                    $ {priceRange[0].toLocaleString()} - $ {priceRange[1].toLocaleString()}
                </p>
            </div>
            <hr className="border-white/10 w-[85%]" />

            {/* Checkbox Sections Logic (Type, Material, Stones) */}
            {[
                { title: 'Type', data: validSubCategories, activeKey: 'subCategory', activeState: activeSubCat },
                { title: 'Material', data: MATERIALS, activeKey: 'metal', activeState: activeMetal },
                { title: 'Stones', data: availableStones, activeKey: 'stone', activeState: activeStone },
            ].map((section) => section.data.length > 0 && (
                <React.Fragment key={section.title}>
                    <div>
                        <h3 className="text-white text-[18px] font-serif mb-4 tracking-wide">{section.title}</h3>
                        <ul className="space-y-3">
                            {section.data.map((item) => (
                                <li 
                                    key={item}
                                    onClick={() => handleFilterClick(section.activeKey, item)}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <div className={`w-3.5 h-3.5 border flex items-center justify-center transition-colors
                                        ${section.activeState === item ? 'bg-[#D6B693] border-[#D6B693]' : 'border-white/30 bg-[#0C0E17] group-hover:border-[#D6B693]'}`}
                                    >
                                        {section.activeState === item && (
                                            <svg width="8" height="6" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#0C0E17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        )}
                                    </div>
                                    <span className={`text-[13px] ${section.activeState === item ? 'text-[#D6B693] tracking-wide' : 'text-white/60 group-hover:text-white'}`}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <hr className="border-white/10 w-[85%]" />
                </React.Fragment>
            ))}

            {/* Size Buttons */}
            {availableSizes.length > 0 && (
                <>
                    <div>
                        <h3 className="text-white text-[18px] font-serif mb-4 tracking-wide">Size</h3>
                        <div className="flex flex-wrap gap-2 w-[85%]">
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => handleFilterClick('size', size)}
                                    className={`min-w-[40px] px-3 h-8 flex items-center justify-center text-[12px] transition-all border
                                        ${activeSize === size ? 'bg-[#D6B693] border-[#D6B693] text-[#0C0E17] font-bold' : 'bg-transparent border-white/20 text-white hover:border-[#D6B693]'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    <hr className="border-white/10 w-[85%]" />
                </>
            )}

            {/* Clear Filters */}
            <div className="pt-2 pb-6">
                <button 
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 text-[11px] font-bold text-white/50 uppercase tracking-widest hover:text-[#D6B693] transition-colors"
                >
                    <X size={14} strokeWidth={2} /> CLEAR FILTERS
                </button>
            </div>
        </aside>
    );
}