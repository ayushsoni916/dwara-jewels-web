'use client';
import React from 'react';
import Image from 'next/image';
import AccountSidebar from '../../components/AccountSidebar';

export default function AboutUsPage() {
    const flower = "/icons/Flower.svg";
    const img1 = "/images/ImgStory1.webp";
    const img2 = "/images/ImgStory2.webp";

    return (
        <main className="bg-white min-h-screen pb-16 lg:pb-24">
            
            {/* Top Breadcrumb Banner */}
            <div className="w-full bg-[#FCF6F2] py-8 lg:py-12 px-4 sm:px-8 lg:px-20 mb-10 lg:mb-16">
                <div className="max-w-[1440px] mx-auto flex gap-3 text-xs sm:text-[13px] font-medium">
                    <span className="text-gray-400">Home</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">Profile</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-[#BF8F5F] font-bold">About Us</span>
                </div>
            </div>

            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    
                    {/* Left Sidebar */}
                    <AccountSidebar activeTab="about" />

                    {/* Right Content: About Us Story */}
                    <div className="flex-1 lg:pl-4">
                        <h1 className="font-serif text-3xl text-[#222222] mb-10 lg:mb-12">
                            About Us
                        </h1>

                        <div className="flex flex-col gap-16 lg:gap-24">
                            
                            {/* Story Block 1 (Text Left, Image Right) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                                {/* Text Content */}
                                <div className="flex flex-col justify-center">
                                    <h2 className="text-[#BF8F5F] text-xs font-bold uppercase tracking-widest mb-4">
                                        OUR STORY
                                    </h2>
                                    <div className="flex items-start gap-4">
                                        <h3 className="font-serif text-3xl sm:text-4xl lg:text-[40px] leading-tight text-[#222222]">
                                            Tradition Cared For<br />
                                            Since <span className="text-[40px] lg:text-[48px] font-medium">2016</span>
                                        </h3>
                                        <img 
                                            src={flower} 
                                            alt="Flower" 
                                            className="w-10 h-10 lg:w-14 lg:h-14 object-contain mt-2 lg:mt-4 hidden sm:block" 
                                        />
                                    </div>
                                    <p className="font-bold text-[#222222] text-sm sm:text-[15px] mt-8">
                                        Lorem Ipsum is a simple dummy text of the
                                    </p>
                                    <p className="text-gray-500 text-sm leading-relaxed mt-4">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged
                                    </p>
                                    <p className="text-gray-500 text-sm leading-relaxed mt-4">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                    </p>
                                </div>
                                
                                {/* Image Content */}
                                <div className="bg-[#FCF6F2] p-5 sm:p-6 lg:p-8 rounded-none">
                                    <div className="relative w-full aspect-[4/5] rounded-none overflow-hidden">
                                        <Image 
                                            src={img1} 
                                            alt="Our Story 2016" 
                                            fill 
                                            className="object-cover rounded-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Story Block 2 (Image Left, Text Right) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                                {/* Image Content - Reordered for Mobile so text stays on top if preferred, or maintain visual flow */}
                                <div className="order-2 lg:order-1 bg-[#FCF6F2] p-5 sm:p-6 lg:p-8 rounded-none">
                                    <div className="relative w-full aspect-[4/5] rounded-none overflow-hidden">
                                        <Image 
                                            src={img2} 
                                            alt="Our Story Process" 
                                            fill 
                                            className="object-cover rounded-none"
                                        />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="order-1 lg:order-2 flex flex-col justify-center">
                                    <h2 className="text-[#BF8F5F] text-xs font-bold uppercase tracking-widest mb-4">
                                        OUR STORY
                                    </h2>
                                    <div className="flex items-start gap-4">
                                        <h3 className="font-serif text-3xl sm:text-4xl lg:text-[40px] leading-tight text-[#222222]">
                                            Tradition Cared For<br />
                                            Since <span className="text-[40px] lg:text-[48px] font-medium">2016</span>
                                        </h3>
                                        <img 
                                            src={flower} 
                                            alt="Flower" 
                                            className="w-10 h-10 lg:w-14 lg:h-14 object-contain mt-2 lg:mt-4 hidden sm:block" 
                                        />
                                    </div>
                                    <p className="font-bold text-[#222222] text-sm sm:text-[15px] mt-8">
                                        Lorem Ipsum is a simple dummy text of the
                                    </p>
                                    <p className="text-gray-500 text-sm leading-relaxed mt-4">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged
                                    </p>
                                    <p className="text-gray-500 text-sm leading-relaxed mt-4">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}