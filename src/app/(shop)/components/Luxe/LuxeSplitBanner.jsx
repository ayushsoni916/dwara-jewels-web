import Image from 'next/image';
import Link from 'next/link';

export default function LuxeSplitBanner({
    title = "The Art of Timeless Elegance",
    description = "Discover the beauty of exquisite craftsmanship, where every detail reflects sophistication, grace, and timeless style.",
    imagePosition = 'left',
    backImage = '/images/Ring1.webp',
    frontImage = '/images/Ring2.webp'
}) {
    const isImageRight = imagePosition === 'right';

    return (
        <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-transparent">

            {/* 1. Starry Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen">
                <Image
                    src="/images/Background.png"
                    alt="Luxury Starry Background"
                    fill
                    className="object-cover"
                />
            </div>

            {/* 2. Watermark Logo */}
            <div className={`absolute bottom-0 z-0 pointer-events-none translate-y-[30%] ${isImageRight ? 'left-0 -translate-x-[30%]' : 'right-0 translate-x-[30%]'
                }`}>
                <div className="relative w-[400px] h-[400px] lg:w-[700px] lg:h-[700px]">
                    <Image
                        src="/images/LuxeMiddleBack.webp"
                        alt="Dwara Jewels Luxe Motif"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>

            {/* 3. Main Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">

                {/* Overlapping Images Container */}
                <div className={`relative w-full aspect-square sm:aspect-[4/3] flex items-center justify-center 
                    ${isImageRight ? 'order-2 lg:order-2' : 'order-1 lg:order-1'}`}
                >
                    {/* Back/Top Image */}
                    <div className={`absolute top-0 w-[65%] sm:w-[60%] aspect-[4/3] bg-gradient-to-b from-[#D6B693] to-transparent p-[0.5px] z-10
                        ${isImageRight ? 'right-0' : 'left-0'}`}
                    >
                        <div className="relative w-full h-full bg-[#0C0E17] overflow-hidden">
                            <Image
                                src={backImage}
                                alt={`${title} Detail`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>

                    {/* Front/Bottom Image */}
                    <div className={`absolute bottom-0 w-[75%] sm:w-[70%] aspect-[4/3] bg-gradient-to-b from-[#D6B693] to-transparent p-[0.5px] z-20 shadow-2xl
                        ${isImageRight ? 'left-0' : 'right-0'}`}
                    >
                        <div className="relative w-full h-full bg-[#0C0E17] overflow-hidden">
                            <Image
                                src={frontImage}
                                alt={`${title} Showcase`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Text Content Container */}
                <div className={`flex flex-col items-start 
                    ${isImageRight ? 'order-1 lg:order-1 lg:pr-12' : 'order-2 lg:order-2 lg:pl-12'}`}
                >
                    <span className="text-[#D6B693] font-sans font-semibold text-[13px] lg:text-[14px] leading-[30px] tracking-[0.3em] uppercase mb-4">
                        THE DWARA LUXE EXPERIENCE
                    </span>

                    <h2 className="font-serif font-normal text-white text-[38px] sm:text-[44px] lg:text-[52px] leading-[1.2] mb-6">
                        {title}
                    </h2>

                    <p className="text-white/70 font-sans font-light text-[15px] lg:text-[16px] leading-[26px] tracking-[0.02em] mb-10 max-w-md">
                        {description}
                    </p>

                    <div className="flex items-center gap-4">
                        <span className="h-px w-10 bg-[#D6B693]" />

                        <p className="font-serif italic text-[#D6B693] text-base lg:text-lg tracking-wide">
                            Crafted to Be Cherished Forever
                        </p>
                    </div>
                </div>

            </div>

            {/* 4. Bottom Gradient Border Line */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#F2DFCE] to-transparent z-20"></div>

        </section>
    );
}