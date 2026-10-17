import Image from 'next/image';
import Link from 'next/link';
import ProductFilterSidebar from './components/ProductFilterSidebar';
import MobileFilter from './components/MobileFilter';
import { fetchProductApi, fetchCategoryApi } from '../../api/productApi';
import serverClient from '../../api/serverClient';

// --- Server-Side Data Fetching ---
// --- Server-Side Data Fetching ---

const serverApiClient = {
    get: async (path, options = {}) => {
        const query = new URLSearchParams();

        Object.entries(options.params || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.set(key, String(value));
            }
        });

        const endpoint = `${path}${query.size ? `?${query}` : ''}`;

        return serverClient.request(endpoint, {
            method: 'GET',
            cache: 'no-store',
        });
    },
};

async function getCategoryPageData(searchParams = {}) {
    const params = {};

    const categoryId = searchParams.categoryId || searchParams.category;
    const collectionId = searchParams.collectionId || searchParams.collection;

    if (categoryId) params.category = categoryId;
    if (collectionId) params.collection = collectionId;

    if (searchParams.gender) {
        params.gender = searchParams.gender;
    }

    if (searchParams.search) {
        params.search = searchParams.search;
    }

    if (searchParams.isNewArrival === 'true') {
        params.isNewArrival = true;
    }

    if (searchParams.luxe === 'true' || searchParams.isLuxe === 'true') {
        params.luxe = true;
    } else {
        params.luxe = false;
    }

    // Existing sidebar filters
    for (const key of [
        'subCategory',
        'metal',
        'stone',
        'size',
        'minPrice',
        'maxPrice',
    ]) {
        if (searchParams[key]) {
            params[key] = searchParams[key];
        }
    }

    try {
        const [productsData, categoriesData] = await Promise.all([
            fetchProductApi(params, serverApiClient),
            fetchCategoryApi(
                params.luxe ? 'luxe' : 'normal',
                serverApiClient
            ),
        ]);

        return {
            products: productsData?.products || [],
            categories: categoriesData?.categories || [],
            totalCount: productsData?.count ?? productsData?.products?.length ?? 0,
        };
    } catch (error) {
        console.error('Category products error:', error);

        return {
            products: [],
            categories: [],
            totalCount: 0,
        };
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
    const { products, categories, totalCount } = await getCategoryPageData(resolvedSearchParams);

    const img1 = "/images/CatBanner.webp";

    return (
        <div className="flex flex-col lg:flex-row min-h-screen gap-8 lg:gap-10 horizontal-padding mt-16 md:mt-24 lg:mt-[100px] relative">

            {/* Filter Sidebar (Server/Client Hybrid wrapper) */}
            <div className="hidden lg:block lg:w-[285px] shrink-0">
                <ProductFilterSidebar
                    products={products}
                    categories={categories}
                    currentCategory={
                        resolvedSearchParams?.categoryId ||
                        resolvedSearchParams?.category ||
                        ''
                    }
                    currentCollection={
                        resolvedSearchParams?.collectionId ||
                        resolvedSearchParams?.collection ||
                        ''
                    }
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

                    <div className="flex justify-between items-center gap-3 mt-4 lg:mt-[36px]">
                        <p className="heading-des text-gray-500">
                            Showing {totalCount} Products
                        </p>

                        <MobileFilter
                            products={products}
                            categories={categories}
                            currentCategory={
                                resolvedSearchParams?.categoryId ||
                                resolvedSearchParams?.category ||
                                ''
                            }
                            currentCollection={
                                resolvedSearchParams?.collectionId ||
                                resolvedSearchParams?.collection ||
                                ''
                            }
                        />
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


                                <div className="flex flex-wrap items-center gap-2 mt-2 lg:mt-[15px]">
                                    {product.price?.compareAtPrice != null &&
                                        product.price?.finalPrice != null &&
                                        Number(product.price.compareAtPrice) >
                                        Number(product.price.finalPrice) && (
                                            <span className="text-gray-400 font-normal line-through text-[10px] sm:text-xs">
                                                {product.price?.currency === 'USD' ? '$' : 'Rs. '}
                                                {Number(product.price.compareAtPrice).toLocaleString('en-IN')}
                                            </span>
                                        )}

                                    <span className="title-main font-bold text-sm lg:text-base text-[#222222]">
                                        {product.price?.finalPrice != null
                                            ? `${product.price?.currency === 'USD' ? '$' : 'Rs. '}${Number(product.price.finalPrice).toLocaleString('en-IN')}`
                                            : '—'}
                                    </span>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}