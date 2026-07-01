"use client";
import React from 'react';
import { X } from 'lucide-react';

const ProductFilterSidebar = ({ 
    categories, 
    activeFilters, 
    setActiveFilters, 
    onClearFilters 
}) => {

    const handleCheckboxChange = (group, value) => {
        const currentGroup = activeFilters[group] || [];
        const newGroup = currentGroup.includes(value)
            ? currentGroup.filter(item => item !== value)
            : [...currentGroup, value];
        
        setActiveFilters({ ...activeFilters, [group]: newGroup });
    };

    return (
        <aside className="w-full max-w-[280px] pr-8 space-y-10">
            {/* Categories Section */}
            <div>
                <h3 className="subtitle-head mb-6">Categories</h3>
                <ul className="space-y-4">
                    {categories.map((cat) => (
                        <li 
                            key={cat._id}
                            onClick={() => setActiveFilters({ ...activeFilters, category: cat._id })}
                            className={`cursor-pointer subtitle-des transition-all flex items-center gap-2 
                                ${activeFilters.category === cat._id ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                        >
                            {activeFilters.category === cat._id && <div className="w-1 h-4 bg-[#B58E58]" />}
                            {cat.name}
                        </li>
                    ))}
                </ul>
            </div>

            <hr className="border-gray-100" />

            {/* Price Slider Section */}
            <div>
                <h3 className="subtitle-head mb-6">Price</h3>
                <input 
                    type="range" 
                    min="0" 
                    max="10000" 
                    step="100"
                    value={activeFilters.maxPrice || 5000}
                    onChange={(e) => setActiveFilters({ ...activeFilters, maxPrice: e.target.value })}
                    className="w-full accent-[#B58E58] h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-4 text-sm font-normal text-gray-500">
                    <span>Price: $0 - ${activeFilters.maxPrice || 5000}</span>
                </div>
            </div>

            {/* Material / Metal Section */}
            <div>
                <h3 className="subtitle-head mb-6">Material</h3>
                <div className="space-y-3">
                    {['Gold', 'Silver', 'Platinum'].map((metal) => (
                        <label key={metal} className="flex items-center gap-3 cursor-pointer group">
                            <div 
                                onClick={() => handleCheckboxChange('metal', metal)}
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                                ${activeFilters.metal?.includes(metal) ? 'bg-[#B58E58] border-[#B58E58]' : 'border-gray-300 group-hover:border-[#B58E58]'}`}
                            >
                                {activeFilters.metal?.includes(metal) && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className="text-sm text-[#222222]">{metal}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Size Grid Section */}
            <div>
                <h3 className="subtitle-head mb-6">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                        <button
                            key={size}
                            onClick={() => handleCheckboxChange('size', size)}
                            className={`py-2 text-xs font-bold border rounded transition-all
                            ${activeFilters.size?.includes(size) 
                                ? 'bg-[#B58E58] border-[#B58E58] text-white' 
                                : 'bg-transparent border-gray-200 text-gray-400 hover:border-[#B58E58]'}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            <button 
                onClick={onClearFilters}
                className="flex items-center gap-2 text-xs font-bold text-[#222222] uppercase tracking-widest hover:text-red-500 transition-colors"
            >
                <X size={14} /> Clear All Filter
            </button>
        </aside>
    );
};

export default ProductFilterSidebar;