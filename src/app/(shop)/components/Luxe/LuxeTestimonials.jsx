'use client';
import React, { useState } from 'react';
import Image from 'next/image';


const testimonialsData = [
    {
        id: 1,
        name: "Ayush",
        location: "Jaipur",
        image: "/images/Jhumkas.webp",
        story: "I absolutely love the elegant design and beautiful detailing of the jewellery. The finish looks premium, and the piece adds just the right touch of sophistication to both traditional and modern outfits. A lovely addition to any jewellery collection.",
    },
    {
        id: 2,
        name: "Anshika",
        location: "Jaipur",
        image: "/images/Rings.webp",
        story: "The ring has such a timeless and graceful design. I especially love how delicate yet eye-catching it looks. The craftsmanship and overall presentation make it feel special, whether styled for everyday elegance or a memorable occasion.",
    },
];


const LuxeTestimonials = () => {
    const commas = "/icons/Commas.svg";
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    };

    const current = testimonialsData[currentIndex];

    return (
        <section className="relative w-full horizontal-padding mt-16 md:mt-24 lg:mt-[162px] overflow-hidden pb-16 lg:pb-24">
            
            {/* 1. Left Glow Background Layer */}
            <div className="absolute inset-y-0 left-0 w-full md:w-[60%] z-0 pointer-events-none opacity-60 mix-blend-screen">
                <Image 
                    src="/images/LeftGlow.webp" 
                    alt="Background Glow" 
                    fill 
                    className="object-cover object-left"
                />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center gap-10 lg:gap-20">

                {/* Left Side: Titles & Navigation */}
                <div className="w-full lg:w-1/3 flex flex-col justify-between h-auto lg:h-full lg:min-h-[300px]">
                    <div className="text-center lg:text-left mb-8 lg:mb-0">
                        {/* Overridden text color for dark mode */}
                        <span className="heading-tag text-[#D6B693] uppercase">Testimonials</span>
                        <h2 className="heading-main text-white mt-2">Customer<br className="hidden lg:block"/>Stories</h2>
                    </div>

                    <div className="flex items-end justify-between lg:mb-[43px]">
                        <div className="text-left">
                            <p className="title-main text-white font-bold">{current.name}</p>
                            <p className="title-des text-white/70 text-sm md:text-base opacity-100">{current.location}</p>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex gap-4 md:gap-8 pb-1">
                            <button 
                                onClick={prevSlide} 
                                className="p-2 text-white/50 hover:text-[#D6B693] transition-colors flex items-center justify-center"
                                aria-label="Previous Testimonial"
                            >
                                <span className="text-xl md:text-2xl leading-none">{"<"}</span>
                            </button>
                            <button 
                                onClick={nextSlide} 
                                className="p-2 text-white/50 hover:text-[#D6B693] transition-colors flex items-center justify-center"
                                aria-label="Next Testimonial"
                            >
                                <span className="text-xl md:text-2xl leading-none">{">"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: The Card */}
                {/* Replaced #BF8F5F with #D6B693 (Luxe Gold) and added slight opacity to border */}
                <div className="relative w-full lg:w-2/3 border border-[#D6B693]/40 py-8 px-6 md:py-10 md:px-12 lg:py-[45px] lg:px-[58px] rounded-tl-[40px] md:rounded-tl-[60px]">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">

                        {/* Ring Image */}
                        <div className="w-full md:w-1/3 flex justify-center shrink-0">
                            <img
                                src={current.image}
                                alt="Jewelry"
                                className="h-32 sm:h-40 md:h-[186px] object-contain drop-shadow-2xl"
                            />
                        </div>

                        {/* Story Content */}
                        <div className="w-full md:w-2/3 relative flex flex-col items-center md:items-start text-center md:text-left">
                            <img 
                                src={commas} 
                                alt="Commas" 
                                // Added brightness-0 invert to make the black SVG white/gold for dark theme
                                className="h-8 md:h-10 lg:h-[45px] object-contain brightness-0 invert opacity-80" 
                            />
                            <div className="relative z-10 mt-4 lg:mt-[26px]">
                                {/* Replaced text-gray-600 with text-white/70 */}
                                <p className="title-des text-white/70 font-light text-sm sm:text-base opacity-100">
                                    {current.story}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Line on the right */}
                    <div className="absolute top-1/2 right-0 w-35 h-px bg-[#D6B693]/40 hidden xl:block translate-x-full"></div>
                </div>

            </div>

            {/* Bottom Gradient Border Line */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#F2DFCE] to-transparent z-20"></div>

        </section>
    );
};

export default LuxeTestimonials;