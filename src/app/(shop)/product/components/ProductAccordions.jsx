'use client';
import { useState } from "react";
import Link from 'next/link';

export default function ProductAccordions({
    product,
    selectedDimension,
}) {
    const [openAccordions, setOpenAccordions] = useState({
        description: false,
        details: true,
        reviews: false,
        stone: false,
        price: false,
        returnPolicy: false,
    });

    if (!product) return null;

    const toggleAccordion = (section) => {
        setOpenAccordions(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const currency = product.price?.currency === 'USD' ? '$' : 'Rs. ';

    // Calculate total carats dynamically 
    const totalCarats = product.stones?.reduce((sum, stone) => sum + (stone.weight || 0), 0);

    // Format Materials string. If undefined, it will evaluate to a falsy empty string.
    const materialStr = product.metal?.type
        ? `${product.metal.color ? product.metal.color + ' ' : ''}${product.metal.type}`.trim()
        : null;

    const ChevronIcon = ({ isOpen }) => (
        <svg
            className={`w-5 h-5 text-[#BF8F5F] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
        </svg>
    );

    return (
        <div className="flex flex-col">

            {/* 1. Description */}
            {product.description && (
                <div className="border-b border-gray-100">
                    <button onClick={() => toggleAccordion('description')} className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-[#222222]">
                        Description
                        <ChevronIcon isOpen={openAccordions.description} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordions.description ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <p className="text-[#222222] text-sm leading-relaxed">{product.description}</p>
                    </div>
                </div>
            )}

            {/* 2. Details */}
            <div className="border-b border-gray-100">
                <button onClick={() => toggleAccordion('details')} className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-[#222222]">
                    Details
                    <ChevronIcon isOpen={openAccordions.details} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordions.details ? 'max-h-96 opacity-100 pb-6 pt-2' : 'max-h-0 opacity-0'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[13px]">

                        {/* Left Column - Only renders items that exist */}
                        <div className="space-y-4">
                            {[
                                ['SIZE', selectedDimension?.size],
                                ['WIDTH', selectedDimension?.width],
                                ['LENGTH', selectedDimension?.length],
                            ].map(([label, value]) =>
                                value?.trim() ? (
                                    <p key={label}>
                                        <span className="text-[#BF8F5F] font-bold tracking-widest mr-2">
                                            {label}:
                                        </span>

                                        <span className="text-[#222222]">
                                            {value}
                                        </span>
                                    </p>
                                ) : null
                            )}
                            {product.sku && (
                                <p><span className="text-[#BF8F5F] font-bold tracking-widest mr-2">NUMBER:</span> <span className="text-[#222222]">{product.sku}</span></p>
                            )}
                        </div>

                        {/* Right Column - Only renders items that exist */}
                        <div className="space-y-4">
                            {totalCarats > 0 && (
                                <p><span className="text-[#BF8F5F] font-bold tracking-widest mr-2">CARATS:</span> <span className="text-[#222222]">{totalCarats} Carats</span></p>
                            )}
                            {product.category?.name && (
                                <p><span className="text-[#BF8F5F] font-bold tracking-widest mr-2">CATEGORY:</span> <span className="text-[#222222]">{product.category.name}</span></p>
                            )}
                            {materialStr && (
                                <p><span className="text-[#BF8F5F] font-bold tracking-widest mr-2">MATERIALS:</span> <span className="text-[#222222]">{materialStr}</span></p>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* 3. Reviews */}
            <div className="border-b border-gray-100">
                <button onClick={() => toggleAccordion('reviews')} className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-[#222222]">
                    Reviews
                    <ChevronIcon isOpen={openAccordions.reviews} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordions.reviews ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <p className="text-[#222222] text-sm">No reviews yet.</p>
                </div>
            </div>

            {/* 4. Stone Elegance Details */}
            {product.stones && product.stones.length > 0 && (
                <div className="border-b border-gray-100">
                    <button onClick={() => toggleAccordion('stone')} className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-[#222222]">
                        Stone Elegance Details
                        <ChevronIcon isOpen={openAccordions.stone} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openAccordions.stone ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <ul className="text-[13px] text-[#222222] space-y-4">
                            {product.stones.map((stone, idx) => (
                                <li key={idx} className="flex flex-col gap-1 border-b border-gray-50 pb-3 last:border-0">
                                    <span className="font-bold capitalize">
                                        {stone.type || 'Stone'} {stone.count ? `(x${stone.count})` : ''}
                                    </span>
                                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                                        {stone.shape && <span><strong className="text-gray-500 font-normal">Shape:</strong> {stone.shape}</span>}
                                        {stone.color && <span><strong className="text-gray-500 font-normal">Color:</strong> {stone.color}</span>}
                                        {stone.clarity && <span><strong className="text-gray-500 font-normal">Clarity:</strong> {stone.clarity}</span>}
                                        {stone.weight && <span><strong className="text-gray-500 font-normal">Weight:</strong> {stone.weight}ct</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* 5. Price Distribution */}
            <div className="border-b border-gray-100">
                <button onClick={() => toggleAccordion('price')} className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-[#222222]">
                    Price Distribution
                    <ChevronIcon isOpen={openAccordions.price} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openAccordions.price ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[13px]">
                        {Number(product.price?.basePrice) > 0 && (
                            <p><span className="text-[#BF8F5F] font-bold tracking-widest mr-2">BASE PRICE:</span> <span className="text-[#222222]">{currency}{product.price.basePrice}</span></p>
                        )}
                        {Number(product.price?.makingCharges) > 0 && (
                            <p><span className="text-[#BF8F5F] font-bold tracking-widest mr-2">MAKING:</span> <span className="text-[#222222]">{currency}{product.price.makingCharges}</span></p>
                        )}
                        {Number(product.price?.tax) > 0 && (
                            <p><span className="text-[#BF8F5F] font-bold tracking-widest mr-2">TAX:</span> <span className="text-[#222222]">{currency}{product.price.tax}</span></p>
                        )}
                        {Number(product.price?.finalPrice) > 0 && (
                            <p><span className="text-[#BF8F5F] font-bold tracking-widest mr-2">FINAL PRICE:</span> <span className="text-[#222222] font-bold">{currency}{product.price.finalPrice}</span></p>
                        )}
                    </div>
                </div>
            </div>

            {/* 6. Return & Exchange Policy */}
            <div className="border-b border-gray-100">
                <button
                    type="button"
                    onClick={() => toggleAccordion('returnPolicy')}
                    aria-expanded={openAccordions.returnPolicy}
                    className="w-full flex justify-between items-center py-5 text-[16px] font-bold text-[#222222]"
                >
                    Return & Exchange Policy
                    <ChevronIcon isOpen={openAccordions.returnPolicy} />
                </button>

                {openAccordions.returnPolicy && (
                    <div className="pb-6 text-[#222222] text-sm leading-7 space-y-3">
                        <p>• Returns or exchanges must be requested within 7 days of delivery.</p>

                        <p>• Jewellery must be unused, undamaged, and returned with its original packaging and intact security tag.</p>

                        <p>• Incorrect ring sizes selected by customers, customized jewellery, and final-sale items are not eligible for returns or exchanges.</p>

                        <p>• Damaged, defective, or incorrect items must be reported within 24 hours of delivery with a continuous, unedited unboxing video.</p>

                        <p>• Reverse shipping charges of ₹100–₹150 (or actual courier cost) may apply.</p>

                        <p>• Approved prepaid refunds are processed within 5–7 business days after successful quality inspection.</p>

                        <p className="pt-2">
                            For assistance:{' '}
                            <a
                                href="mailto:dwarajewels.official@gmail.com"
                                className="text-[#BF8F5F] hover:underline"
                            >
                                dwarajewels.official@gmail.com
                            </a>
                        </p>

                        <Link
                            href="/return-and-exchange-policy"
                            className="inline-block text-[#BF8F5F] font-semibold hover:underline"
                        >
                            Read Full Return & Exchange Policy →
                        </Link>
                    </div>
                )}
            </div>


        </div>
    );
}