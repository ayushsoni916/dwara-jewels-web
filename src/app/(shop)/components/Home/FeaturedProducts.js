'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { fetchNewArrivalApi } from '../../../api/productApi';


const getDiscountPercentage = (product) => {
    const crossPrice = Number(product.price?.compareAtPrice);
    const finalPrice = Number(product.price?.finalPrice);

    return crossPrice > finalPrice
        ? Math.round(((crossPrice - finalPrice) / crossPrice) * 100)
        : 0;
};

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const sliderRef = useRef(null);

    useEffect(() => {
        let active = true;

        const loadNewArrivals = async () => {
            try {
                const data = await fetchNewArrivalApi(false);

                if (active) {
                    setProducts(data?.products || []);
                }
            } catch (error) {
                console.error('New arrivals error:', error);

                if (active) {
                    setProducts([]);
                }
            }
        };

        loadNewArrivals();

        return () => {
            active = false;
        };
    }, []);

    const scrollProducts = (direction) => {
        const slider = sliderRef.current;

        if (!slider) return;

        slider.scrollBy({
            left: direction * slider.clientWidth,
            behavior: 'smooth'
        });
    };

    if (!products.length) return null;

    
return (
    <section className="bg-[#F9F1E7] py-5 lg:py-20 px-0 lg:px-20 overflow-hidden mt-6 lg:mt-[100px]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-2 lg:gap-12">

            {/* Heading Section */}
            <div className="lg:w-1/4 flex flex-col justify-center px-[21px] lg:px-0">

                <span className="text-[#BF8F5F] font-sans text-[10px] lg:text-xs uppercase tracking-[0.3em] mb-1 lg:mb-4">
                    NEW ARRIVALS
                </span>

                <div className="flex items-center justify-between lg:block gap-3">
                    <h2 className="text-[#222222] font-serif text-[16px] lg:text-5xl leading-tight lg:mb-6">
                        Beauty At Its Finest
                    </h2>

                    {/* Mobile Explore More */}
                    <Link
                        href="/category?isNewArrival=true&isLuxe=false"
                        className="lg:hidden shrink-0 text-[#BF8F5F] text-[12px] font-medium"
                    >
                        Explore More
                    </Link>
                </div>

                {/* Desktop Description */}
                <p className="hidden lg:block text-gray-600 text-sm mb-8 leading-relaxed">
                    Discover the latest additions to Dwara Jewels.
                    Timeless elegance, exquisite craftsmanship, and
                    beautiful designs made for every occasion.
                </p>

                {/* Desktop Explore More */}
                <Link
                    href="/category?isNewArrival=true&isLuxe=false"
                    className="hidden lg:inline-block text-[#BF8F5F] font-bold border-b border-[#BF8F5F] pb-1 uppercase text-xs tracking-widest w-fit hover:text-black hover:border-black transition-colors"
                >
                    Explore More →
                </Link>
            </div>

            {/* Product Slider */}
            <div
                ref={sliderRef}
                className="
                    w-full lg:w-3/4 min-w-0
                    mt-5 lg:mt-0
                    flex lg:grid lg:grid-flow-col
                    lg:auto-cols-[calc((100%_-_72px)/4)]
                    gap-[17px] lg:gap-6
                    overflow-x-auto overflow-y-hidden
                    scroll-smooth
                    px-[21px] lg:px-0
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                "
            >
                {products.map((product) => {
                    const discount = getDiscountPercentage(product);

                    const finalPrice = Number(
                        product.price?.finalPrice
                    );

                    const comparePrice = Number(
                        product.price?.compareAtPrice
                    );

                    const currency =
                        product.price?.currency === 'USD'
                            ? '$'
                            : 'Rs. ';

                    const outOfStock = Array.isArray(product.dimensions)
                        ? !product.dimensions.some(
                              option => Number(option.stock) > 0
                          )
                        : product.totalStock != null &&
                          Number(product.totalStock) <= 0;

                    return (
                        <div
                            key={product._id}
                            className="group relative flex flex-col h-full shrink-0 w-[150px] lg:w-auto"
                        >
                            {/* Product Image */}
                            <div className="relative w-full aspect-square bg-[#FCF6F2] lg:bg-white mb-[10px] lg:mb-6 overflow-hidden rounded-none flex items-center justify-center">

                                {/* Discount / New Badge */}
                                {discount > 0 ? (
                                    <span className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-[#C19875] text-white text-[9px] lg:text-[10px] px-2 py-1 z-10 tracking-wider pointer-events-none">
                                        - {discount}%
                                    </span>
                                ) : product.isNewArrival && (
                                    <span className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-[#C19875] text-white text-[9px] lg:text-[10px] px-2 py-1 z-10 tracking-wider pointer-events-none">
                                        NEW
                                    </span>
                                )}

                                <Link
                                    href={`/product/${product._id}`}
                                    className="w-full h-full relative block"
                                >
                                    <Image
                                        src={
                                            product.thumbnail ||
                                            product.images?.[0] ||
                                            '/placeholder.webp'
                                        }
                                        alt={product.title || 'Dwara Jewels Product'}
                                        fill
                                        sizes="(max-width: 1023px) 150px, 25vw"
                                        className="object-cover p-0 transition-transform duration-500 group-hover:scale-105"
                                    />
                                </Link>

                                {/* Out of Stock Badge */}
                                {outOfStock && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-[#222222]/75 py-1.5 text-center pointer-events-none">
                                        <span className="text-white text-[9px] lg:text-[10px] tracking-wider">
                                            OUT OF STOCK
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="flex flex-col flex-grow min-w-0">

                                <Link
                                    href={`/product/${product._id}`}
                                    className="hover:text-[#C19875] transition-colors inline-block w-fit"
                                >
                                    <h3 className="text-[#222222] font-medium lg:font-bold text-[10px] lg:text-sm leading-[12px] lg:leading-snug mb-[5px] lg:mb-4 line-clamp-2">
                                        {product.title}

                                        {/* Desktop Metal Details */}
                                        {product.metal?.type && (
                                            <span className="hidden lg:block font-normal text-gray-500 text-xs mt-1">
                                                in {product.metal?.quality}{' '}
                                                {product.metal?.color}{' '}
                                                {product.metal?.type}
                                            </span>
                                        )}
                                    </h3>
                                </Link>

                                {/* Mobile Price + Wishlist Row */}
                                <div className="flex items-center justify-between gap-2 lg:block">

                                    {/* Pricing */}
                                    <div className="flex flex-wrap items-center gap-1 lg:gap-2 lg:mb-6">

                                        {Number.isFinite(comparePrice) &&
                                            Number.isFinite(finalPrice) &&
                                            comparePrice > finalPrice && (
                                                <span className="text-gray-400 font-normal line-through text-[9px] lg:text-sm">
                                                    {currency}
                                                    {comparePrice.toLocaleString('en-IN')}
                                                </span>
                                            )}

                                        <span className="text-[#222222] font-medium lg:font-bold text-[12px] lg:text-sm">
                                            {currency}
                                            {Number.isFinite(finalPrice)
                                                ? finalPrice.toLocaleString('en-IN')
                                                : ''}
                                        </span>
                                    </div>

                                    {/* Mobile Wishlist */}
                                    <button
                                        type="button"
                                        className="lg:hidden shrink-0 text-[#C19875] hover:text-[#222222] transition-colors"
                                        aria-label="Add to Wishlist"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Desktop Quick Actions */}
                                <div className="hidden lg:flex items-center gap-4 mt-auto text-[#C19875]">

                                    {/* Wishlist */}
                                    <button
                                        type="button"
                                        className="hover:text-[#222222] transition-colors"
                                        aria-label="Add to Wishlist"
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </button>

                                    {/* Cart */}
                                    <button
                                        type="button"
                                        className="hover:text-[#222222] transition-colors"
                                        aria-label="Add to Cart"
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                            <line x1="3" y1="6" x2="21" y2="6" />
                                            <path d="M16 10a4 4 0 0 1-8 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Desktop Slider Navigation */}
        <div className="hidden lg:flex justify-end gap-4 mt-12 max-w-7xl mx-auto">

            <button
                type="button"
                onClick={() => scrollProducts(-1)}
                className="w-10 h-10 border border-[#BF8F5F] rounded-full flex items-center justify-center text-[#BF8F5F] hover:bg-[#BF8F5F] hover:text-white transition-all"
                aria-label="Previous products"
            >
                ←
            </button>

            <button
                type="button"
                onClick={() => scrollProducts(1)}
                className="w-10 h-10 border border-[#BF8F5F] rounded-full flex items-center justify-center text-[#BF8F5F] hover:bg-[#BF8F5F] hover:text-white transition-all"
                aria-label="Next products"
            >
                →
            </button>
        </div>
    </section>
);

}