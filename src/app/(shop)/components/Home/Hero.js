import Image from 'next/image';

export default function Hero() {
    return (
        <section className="w-full h-auto">
            {/* SEO Strategy: 
          1. 'priority' tells Google this is the most important image.
          2. 'width' and 'height' define the aspect ratio to stop layout shift.
          3. 'w-full h-auto' makes it responsive and full-screen.
      */}
            <Image
                src="/images/HeroMain.webp" // Use WebP for better SEO scores
                alt="Dwara Jewels Shining Winter 2024 - Premium Jewelry Collection"
                width={1920} // Use the actual width of your original file
                height={1080} // Use the actual height of your original file
                className="w-full h-auto object-cover"
                priority={true} // High-priority for LCP ranking
            />
            <div className='px-20 flex justify-between -mt-15'>
                <div className='gap-6 flex'>
                    <Image
                        src="/icons/Certified.svg"
                        alt="Certified"
                        width={40} // Matches your Figma icon size
                        height={40}
                        className="object-contain"
                    />
                    <div>
                        <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-6">Certified</h3>
                        <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-5 opacity-50">Available certificates of authenticity</p>
                    </div>
                </div>
                <div className='gap-6 flex'>
                    <Image
                        src="/icons/Secure.svg"
                        alt="Secure"
                        width={40} // Matches your Figma icon size
                        height={40}
                        className="object-contain"
                    />
                    <div>
                        <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-6">Secure</h3>
                        <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-5 opacity-50">Certified marketplace since 2017</p>
                    </div>
                </div>
                <div className='gap-6 flex'>
                    <Image
                        src="/icons/Ship.svg"
                        alt="Shipping"
                        width={40} // Matches your Figma icon size
                        height={40}
                        className="object-contain"
                    />
                    <div>
                        <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-6">Shipping</h3>
                        <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-5 opacity-50">Free, fast, and reliable worldwide</p>
                    </div>
                </div>
                <div className='gap-6 flex'>
                    <Image
                        src="/icons/Transparent.svg"
                        alt="Transparent"
                        width={40} // Matches your Figma icon size
                        height={40}
                        className="object-contain"
                    />
                    <div>
                        <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-6">Transparent</h3>
                        <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-5 opacity-50">Hassle-free return policy</p>
                    </div>
                </div>
            </div>
        </section>
    );
}