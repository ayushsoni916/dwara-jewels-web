'use client';
import React, { useState } from 'react';

const testimonialsData = [
    {
        id: 1,
        name: "Mateusz Madura",
        location: "Poland",
        image: "/images/Jhumkas.webp", // Replace with your ring image
        story: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        secondaryStory: "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
    {
        id: 2,
        name: "Ananya Sharma",
        location: "India",
        image: "/images/Rings.webp",
        story: "The craftsmanship at Dwara Jewels is unparalleled. I ordered a custom engagement ring and the attention to detail was beyond my expectations. It's a piece I will cherish forever.",
        secondaryStory: "Their customer service team was helpful throughout the entire design process, ensuring every diamond was perfectly placed."
    }
];

const Testimonials = () => {
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
        <section className="horizontal-padding mt-16 md:mt-24 lg:mt-[162px] overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-10 lg:gap-20">

                {/* Left Side: Titles & Navigation */}
                <div className="w-full lg:w-1/3 flex flex-col justify-between h-auto lg:h-full lg:min-h-[300px]">
                    <div className="text-center lg:text-left mb-8 lg:mb-0">
                        <span className="heading-tag">Testimonials</span>
                        <h2 className="heading-main mt-2">Customer<br className="hidden lg:block"/>Stories</h2>
                    </div>

                    <div className="flex items-end justify-between lg:mb-[43px]">
                        <div className="text-left">
                            <p className="title-main font-bold">{current.name}</p>
                            <p className="title-des text-sm md:text-base opacity-70">{current.location}</p>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex gap-4 md:gap-8 pb-1">
                            <button 
                                onClick={prevSlide} 
                                className="p-2 hover:text-[#BF8F5F] transition-colors flex items-center justify-center"
                                aria-label="Previous Testimonial"
                            >
                                <span className="text-xl md:text-2xl leading-none">{"<"}</span>
                            </button>
                            <button 
                                onClick={nextSlide} 
                                className="p-2 hover:text-[#BF8F5F] transition-colors flex items-center justify-center"
                                aria-label="Next Testimonial"
                            >
                                <span className="text-xl md:text-2xl leading-none">{">"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: The Card */}
                <div className="relative w-full lg:w-2/3 border border-[#BF8F5F] py-8 px-6 md:py-10 md:px-12 lg:py-[45px] lg:px-[58px] rounded-tl-[40px] md:rounded-tl-[60px]">
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
                                className="h-8 md:h-10 lg:h-[45px] object-contain" 
                            />
                            <div className="relative z-10 mt-4 lg:mt-[26px]">
                                <p className="title-des text-gray-600 italic text-sm sm:text-base">
                                    {current.story}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Line on the right (hidden on smaller screens to prevent horizontal scroll) */}
                    <div className="absolute top-1/2 right-0 w-35 h-px bg-[#BF8F5F] hidden xl:block translate-x-full"></div>
                </div>

            </div>
        </section>
    );
};

export default Testimonials;