
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import LuxeProductFilterSidebar from './LuxeProductFilterSidebar';
import { createPortal } from 'react-dom';

export default function LuxeMobileFilter({
    products,
    categories,
    currentCategory,
}) {
    const [isOpen, setIsOpen] = useState(false);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Close drawer whenever URL filters change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname, searchParams]);

    // Lock background scrolling while drawer is open
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
                aria-label="Open Luxe product filters"
                aria-expanded={isOpen}
                aria-controls="luxe-mobile-filters"
                className="lg:hidden inline-flex items-center gap-2 border border-[#D6B693] text-[#D6B693] px-4 py-2.5 text-sm font-medium"
            >
                <SlidersHorizontal size={17} />
                Filters
            </button>

            {/* Mobile Filter Drawer */}
            {isOpen && createPortal(
                <div className="fixed inset-0 z-[9999] lg:hidden">

                    {/* Backdrop */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close filters"
                        className="absolute inset-0 w-full h-full bg-black/75"
                    />

                    {/* Drawer */}
                    <div
                        id="luxe-mobile-filters"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Luxe product filters"
                        className="absolute top-0 right-0 h-full w-[85%] max-w-[360px] bg-[#0C0E17] border-l border-[#D6B693]/30 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10 shrink-0">
                            <h2 className="font-serif text-white text-xl">
                                Filter Luxe Pieces
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close filters"
                                className="p-1 text-[#D6B693]"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Existing Luxe Filters */}
                        <div className="flex-1 min-h-0 overflow-y-auto p-5">
                            <LuxeProductFilterSidebar
                                products={products}
                                categories={categories}
                                currentCategory={currentCategory}
                            />
                        </div>

                        {/* Footer */}
                        <div className="border-t border-white/10 p-4 shrink-0 bg-[#0C0E17]">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-[#D6B693] text-[#0C0E17] py-3 font-semibold text-sm uppercase tracking-wider"
                            >
                                View Products
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
