import Image from 'next/image';
import Link from 'next/link';

// --- Server-Side Fetch Function for Luxe Trending Products ---
async function getLuxeTrendingProducts() {
    try {
        const res = await fetch('https://dwarajewels.in/api/product?limit=4&luxe=true', {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch luxe products');
        }

        const data = await res.json();
        return data.products || [];
    } catch (error) {
        console.error("Error fetching trending products:", error);
        return [];
    }
}

export default async function LuxeTrendingProducts() {
    const products = await getLuxeTrendingProducts();

    if (!products || products.length === 0) return null;

    return (
        // Adjusted padding top/bottom to match the clean spacing in your reference image
        <section className="relative w-full py-16 md:py-44 px-6 lg:px-20 overflow-hidden bg-transparent">

            {/* 1. Left Glow Background Layer */}
            <div className="absolute inset-y-0 left-0 w-full md:w-[60%] z-0 pointer-events-none opacity-60 mix-blend-screen">
                <Image
                    src="/images/LeftGlow.webp"
                    alt="Background Glow"
                    fill
                    className="object-cover object-left"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Header Section matching your reference style */}
                <div className="mb-10">
                    <span className="text-[#D6B693] font-sans font-semibold text-[13px] lg:text-[14px] uppercase tracking-[0.2em] block mb-2">
                        TRENDING PRODUCTS
                    </span>

                    <h2 className="font-serif font-normal text-white text-[32px] sm:text-[40px] leading-tight mb-2">
                        Beauty At Its Finest
                    </h2>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <p className="text-white/50 font-sans text-sm max-w-xl">
                            Discover our handpicked selection of exquisite jewelry pieces, curated to elevate your style and capture the essence.
                        </p>

                        {/* Carousel Dots indicator */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                            <div className="w-6 h-1.5 rounded-full bg-[#E5D3C4]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                        </div>
                    </div>
                </div>

                {/* Right Product Grid Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => {
                        const currency = product.price?.currency === 'USD' ? '$' : '₹';
                        const finalPrice = product.price?.finalPrice?.toLocaleString() || "0.00";
                        const imageUrl = product.thumbnail || (product.images && product.images[0]) || '/placeholder.webp';

                        return (
                            <div key={product._id} className="group flex flex-col h-full relative">

                                {/* Gradient Border Wrapper */}
                                <div className="relative aspect-[373/281] w-full mb-4 bg-gradient-to-b from-[#D6B693] to-transparent p-[0.5px]">
                                    <div className="relative w-full h-full bg-[#0C0E17] overflow-hidden flex items-center justify-center">
                                        {product.isNewArrival && (
                                            <span className="absolute top-3 left-3 bg-[#D6B693] text-[#0C0E17] font-bold text-[10px] px-2 py-0.5 z-10 tracking-wider pointer-events-none">
                                                NEW
                                            </span>
                                        )}

                                        <Link href={`/luxe/product/${product._id}`} className="w-full h-full relative block">
                                            <Image
                                                src={imageUrl}
                                                alt={product.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                            />
                                        </Link>
                                    </div>
                                </div>

                                {/* Product Details Layout matching reference spacing */}
                                <div className="flex flex-col flex-grow">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <Link href={`/luxe/product/${product._id}`} className="hover:text-[#E5D3C4] transition-colors">
                                            <h3 className="text-white font-sans font-bold text-[13px] leading-snug line-clamp-2">
                                                {product.title}
                                            </h3>
                                        </Link>

                                        {/* Action Icons */}
                                        <div className="flex items-center gap-3 shrink-0 text-[#E5D3C4]">
                                            <button className="hover:text-white transition-colors" aria-label="Add to Wishlist">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70 hover:opacity-100">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                                </svg>
                                            </button>
                                            <button className="hover:text-white transition-colors" aria-label="Add to Cart">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70 hover:opacity-100">
                                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <p className="text-white font-sans font-bold text-[13px] mt-auto pt-2">
                                        {currency}{finalPrice}
                                    </p>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Gradient Border Line */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#F2DFCE] to-transparent z-20 mt-16"></div>

        </section>
    );
}