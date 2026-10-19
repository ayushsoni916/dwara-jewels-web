import Image from 'next/image';
import Link from 'next/link';
import LuxeProductFilterSidebar from '../../components/Luxe/LuxeProductFilterSidebar';
import { fetchProductApi, fetchCategoryApi } from '../../../api/productApi';
import serverClient from '../../../api/serverClient';
import LuxeMobileFilter from '../../components/Luxe/LuxeMobileFilter';
import WishlistButton from '../../components/WishlistButton';

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

async function getLuxeCategoryPageData(searchParams = {}) {
    const params = {
        luxe: true,
    };

    const categoryId = searchParams.categoryId || searchParams.category;
    const collectionId = searchParams.collectionId || searchParams.collection;

    if (categoryId) params.category = categoryId;
    if (collectionId) params.collection = collectionId;

    if (searchParams.search) {
        params.search = searchParams.search;
    }

    if (searchParams.gender) {
        params.gender = searchParams.gender;
    }

    if (searchParams.isNewArrival === 'true') {
        params.isNewArrival = true;
    }

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
            fetchCategoryApi('luxe', serverApiClient),
        ]);

        return {
            products: productsData?.products || [],
            categories: (categoriesData?.categories || []).filter(
                cat => cat.isLuxeCategory === true
            ),
            totalCount:
                productsData?.count ??
                productsData?.products?.length ??
                0,
        };
    } catch (error) {
        console.error('Luxe category products error:', error);

        return {
            products: [],
            categories: [],
            totalCount: 0,
        };
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
    const { products, categories, totalCount } = await getLuxeCategoryPageData(resolvedSearchParams);

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
                <div className="hidden lg:block lg:w-[280px] shrink-0">
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

                        <div className="flex items-center justify-between gap-3 mt-2">
                            <p className="text-white/50 font-sans text-sm">
                                Showing{' '}
                                <span className="text-white font-semibold">
                                    {totalCount}
                                </span>{' '}
                                Masterpieces
                            </p>

                            <LuxeMobileFilter
                                products={products}
                                categories={categories}
                                currentCategory={
                                    resolvedSearchParams?.categoryId ||
                                    resolvedSearchParams?.category ||
                                    ''
                                }
                            />
                        </div>


                    </div>


                    {/* Product Grid */}
                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 border border-white/5 bg-white/5 backdrop-blur-sm mt-4">
                            <p className="text-[#D6B693] font-serif text-2xl mb-2">No Pieces Found</p>
                            <p className="text-white/50 font-sans text-sm">Try adjusting your exclusive filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            {products.map((product) => {
                                const currency = product.price?.currency === 'USD' ? '$' : 'Rs. ';

                                const finalPrice = Number(product.price?.finalPrice);
                                const comparePrice = Number(product.price?.compareAtPrice);

                                const hasDiscount =
                                    product.price?.finalPrice != null &&
                                    product.price?.compareAtPrice != null &&
                                    Number.isFinite(finalPrice) &&
                                    Number.isFinite(comparePrice) &&
                                    comparePrice > finalPrice;
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
                                                <div className="flex items-center shrink-0 text-[#D6B693]">
                                                    <WishlistButton productId={product._id} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
                                                {hasDiscount && (
                                                    <span className="text-white/40 font-sans text-[12px] line-through">
                                                        {currency}{comparePrice.toLocaleString('en-IN')}
                                                    </span>
                                                )}

                                                <span className="text-white font-sans font-bold text-[13px]">
                                                    {product.price?.finalPrice != null && Number.isFinite(finalPrice)
                                                        ? `${currency}${finalPrice.toLocaleString('en-IN')}`
                                                        : '—'}
                                                </span>
                                            </div>
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