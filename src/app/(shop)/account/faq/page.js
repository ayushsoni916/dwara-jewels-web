'use client';
import React from 'react';
import AccountSidebar from '../../components/AccountSidebar';
import FAQs from '../../components/Home/FAQs';
// Import your existing FaqInsight component (adjust the path if needed)

export default function FAQPage() {
    return (
        <main className="bg-white min-h-screen pb-16 lg:pb-24">
            
            {/* Top Breadcrumb Banner */}
            <div className="w-full bg-[#FCF6F2] py-8 lg:py-12 px-4 sm:px-8 lg:px-20 mb-10 lg:mb-16">
                <div className="max-w-[1440px] mx-auto flex gap-3 text-xs sm:text-[13px] font-medium">
                    <span className="text-gray-400">Home</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">Profile</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-[#BF8F5F] font-bold">FAQ</span>
                </div>
            </div>

            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    
                    {/* Left Sidebar */}
                    <AccountSidebar activeTab="faq" />

                    {/* Right Content: Existing FAQ Component */}
                    <div className="flex-1 lg:pl-4">
                        <h1 className="font-serif text-3xl text-[#222222] mb-10">
                            FAQ
                        </h1>

                        {/* Rendering your existing component here */}
                        <div className="w-full">
                            <FAQs />
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}