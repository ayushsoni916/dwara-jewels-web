'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { fetchCollectionApi } from '../../../api/collectionApi';
import { useRouter } from 'next/navigation';

const HOME_COLLECTION_IDS = [
    '6acd09cab2210243220ab665', // Bridal
    '6acd09bdb2210243220ab661', // Minimal
    '6acd09adb2210243220ab65d', // Diwali
];

export default function Hero() {
    const router = useRouter();
    const [banners, setBanners] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        const loadBanners = async () => {
            try {
                const data = await fetchCollectionApi();

                const collections = data?.collections || [];

                const selectedBanners = HOME_COLLECTION_IDS
                    .map(id =>
                        collections.find(item => item._id === id)
                    )
                    .filter(item => item?.image?.url);

                setBanners(selectedBanners);
            } catch (error) {
                console.error('Failed to load banners:', error);
            }
        };

        loadBanners();

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;

        const timer = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % banners.length);
        }, 7000);

        return () => clearInterval(timer);
    }, [banners]);

    return (
        <section className="w-full h-auto flex flex-col">
            {/* SEO Strategy: 
          1. 'priority' tells Google this is the most important image.
          2. 'width' and 'height' define the aspect ratio to stop layout shift.
          3. 'w-full h-auto' makes it responsive and full-screen.
      */}


            <div className="w-full">
                {/* Banner Image */}
                <div className="relative w-full aspect-[1983/793] overflow-hidden">

                    {banners.map((banner, index) => (
                        <button
                            key={banner._id}
                            type="button"
                            onClick={() =>
                                router.push(
                                    `/category?collectionId=${encodeURIComponent(banner._id)}`
                                )
                            }
                            aria-label={`Explore ${banner.name} collection`}
                            className={`absolute inset-0 w-full cursor-pointer transition-opacity duration-700 ${index === activeIndex
                                    ? 'opacity-100 z-10'
                                    : 'opacity-0 pointer-events-none'
                                }`}
                        >
                            <Image
                                src={banner.image.url}
                                alt={`${banner.name} - Dwara Jewels`}
                                fill
                                sizes="100vw"
                                priority={index === 0}
                                className="object-cover"
                            />
                        </button>
                    ))}

                </div>

                {/* Dots BELOW the banner */}
                {banners.length > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-4 mb-3">
                        {banners.map((banner, index) => (
                            <button
                                key={banner._id}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Show ${banner.name} banner`}
                                aria-current={activeIndex === index ? 'true' : undefined}
                                className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index
                                    ? 'w-6 bg-[#BF8F5F]'
                                    : 'w-2 border border-[#BF8F5F] bg-transparent'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>



            {/* Features Section */}
            {/* Mobile/Tablet: 2x2 Grid below the image. Desktop: Single row overlapping the image */}
            <div className="px-4 sm:px-8 lg:px-20 grid grid-cols-2 lg:flex lg:justify-between gap-y-6 gap-x-4 lg:gap-6 mt-6 lg:mt-14 relative z-10 pb-6 lg:pb-0">

                <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                    <Image
                        src="/icons/Certified.svg"
                        alt="Certified"
                        width={40}
                        height={40}
                        className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                    />
                    <div>
                        <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                            Certified
                        </h3>
                        <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                            Available certificates of authenticity
                        </p>
                    </div>
                </div>

                <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                    <Image
                        src="/icons/Secure.svg"
                        alt="Secure"
                        width={40}
                        height={40}
                        className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                    />
                    <div>
                        <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                            Secure
                        </h3>
                        <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                            Certified marketplace since 2017
                        </p>
                    </div>
                </div>

                <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                    <Image
                        src="/icons/Ship.svg"
                        alt="Shipping"
                        width={40}
                        height={40}
                        className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                    />
                    <div>
                        <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                            Shipping
                        </h3>
                        <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                            Free, fast, and reliable worldwide
                        </p>
                    </div>
                </div>

                <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                    <Image
                        src="/icons/Transparent.svg"
                        alt="Transparent"
                        width={40}
                        height={40}
                        className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                    />
                    <div>
                        <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                            Transparent
                        </h3>
                        <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                            Hassle-free return policy
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}