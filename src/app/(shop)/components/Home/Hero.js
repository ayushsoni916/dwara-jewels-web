import Image from 'next/image';

export default function Hero() {
    return (
        <section className="w-full h-auto flex flex-col">
            {/* SEO Strategy: 
          1. 'priority' tells Google this is the most important image.
          2. 'width' and 'height' define the aspect ratio to stop layout shift.
          3. 'w-full h-auto' makes it responsive and full-screen.
      */}
            <div className="relative w-full">
                <Image
                    src="/images/HeroMain-v3.webp" // Use WebP for better SEO scores
                    alt="Dwara Jewels Shining Winter 2024 - Premium Jewelry Collection"
                    width={1920} // Use the actual width of your original file
                    height={1080} // Use the actual height of your original file
                    className="w-full h-auto object-cover"
                    priority={true} // High-priority for LCP ranking
                />
            </div>
            
            {/* Features Section */}
            {/* Mobile/Tablet: 2x2 Grid below the image. Desktop: Single row overlapping the image */}
            <div className="px-4 sm:px-8 lg:px-20 grid grid-cols-2 lg:flex lg:justify-between gap-y-6 gap-x-4 lg:gap-6 mt-6 lg:-mt-15 relative z-10 pb-6 lg:pb-0">
                
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