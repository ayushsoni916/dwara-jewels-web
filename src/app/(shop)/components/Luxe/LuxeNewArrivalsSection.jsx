import Image from 'next/image';
import Link from 'next/link';

// --- Server-Side Fetch Function for New Arrivals with Feature Banner ---
async function getLuxeNewArrivals() {
    try {
        // Fetching luxe products specifically marked as new arrivals
        const res = await fetch('http://localhost:4500/api/product?limit=6&luxe=true', {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch new arrival products');
        }

        const data = await res.json();
        return data.products || [];
    } catch (error) {
        console.error("Error fetching luxe new arrivals:", error);
        return []; 
    }
}

export default async function LuxeNewArrivalsSection() {
    const products = await getLuxeNewArrivals();

    if (!products || products.length === 0) return null;

    return (
        <section className="relative w-full py-20 px-6 lg:px-20 overflow-hidden bg-transparent">
            
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">

                {/* Left Side: Header & 3x2 Grid */}
                <div className="lg:w-[70%] flex flex-col">
                    
                    {/* Header Section */}
                    <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <span className="text-[#D6B693] font-sans font-semibold text-[13px] uppercase tracking-[0.2em] block mb-2">
                                NEW ARRIVAL
                            </span>
                            <h2 className="font-serif font-normal text-white text-[32px] sm:text-[40px] leading-tight">
                                Beauty At Its Finest
                            </h2>
                            <p className="text-white/50 font-sans text-sm mt-1">
                                Discover our handpicked selection of exquisite jewelry pieces, curated
                            </p>
                        </div>

                        {/* Sort Dropdown Stub */}
                        {/* <div className="flex items-center gap-2 text-xs text-white/70 font-sans border border-white/10 bg-[#12141D] px-4 py-2 shrink-0">
                            <span>Sort by</span>
                            <span className="text-[#E5D3C4] font-bold">|</span>
                            <span className="text-white font-medium">Women Product</span>
                            <span className="text-[10px] ml-2">▾</span>
                        </div> */}
                    </div>

                    {/* 3x2 Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.slice(0, 6).map((product) => {
                            const currency = product.price?.currency === 'USD' ? '$' : '₹';
                            const finalPrice = product.price?.finalPrice?.toLocaleString() || "0.00";
                            const imageUrl = product.thumbnail || (product.images && product.images[0]) || '/placeholder.webp';

                            return (
                                <div key={product._id} className="group flex flex-col h-full">
                                    {/* Gradient Border Wrapper */}
                                    <div className="relative aspect-square w-full mb-4 bg-gradient-to-b from-[#D6B693] to-transparent p-[0.5px]">
                                        <div className="relative w-full h-full bg-[#0C0E17] overflow-hidden flex items-center justify-center">
                                            <Link href={`/product/${product._id}`} className="w-full h-full relative block">
                                                <Image
                                                    src={imageUrl}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                                />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex flex-col flex-grow">
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <Link href={`/product/${product._id}`} className="hover:text-[#E5D3C4] transition-colors">
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

                {/* Right Side: Featured Collection Vertical Banner */}
                <div className="lg:w-[30%] w-full relative group overflow-hidden bg-[#12141D] border border-white/10 flex flex-col justify-end min-h-[550px] lg:min-h-[720px] p-8 mt-34">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <Image
                            src="/images/LuxeCol.jpg"
                            alt="Minimal Me Collection"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E17] via-[#0C0E17]/40 to-transparent" />
                    </div>

                    {/* Top Collection Tag */}
                    <div className="absolute top-6 left-8 z-10 flex items-center gap-2">
                        <span className="text-[#D6B693] font-sans font-semibold text-xs uppercase tracking-[0.2em]">
                            COLLECTION
                        </span>
                        <span className="text-[#D6B693]">|</span>
                    </div>

                    {/* Bottom Banner Content */}
                    <div className="relative z-10 flex flex-col">
                        <h3 className="font-serif text-white text-3xl mb-3">
                            Minimal Me
                        </h3>
                        <p className="text-gray-300 font-sans text-xs leading-relaxed mb-6">
                            Introducing our new minimalist collection. Suitable for the active yet elegant.
                        </p>
                        <Link
                            href="/luxe/category?collection=minimal"
                            className="text-[#E5D3C4] font-bold uppercase text-xs tracking-widest hover:text-white transition-colors flex items-center gap-2 w-fit"
                        >
                            <span>Explore</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>

            </div>

            {/* Bottom Gradient Border Line */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#F2DFCE] to-transparent z-20 mt-20"></div>

        </section>
    );
}