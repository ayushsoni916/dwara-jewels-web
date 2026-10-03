import Image from 'next/image';
import Link from 'next/link';
import ProductFilterSidebar from './components/ProductFilterSidebar';

// --- Server-Side Data Fetching ---
// --- Server-Side Data Fetching ---
async function getCategoryPageData(searchParams) {
    try {
        // 1. Extract ALL possible routing parameters (Added metal, stone, size)
        const categoryId = searchParams?.category || '';
        const subCategory = searchParams?.subCategory || '';
        const collectionId = searchParams?.collection || '';
        const searchQuery = searchParams?.search || '';
        const metal = searchParams?.metal || '';
        const stone = searchParams?.stone || '';
        const size = searchParams?.size || '';
        const minPrice = searchParams?.minPrice || '';
        const maxPrice = searchParams?.maxPrice || '';

        // 2. Build query string for your backend API
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

        // Force luxe to false to only show normal products on this page
        queryParams.append('luxe', 'false');

        // Fetch filtered products and categories in parallel
        const [productsRes, categoriesRes] = await Promise.all([
            fetch(`https://dwarajewels.in/api/product?${queryParams.toString()}`, { cache: 'no-store' }),
            fetch(`https://dwarajewels.in/api/category?type=normal`, { next: { revalidate: 3600 } })
        ]);

        const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { categories: [] };

        return {
            products: productsData.products || [],
            categories: categoriesData.categories || []
        };
    } catch (error) {
        console.error("Error fetching category page data:", error);
        return { products: [], categories: [] };
    }
}

// --- Dynamic SEO Metadata ---
export async function generateMetadata({ searchParams }) {
    const resolvedSearchParams = await searchParams;

    let title = 'Category Products';
    if (resolvedSearchParams?.search) title = `Search: ${resolvedSearchParams.search}`;
    else if (resolvedSearchParams?.collection) title = 'Collection Products';

    return {
        title: `${title} | Dwara Jewels`,
        description: 'Explore our handpicked collection of exquisite jewelry pieces.',
    };
}

export default async function CategoryPage({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const { products, categories } = await getCategoryPageData(resolvedSearchParams);

    const img1 = "/images/CatBanner.webp";

    return (
        <div className="flex flex-col lg:flex-row min-h-screen gap-8 lg:gap-10 horizontal-padding mt-16 md:mt-24 lg:mt-[100px] relative">

            {/* Filter Sidebar (Server/Client Hybrid wrapper) */}
            <div className="w-full lg:w-[285px] shrink-0">
                <ProductFilterSidebar
                    products={products}
                    categories={categories}
                    currentCategory={resolvedSearchParams?.category}
                    currentCollection={resolvedSearchParams?.collection}
                />
            </div>

            {/* Product Display Area */}
            <main className="flex-1 mt-4 lg:mt-0 w-full">

                {/* Banner Image */}
                <div className="overflow-hidden mb-8 lg:mb-15 rounded-md lg:rounded-none">
                    <div className="relative w-full h-[250px] sm:h-[350px]">
                        <Image
                            src={img1}
                            alt="Collection Banner"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Header Section */}
                <div className="flex flex-col mb-8 lg:mb-15">
                    {/* Dynamic Header based on search */}
                    <h2 className="heading-main">
                        {resolvedSearchParams?.search ? `Results for "${resolvedSearchParams.search}"` : "Our Products"}
                    </h2>
                    <div className="flex justify-between items-center mt-4 lg:mt-[36px]">
                        <p className="heading-des text-gray-500">Showing {products.length} Products</p>
                    </div>
                    <div className="bg-[#BF8F5F] h-px w-full mt-4 lg:mt-[28px]" />
                </div>

                {/* Product Grid */}
                {products.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 text-sm">
                        No products found for this selection.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {products.map((product) => (
                            <div key={product._id} className="group cursor-pointer mb-6 lg:mb-[60px] flex flex-col">

                                {/* Product Image Container with SEO Link */}
                                <div className="bg-[#F9F6F2] mb-4 lg:mb-6 overflow-hidden relative w-full aspect-square rounded-sm">
                                    <Link href={`/product/${product._id}`} className="w-full h-full relative block">
                                        <Image
                                            src={product.thumbnail || (product.images && product.images[0]) || '/placeholder.webp'}
                                            alt={product.title}
                                            fill
                                            className="object-cover p-0 transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </Link>
                                </div>

                                {/* Product Details */}
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start pr-0 sm:pr-2 gap-2 sm:gap-0">
                                    <Link href={`/product/${product._id}`} className="hover:text-[#BF8F5F] transition-colors">
                                        <h3 className="title-main text-sm sm:text-base leading-tight pr-2 line-clamp-1">
                                            {product.title}
                                        </h3>
                                    </Link>

                                    {/* Action Icons */}
                                    <div className="flex items-center gap-3 shrink-0 mt-1 sm:mt-0">
                                        <button aria-label="Wishlist">
                                            <Image src="/icons/Heart.svg" alt="Wishlist" width={18} height={18} className="w-[18px] h-[18px] lg:w-5 lg:h-5 hover:scale-125 transition-transform" />
                                        </button>
                                        <button aria-label="Cart">
                                            <Image src="/icons/Cart.svg" alt="Add to Cart" width={18} height={18} className="w-[18px] h-[18px] lg:w-5 lg:h-5 hover:scale-125 transition-transform" />
                                        </button>
                                    </div>
                                </div>

                                <p className="title-main font-bold mt-2 lg:mt-[15px] text-sm lg:text-base">
                                    {product.price?.currency === 'USD' ? '$' : 'Rs. '}{product.price?.finalPrice?.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}