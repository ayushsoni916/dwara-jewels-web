
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const testimonialsData = [
    {
        id: 1,
        name: 'Ayush Soni',
        location: 'Jaipur, India',
        image: '/images/Ring.webp',
        story:
            'The craftsmanship is absolutely breathtaking. I wore these for my wedding reception, and the weight and finish felt so luxurious. Truly a piece of art.',
    },
    {
        id: 2,
        name: 'Priya Ved',
        location: 'Mumbai',
        image: '/images/Bracelet.webp',
        story:
            'I was hesitant about buying jewelry online, but the certification and the packaging gave me complete peace of mind. It looks even better in person.',
    },
    {
        id: 3,
        name: 'Michael Ross',
        location: 'Jaipur',
        image: '/images/Nack.webp',
        story:
            'Bought this as an anniversary gift. The diamond clarity exceeded my expectations, and the minimalist design is perfect for daily wear. Exceptional service!',
    },
    {
        id: 4,
        name: 'Sarah Jenkins',
        location: 'London',
        image: '/images/Earring.webp',
        story:
            'Simple, sleek, and high-quality. It has become my go-to piece for layering. The shipping was incredibly fast considering it was international!',
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const current = testimonialsData[currentIndex];

    const nextSlide = () => {
        setCurrentIndex(prev =>
            Math.min(prev + 1, testimonialsData.length - 1)
        );
    };

    const prevSlide = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    return (
        <section className="horizontal-padding mt-10 md:mt-24 lg:mt-[162px] overflow-hidden">

            {/* Mobile Heading */}
            <div className="lg:hidden mb-6">
                <span className="text-[#BF8F5F] text-[10px] font-semibold uppercase tracking-widest">
                    TESTIMONIALS
                </span>

                <h2 className="font-serif text-[#222222] text-[16px] sm:text-2xl mt-1">
                    Customer Stories
                </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 lg:gap-20">

                {/* Desktop Left Heading */}
                <div className="hidden lg:flex lg:w-1/3 flex-col justify-between lg:min-h-[300px]">

                    <div>
                        <span className="heading-tag">
                            TESTIMONIALS
                        </span>

                        <h2 className="heading-main mt-2">
                            Customer
                            <br />
                            Stories
                        </h2>
                    </div>

                    {/* Desktop Name + Navigation */}
                    <div className="flex items-end justify-between mb-[43px]">

                        <div>
                            <p className="title-main font-bold">
                                {current.name}
                            </p>

                            <p className="title-des text-sm opacity-70">
                                {current.location}
                            </p>
                        </div>

                        <div className="flex gap-4 md:gap-8 pb-1">

                            <button
                                type="button"
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                aria-label="Previous testimonial"
                                className="p-2 hover:text-[#BF8F5F] transition-colors disabled:opacity-30"
                            >
                                <span className="text-2xl leading-none">
                                    {'<'}
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={nextSlide}
                                disabled={
                                    currentIndex ===
                                    testimonialsData.length - 1
                                }
                                aria-label="Next testimonial"
                                className="p-2 hover:text-[#BF8F5F] transition-colors disabled:opacity-30"
                            >
                                <span className="text-2xl leading-none">
                                    {'>'}
                                </span>
                            </button>

                        </div>
                    </div>
                </div>

                {/* Testimonial Content */}
                <div className="w-full lg:w-2/3 min-w-0">

                    {/* Testimonial Card */}
                    <div
                        className="
                            relative
                            border border-[#BF8F5F]
                            bg-white
                            rounded-tl-[54px] lg:rounded-tl-[60px]
                            px-3 py-6
                            sm:px-6 sm:py-8
                            lg:py-[45px] lg:px-[58px]
                            min-h-[141px]
                        "
                    >
                        <div className="flex flex-row items-center gap-3 sm:gap-6 lg:gap-10">

                            {/* Product Image */}
                            <div className="relative w-[100px] h-[110px] sm:w-[145px] sm:h-[155px] lg:w-[186px] lg:h-[186px] shrink-0">

                                <Image
                                    src={current.image}
                                    alt={`Jewellery featured in ${current.name}'s review`}
                                    fill
                                    sizes="(max-width: 640px) 100px, (max-width: 1024px) 145px, 186px"
                                    className="object-contain"
                                />
                            </div>

                            {/* Review Content */}
                            <div className="flex-1 min-w-0 flex flex-col items-start">

                                <Image
                                    src="/icons/Commas.svg"
                                    alt=""
                                    width={40}
                                    height={40}
                                    className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 object-contain"
                                />

                                <p
                                    className="
                                        text-[#676767]
                                        text-[9px] leading-[16px]
                                        sm:text-xs sm:leading-5
                                        lg:text-sm lg:leading-relaxed
                                        mt-3 lg:mt-6
                                    "
                                >
                                    {current.story}
                                </p>

                            </div>
                        </div>

                        {/* Desktop Decorative Line */}
                        <div className="absolute top-1/2 right-0 w-35 h-px bg-[#BF8F5F] hidden xl:block translate-x-full" />

                    </div>

                    {/* Mobile Footer - Name + Navigation */}
                    <div className="lg:hidden flex items-end justify-between mt-4 px-2">

                        <div>
                            <p className="text-[#222222] text-[12px] font-bold">
                                {current.name}
                            </p>

                            <p className="text-[#222222]/50 text-[9px] mt-1">
                                {current.location}
                            </p>
                        </div>

                        <div className="flex items-center gap-6">

                            <button
                                type="button"
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                aria-label="Previous testimonial"
                                className="text-[#BF8F5F] disabled:opacity-30 p-2"
                            >
                                <span className="text-xl leading-none">
                                    ←
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={nextSlide}
                                disabled={
                                    currentIndex ===
                                    testimonialsData.length - 1
                                }
                                aria-label="Next testimonial"
                                className="text-[#BF8F5F] disabled:opacity-30 p-2"
                            >
                                <span className="text-xl leading-none">
                                    →
                                </span>
                            </button>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
