import Image from 'next/image';
import Link from 'next/link';

export default function LuxeHero() {
    return (
        <section
            className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden"
        >
            {/* 1. Starry Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/images/Background.png"
                    alt="Luxury Starry Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
            </div>

            {/* 2. Bottom Centered Art Layer */}
            <div className="absolute inset-x-0 bottom-0 z-0 flex justify-center pointer-events-none">
                <Image
                    src="/images/LuxeMiddleBack.webp"
                    alt="Luxury Starry Jewellery"
                    width={733}
                    height={630}
                    className="object-contain"
                    priority
                />
            </div>

            {/* 3. Text Content (Centered Vertically) */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto flex-grow justify-center pt-32 pb-10">
                {/* Overline */}
                <span className="text-[#E5D3C4] font-sans font-semibold text-[12px] lg:text-[16px] leading-[30px] tracking-[0.83em] uppercase mb-4 ml-[0.83em]">
                    LUXE
                </span>

                {/* Title */}
                <h1 className="font-serif font-normal text-white text-[42px] sm:text-[56px] lg:text-[69px] leading-[1.2] lg:leading-[89px] tracking-normal mb-4">
                    Timeless Craft, Eternal Elegance
                </h1>

                {/* Subtitle */}
                <p className="text-[#E2E2E2] font-sans font-light text-[15px] lg:text-[19px] leading-[24px] lg:leading-[28px] tracking-[0.05em] mb-10 max-w-2xl">
                    Fine Gold & Silver Jewellery, designed to shine beyond generations
                </p>

                {/* Button */}
                <p className="text-[#D6B693] font-serif italic text-sm md:text-lg tracking-[0.15em]">
                    A Timeless Expression of Elegance
                </p>
            </div>

            {/* 4. Features Section (Corrected for Dark Theme) */}
            <div className="px-4 sm:px-8 lg:px-20 grid grid-cols-2 lg:flex lg:justify-between gap-y-6 gap-x-4 lg:gap-6 relative z-10 pb-12 lg:pb-16">

                {/* Certified */}
                <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                    <Image
                        src="/icons/Certified.svg"
                        alt="Certified"
                        width={40}
                        height={40}
                        className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0 brightness-0 invert opacity-90"
                    />
                    <div>
                        <h3 className="text-white font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                            Certified
                        </h3>
                        <p className="text-white/60 font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5">
                            Available certificates of authenticity
                        </p>
                    </div>
                </div>

                {/* Secure */}
                <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                    <Image
                        src="/icons/Secure.svg"
                        alt="Secure"
                        width={40}
                        height={40}
                        className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0 brightness-0 invert opacity-90"
                    />
                    <div>
                        <h3 className="text-white font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                            Secure
                        </h3>
                        <p className="text-white/60 font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5">
                            Certified marketplace since 2017
                        </p>
                    </div>
                </div>

                {/* Shipping */}
                <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                    <Image
                        src="/icons/Ship.svg"
                        alt="Shipping"
                        width={40}
                        height={40}
                        className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0 brightness-0 invert opacity-90"
                    />
                    <div>
                        <h3 className="text-white font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                            Shipping
                        </h3>
                        <p className="text-white/60 font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5">
                            Free, fast, and reliable worldwide
                        </p>
                    </div>
                </div>

                {/* Transparent */}
                <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                    <Image
                        src="/icons/Transparent.svg"
                        alt="Transparent"
                        width={40}
                        height={40}
                        className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0 brightness-0 invert opacity-90"
                    />
                    <div>
                        <h3 className="text-white font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                            Transparent
                        </h3>
                        <p className="text-white/60 font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5">
                            Hassle-free return policy
                        </p>
                    </div>
                </div>

            </div>

            {/* 5. Bottom Gradient Border Line */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#F2DFCE] to-transparent z-20"></div>

        </section>
    );
}