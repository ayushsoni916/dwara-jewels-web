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
        <section className=" horizontal-padding mt-40.5">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">

                {/* Left Side: Titles & Navigation */}
                <div className="w-full lg:w-1/3 flex flex-col justify-between h-full min-h-[300px]">
                    <div>
                        <span className="heading-tag">Testimonials</span>
                        <h2 className="heading-main ">Customer<br />Stories</h2>
                    </div>

                    <div className="mt-10 lg:mt-0 flex justify-between mb-[43px]">
                        <div>
                            <p className="title-main">{current.name}</p>
                            <p className="title-des">{current.location}</p>
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex gap-8 mt-6">
                            <button onClick={prevSlide} className="hover:opacity-50 transition-opacity">
                                <span className="text-xl">{"<"}</span>
                            </button>
                            <button onClick={nextSlide} className="hover:opacity-50 transition-opacity">
                                <span className="text-xl">{">"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: The Card */}
                <div className="relative w-full lg:w-2/3 border border-[#BF8F5F] py-[45px] px-[58px] rounded-tr-none rounded-br-none rounded-bl-none rounded-tl-[60px]">
                    <div className="flex flex-col md:flex-row items-center gap-10">

                        {/* Ring Image - Overlapping slightly */}
                        <div className="w-full md:w-1/3 flex justify-center">
                            <img
                                src={current.image}
                                alt="Jewelry"
                                className="h-[186px] object-contain drop-shadow-2xl"
                            />
                        </div>

                        {/* Story Content */}
                        <div className="w-full md:w-2/3 relative">
                            <img src={commas} alt="Commas" className="h-[45px]" />
                            <div className="relative z-10 mt-[26px]">
                                <p className="title-des text-gray-600 italic">
                                    {current.story}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Line on the right (as seen in Figma) */}
                    <div className="absolute top-1/2 right-0 w-35 h-px bg-[#BF8F5F] hidden xl:block translate-x-full"></div>
                </div>

            </div>
        </section>
    );
};

export default Testimonials;