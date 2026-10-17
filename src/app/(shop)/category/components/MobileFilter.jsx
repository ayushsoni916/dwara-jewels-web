
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductFilterSidebar from './ProductFilterSidebar';

export default function MobileFilter({
    products,
    categories,
    currentCategory,
    currentCollection,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Close drawer after a filter changes the URL
    useEffect(() => {
        setIsOpen(false);
    }, [pathname, searchParams]);

    // Prevent background scrolling while drawer is open
    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    return (
        <>
            {/* Mobile Filter Button */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 border border-[#BF8F5F] text-[#BF8F5F] px-4 py-2.5 text-sm font-medium"
                aria-label="Open product filters"
                aria-expanded={isOpen}
                aria-controls="mobile-product-filters"
            >
                <SlidersHorizontal size={17} />
                Filters
            </button>

            {/* Mobile Filter Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">

                    {/* Overlay */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/40 w-full h-full"
                        aria-label="Close filters"
                    />

                    {/* Drawer */}
                    <div
                        id="mobile-product-filters"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Product filters"
                        className="absolute top-0 right-0 h-full w-[85%] max-w-[360px] bg-white shadow-xl flex flex-col"
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200">
                            <h2 className="font-serif text-[#222222] text-xl">
                                Filter Products
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close filters"
                                className="p-1 text-[#222222]"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Existing Filters */}
                        <div className="flex-1 overflow-y-auto p-5">
                            <ProductFilterSidebar
                                products={products}
                                categories={categories}
                                currentCategory={currentCategory}
                                currentCollection={currentCollection}
                            />
                        </div>

                        {/* Drawer Footer */}
                        <div className="border-t border-gray-200 p-4">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-[#BF8F5F] text-white py-3 font-medium text-sm uppercase tracking-wider"
                            >
                                View Products
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
