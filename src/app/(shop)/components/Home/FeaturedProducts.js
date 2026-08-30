import Image from 'next/image';
import Link from 'next/link';

// --- Server-Side Fetch Function ---
async function getTrendingProducts() {
    try {
        const res = await fetch('http://localhost:4500/api/product?limit=4', {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await res.json();
        return data.products || [];
    } catch (error) {
        console.error("Error fetching trending products:", error);
        return []; 
    }
}

export default async function FeaturedProducts() {
    const products = await getTrendingProducts();

    if (!products || products.length === 0) return null;

    return (
        <section className="bg-[#F9F1E7] py-20 px-6 lg:px-20 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

                {/* Left Sidebar Text */}
                <div className="lg:w-1/4 flex flex-col justify-center">
                    <span className="text-[#BF8F5F] font-sans text-xs uppercase tracking-[0.3em] mb-4">
                        Trending Products
                    </span>
                    <h2 className="text-[#222222] font-serif text-4xl lg:text-5xl leading-tight mb-6">
                        Beauty At Its Finest
                    </h2>
                    <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                        Discover our handpicked selection of exquisite jewelry pieces, curated to elevate your style and capture the essence.
                    </p>
                    
                    {/* UPDATED LINK: Redirects to the category/shop page filtering for trending/newest items */}
                    <Link 
                        href="/category?sort=newest" 
                        className="text-[#BF8F5F] font-bold border-b border-[#BF8F5F] pb-1 uppercase text-xs tracking-widest inline-block w-fit hover:text-black hover:border-black transition-colors"
                    >
                        Explore More →
                    </Link>
                </div>

                {/* Right Product Slider Area */}
                <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="group flex flex-col h-full relative">

                            {/* Image Container */}
                            <div className="relative aspect-square bg-white mb-6 overflow-hidden rounded-none flex items-center justify-center">
                                {product.isNewArrival && (
                                    <span className="absolute top-4 left-4 bg-[#C19875] text-white text-[10px] px-2 py-1 z-10 tracking-wider pointer-events-none">
                                        NEW
                                    </span>
                                )}

                                <Link href={`/product/${product._id}`} className="w-full h-full relative block">
                                    <Image
                                        src={product.thumbnail || (product.images && product.images[0]) || '/placeholder.webp'}
                                        alt={product.title}
                                        fill
                                        className="object-cover p-0 transition-transform duration-500 group-hover:scale-105"
                                    />
                                </Link>
                            </div>

                            {/* Product Details */}
                            <div className="flex flex-col flex-grow">
                                <Link href={`/product/${product._id}`} className="hover:text-[#C19875] transition-colors inline-block w-fit">
                                    <h3 className="text-[#222222] font-bold text-[13px] sm:text-sm leading-snug mb-4">
                                        {product.title} <br />
                                        {product.metal?.type && (
                                            <span className="font-normal text-gray-500 text-xs">
                                                in {product.metal?.quality} {product.metal?.color} {product.metal?.type}
                                            </span>
                                        )}
                                    </h3>
                                </Link>

                                <p className="text-[#222222] font-bold text-[13px] sm:text-sm mb-6">
                                    {product.price?.currency === 'USD' ? '$' : '₹'}
                                    {product.price?.finalPrice?.toLocaleString()}
                                </p>

                                {/* Quick Action Icons */}
                                <div className="flex items-center gap-4 mt-auto text-[#C19875]">
                                    <button className="hover:text-[#222222] transition-colors z-10" aria-label="Add to Wishlist">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                        </svg>
                                    </button>
                                    <button className="hover:text-[#222222] transition-colors z-10" aria-label="Add to Cart">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-end gap-4 mt-12 max-w-7xl mx-auto hidden lg:flex">
                <button className="w-10 h-10 border border-[#BF8F5F] rounded-full flex items-center justify-center text-[#BF8F5F] hover:bg-[#BF8F5F] hover:text-white transition-all">
                    ←
                </button>
                <button className="w-10 h-10 border border-[#BF8F5F] rounded-full flex items-center justify-center text-[#BF8F5F] hover:bg-[#BF8F5F] hover:text-white transition-all">
                    →
                </button>
            </div>
        </section>
    );
}