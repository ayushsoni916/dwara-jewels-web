import Image from 'next/image';
import Link from 'next/link';
import LuxeProductFilterSidebar from '../../components/Luxe/LuxeProductFilterSidebar';

// --- Server-Side Data Fetching ---
async function getLuxeCategoryPageData(searchParams) {
    try {
        const resolvedParams = await searchParams;
        
        const categoryId = resolvedParams?.category || '';
        const subCategory = resolvedParams?.subCategory || '';
        const collectionId = resolvedParams?.collection || '';
        const searchQuery = resolvedParams?.search || '';
        const metal = resolvedParams?.metal || '';
        const stone = resolvedParams?.stone || '';
        const size = resolvedParams?.size || '';
        const minPrice = resolvedParams?.minPrice || '';
        const maxPrice = resolvedParams?.maxPrice || '';

        const queryParams = new URLSearchParams();
        if (categoryId) queryParams.append('category', categoryId);
        if (subCategory) queryParams.append('subCategory', subCategory);
        if (collectionId) queryParams.append('collection', collectionId);
        if (searchQuery) queryParams.append('search', searchQuery);
        if (metal) queryParams.append('metal', metal);
        if (stone) queryParams.append('stone', stone);
        if (size) queryParams.append('size', size);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);

        // Force luxe to true for this section
        queryParams.append('luxe', 'true');

        const [productsRes, categoriesRes] = await Promise.all([
            fetch(`https://dwarajewels.in/api/product?${queryParams.toString()}`, { cache: 'no-store' }),
            fetch(`https://dwarajewels.in/api/category?type=luxe`, { next: { revalidate: 3600 } })
        ]);

        const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };

        return {
            products: productsData.products || [],
            categories: categoriesData.categories || []
        };
    } catch (error) {
        console.error("Error fetching luxe category page data:", error);
        return { products: [], categories: [] };
    }
}

export async function generateMetadata({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    let title = 'Luxe Collection';
    if (resolvedSearchParams?.search) title = `Search: ${resolvedSearchParams.search}`;
    
    return {
        title: `${title} | Dwara Jewels`,
        description: 'Explore our exclusive luxury jewelry collection.',
    };
}

export default async function LuxeCategoryPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const { products, categories } = await getLuxeCategoryPageData(resolvedSearchParams);

    return (
        <div 
            className="relative min-h-screen w-full flex flex-col lg:flex-row gap-8 lg:gap-12 px-6 lg:px-20 pt-32 lg:pt-40 pb-24 selection:bg-[#E5D3C4] selection:text-black overflow-hidden"
            style={{ background: 'radial-gradient(69.72% 78.08% at 47.07% 0%, #1F2A40 0%, #0C0E17 100%)' }}
        >
            {/* Starry Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60">
                <Image src="/images/Background.png" alt="Luxury Starry Background" fill className="object-cover" />
            </div>

            <div className="relative z-10 w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
                
                {/* Filter Sidebar (Client Component) */}
                <div className="w-full lg:w-[280px] shrink-0">
                    <LuxeProductFilterSidebar
                        products={products}
                        categories={categories}
                        currentCategory={resolvedSearchParams?.category}
                    />
                </div>

                {/* Product Display Area */}
                <main className="flex-1 w-full flex flex-col">

                    {/* Luxe Header Section */}
                    <div className="flex flex-col mb-10 border-b border-white/10 pb-6">
                        <span className="text-[#D6B693] font-sans font-semibold text-[12px] uppercase tracking-[0.3em] mb-2">
                            THE EXCLUSIVE SELECTION
                        </span>
                        <h1 className="font-serif font-normal text-white text-[32px] sm:text-[48px] leading-tight mb-2">
                            {resolvedSearchParams?.search ? `Results for "${resolvedSearchParams.search}"` : "Luxe Collection"}
                        </h1>
                        <p className="text-white/50 font-sans text-sm">
                            Showing <span className="text-white font-semibold">{products.length}</span> Masterpieces
                        </p>
                    </div>

                    {/* Product Grid */}
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 border border-white/5 bg-white/5 backdrop-blur-sm mt-4">
                            <p className="text-[#D6B693] font-serif text-2xl mb-2">No Pieces Found</p>
                            <p className="text-white/50 font-sans text-sm">Try adjusting your exclusive filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => {
                                const currency = product.price?.currency === 'USD' ? '$' : 'Rs. ';
                                const finalPrice = product.price?.finalPrice?.toLocaleString() || "0.00";
                                const imageUrl = product.thumbnail || (product.images && product.images[0]) || '/placeholder.webp';

                                return (
                                    <div key={product._id} className="group flex flex-col h-full relative cursor-pointer">
                                        
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

                                        {/* Product Details */}
                                        <div className="flex flex-col flex-grow">
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <Link href={`/luxe/product/${product._id}`} className="hover:text-[#E5D3C4] transition-colors">
                                                    <h3 className="text-white font-sans font-bold text-[13px] leading-snug line-clamp-2">
                                                        {product.title}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center gap-3 shrink-0 text-[#E5D3C4]">
                                                    <button className="hover:text-white transition-colors" aria-label="Add to Wishlist">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70 hover:opacity-100"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                                    </button>
                                                    <button className="hover:text-white transition-colors" aria-label="Add to Cart">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-70 hover:opacity-100"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-white font-sans font-bold text-[13px] mt-auto pt-2">
                                                {currency}{finalPrice}
                                            </p>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}