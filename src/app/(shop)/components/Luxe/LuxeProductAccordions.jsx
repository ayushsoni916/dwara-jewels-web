'use client';
import { useState } from "react";

export default function LuxeProductAccordions({ product }) {
    const [openAccordions, setOpenAccordions] = useState({
        description: false,
        details: true,
        reviews: false,
        stone: false,
        price: false
    });

    if (!product) return null;

    const toggleAccordion = (section) => {
        setOpenAccordions(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const currency = product.price?.currency === 'USD' ? '$' : 'Rs. ';
    
    const totalCarats = product.stones?.reduce((sum, stone) => sum + (stone.weight || 0), 0);
    
    const materialStr = product.metal?.type 
        ? `${product.metal.color ? product.metal.color + ' ' : ''}${product.metal.type}`.trim() 
        : null;

    const ChevronIcon = ({ isOpen }) => (
        <svg 
            className={`w-5 h-5 text-[#D6B693] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
        </svg>
    );

    return (
        <div className="flex flex-col">
            
            {/* 1. Description */}
            {product.description && (
                <div className="border-b border-white/10">
                    <button onClick={() => toggleAccordion('description')} className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-white hover:text-[#E5D3C4] transition-colors">
                        Description
                        <ChevronIcon isOpen={openAccordions.description} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordions.description ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <p className="text-white/70 text-sm leading-relaxed font-sans">{product.description}</p>
                    </div>
                </div>
            )}

            {/* 2. Details */}
            <div className="border-b border-white/10">
                <button onClick={() => toggleAccordion('details')} className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-white hover:text-[#E5D3C4] transition-colors">
                    Details
                    <ChevronIcon isOpen={openAccordions.details} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordions.details ? 'max-h-96 opacity-100 pb-6 pt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[13px] font-sans">
                        
                        <div className="space-y-4">
                            {product.dimensions?.width && (
                                <p><span className="text-[#D6B693] font-bold tracking-widest mr-2 uppercase">Width:</span> <span className="text-white">{product.dimensions.width}</span></p>
                            )}
                            {product.dimensions?.length && (
                                <p><span className="text-[#D6B693] font-bold tracking-widest mr-2 uppercase">Length:</span> <span className="text-white">{product.dimensions.length}</span></p>
                            )}
                            {product.sku && (
                                <p><span className="text-[#D6B693] font-bold tracking-widest mr-2 uppercase">Number:</span> <span className="text-white">{product.sku}</span></p>
                            )}
                        </div>

                        <div className="space-y-4">
                            {totalCarats > 0 && (
                                <p><span className="text-[#D6B693] font-bold tracking-widest mr-2 uppercase">Carats:</span> <span className="text-white">{totalCarats} Carats</span></p>
                            )}
                            {product.category?.name && (
                                <p><span className="text-[#D6B693] font-bold tracking-widest mr-2 uppercase">Category:</span> <span className="text-white">{product.category.name}</span></p>
                            )}
                            {materialStr && (
                                <p><span className="text-[#D6B693] font-bold tracking-widest mr-2 uppercase">Materials:</span> <span className="text-white">{materialStr}</span></p>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* 3. Reviews */}
            <div className="border-b border-white/10">
                <button onClick={() => toggleAccordion('reviews')} className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-white hover:text-[#E5D3C4] transition-colors">
                    Reviews
                    <ChevronIcon isOpen={openAccordions.reviews} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordions.reviews ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <p className="text-white/70 text-sm font-sans">No reviews yet.</p>
                </div>
            </div>

            {/* 4. Stone Elegance Details */}
            {product.stones && product.stones.length > 0 && (
                <div className="border-b border-white/10">
                    <button onClick={() => toggleAccordion('stone')} className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-white hover:text-[#E5D3C4] transition-colors">
                        Stone Elegance Details
                        <ChevronIcon isOpen={openAccordions.stone} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordions.stone ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <ul className="text-[13px] text-white font-sans space-y-4">
                            {product.stones.map((stone, idx) => (
                                <li key={idx} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0">
                                    <span className="font-bold capitalize text-[#D6B693]">
                                        {stone.type || 'Stone'} {stone.count ? `(x${stone.count})` : ''}
                                    </span> 
                                    <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                                        {stone.shape && <span><strong className="text-white/50 font-normal">Shape:</strong> {stone.shape}</span>}
                                        {stone.color && <span><strong className="text-white/50 font-normal">Color:</strong> {stone.color}</span>}
                                        {stone.clarity && <span><strong className="text-white/50 font-normal">Clarity:</strong> {stone.clarity}</span>}
                                        {stone.weight && <span><strong className="text-white/50 font-normal">Weight:</strong> {stone.weight}ct</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* 5. Price Distribution */}
            <div className="border-b border-white/10">
                <button onClick={() => toggleAccordion('price')} className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-white hover:text-[#E5D3C4] transition-colors">
                    Price Distribution
                    <ChevronIcon isOpen={openAccordions.price} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordions.price ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[13px] font-sans">
                        {product.price?.basePrice !== undefined && (
                            <p><span className="text-[#D6B693] font-bold tracking-widest mr-2 uppercase">Base Price:</span> <span className="text-white">{currency}{product.price.basePrice}</span></p>
                        )}
                        {product.price?.makingCharges !== undefined && (
                            <p><span className="text-[#D6B693] font-bold tracking-widest mr-2 uppercase">Making:</span> <span className="text-white">{currency}{product.price.makingCharges}</span></p>
                        )}
                        {product.price?.tax !== undefined && (
                            <p><span className="text-[#D6B693] font-bold tracking-widest mr-2 uppercase">Tax:</span> <span className="text-white">{currency}{product.price.tax}</span></p>
                        )}
                        {product.price?.finalPrice !== undefined && (
                            <p><span className="text-[#D6B693] font-bold tracking-widest mr-2 uppercase">Final Price:</span> <span className="text-white font-bold">{currency}{product.price.finalPrice}</span></p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}