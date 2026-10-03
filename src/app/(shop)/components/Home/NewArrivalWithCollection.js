import Image from 'next/image';
import Link from 'next/link';

// --- Server-Side Fetch Function ---
async function getNewArrivalProducts() {
    try {
        // Fetch max 6 products marked as new arrivals
        const res = await fetch('https://dwarajewels.in/api/product?isNewArrival=true&limit=6', {
            next: { revalidate: 3600 } // Revalidate every hour for high performance & SEO
        });

        if (!res.ok) {
            throw new Error('Failed to fetch new arrivals');
        }

        const data = await res.json();
        return data.products || [];
    } catch (error) {
        console.error("Error fetching new arrivals:", error);
        return [];
    }
}

export default async function NewArrivalWithCollection() {
    const products = await getNewArrivalProducts();
    const collectionImg = '/images/NewArrival.webp';

    // Don't render the section if there are no new arrivals yet
    if (!products || products.length === 0) return null;

    return (
        <section className="horizontal-padding mt-16 md:mt-24 lg:mt-50.5 flex flex-col lg:grid lg:grid-cols-[3fr_1fr] gap-6">

            {/* Left Side: Header & Products */}
            <div className="w-full">

                {/* Header Section */}
                <div>
                    <h2 className="text-[#BF8F5F] heading-tag uppercase">New Arrival</h2>
                    <h1 className="heading-main">Beauty At Its Finest</h1>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-2 gap-4">
                        <p className="heading-des text-gray-500">
                            Discover our handpicked selection of exquisite jewelry pieces, curated
                        </p>
                    </div>
                </div>

                {/* Product Grid Area (Max 6 Products strictly enforced) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                    {products.slice(0, 6).map((product) => (
                        <div key={product._id} className="group flex flex-col h-full relative">
                            
                            {/* Sharp Edges Image Container */}
                            <div className="relative aspect-square bg-[#FCF6F2] mb-4 overflow-hidden rounded-none flex items-center justify-center">

                                {/* LINK DIRECTLY ON THE IMAGE FOR SEO */}
                                <Link href={`/product/${product._id}`} className="w-full h-full relative block z-0">
                                    <Image
                                        src={product.thumbnail || (product.images && product.images[0]) || '/placeholder.webp'}
                                        alt={product.title}
                                        fill
                                        className="object-cover p-0 transition-transform duration-500 group-hover:scale-110"
                                    />
                                </Link>

                                {/* Quick Action Icons (Sharp Edges, higher z-index) */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                                    <button className="bg-white p-2.5 shadow-sm hover:bg-[#BF8F5F] hover:text-white transition-colors rounded-none pointer-events-auto">
                                        <Image src="/icons/Heart.svg" alt="Wishlist" width={18} height={18} />
                                    </button>
                                    <button className="bg-white p-2.5 shadow-sm hover:bg-[#BF8F5F] hover:text-white transition-colors rounded-none pointer-events-auto">
                                        <Image src="/icons/Cart.svg" alt="Add to Cart" width={18} height={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Product Info with SEO Title Link */}
                            <Link href={`/product/${product._id}`} className="hover:text-[#BF8F5F] transition-colors inline-block w-fit">
                                <h3 className="text-[#222222] font-bold text-sm leading-tight mb-1 line-clamp-1">
                                    {product.title}
                                </h3>
                            </Link>
                            
                            <p className="text-gray-500 text-xs mb-2 capitalize">
                                {product.metal?.color} {product.metal?.type} {product.metal?.quality}
                            </p>
                            <p className="text-[#BF8F5F] font-bold text-sm mt-auto">
                                {product.price?.currency === 'USD' ? '$' : 'Rs. '}
                                {product.price?.finalPrice?.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Collection Banner */}
            <Link href="/shop?isNewArrival=true" className="relative w-full h-[400px] lg:h-auto min-h-[600px] overflow-hidden rounded-none mt-8 lg:mt-0 group block">
                <Image
                    src={collectionImg}
                    alt="New Arrival Collection"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>

                {/* Top Label */}
                <div className="absolute top-8 left-8 flex items-center gap-4 z-10">
                    <span className="text-white text-xs tracking-[0.2em] uppercase font-medium">Collection</span>
                    <div className="w-px h-4 bg-white/50"></div>
                </div>

                {/* Bottom Text Details */}
                <div className="absolute bottom-10 left-8 right-8 flex flex-col items-start text-white z-10">
                    <h3 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">
                        New Arrival
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed mb-8 max-w-xs font-light">
                        Introducing our latest new arrival collection. Suitable for the active yet elegant.
                    </p>

                    {/* Explore Link */}
                    <div className="flex items-center gap-3 text-sm font-bold group-hover:text-[#BF8F5F] transition-colors">
                        Explore
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-2">
                            <line x1="4" y1="12" x2="20" y2="12"></line>
                            <polyline points="14 6 20 12 14 18"></polyline>
                        </svg>
                    </div>
                </div>
            </Link>

        </section>
    );
}