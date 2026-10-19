'use client';
import React from 'react';
import AccountSidebar from '../../components/AccountSidebar';

export default function CustomerSupportPage() {
    return (
        <main className="bg-white min-h-screen pb-16">
            
            {/* Top Breadcrumb Banner */}
            <div className="w-full bg-[#FCF6F2] py-8 lg:py-12 px-4 sm:px-8 lg:px-20 mb-10 lg:mb-16">
                <div className="max-w-[1440px] mx-auto flex gap-3 text-xs sm:text-[13px] font-medium">
                    <span className="text-gray-400">Home</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">Profile</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-[#BF8F5F] font-bold">Customer Support</span>
                </div>
            </div>

            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    
                    {/* Left Sidebar */}
                    <AccountSidebar activeTab="support" />

                    {/* Right Content: Customer Support */}
                    <div className="flex-1 lg:pl-4">
                        <h1 className="font-serif text-3xl text-[#222222] mb-10">
                            Customer Support
                        </h1>

                        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                            
                            {/* Left Column: General Queries */}
                            <div className="w-full lg:w-1/2 flex flex-col">
                                <h2 className="text-xl text-[#222222] mb-8">
                                    General Queries
                                </h2>
                                
                                <div className="flex flex-col gap-8">
                                    {/* Phone */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 border border-[#BF8F5F]/40 flex items-center justify-center shrink-0 text-[#BF8F5F]">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col justify-center pt-1">
                                            <p className="text-sm text-[#222222] mb-1">Phone No.</p>
                                            <p className="text-[#BF8F5F] font-bold text-[15px] tracking-wide">+91 6377584487</p>
                                        </div>
                                    </div>

                                    {/* Email Us */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 border border-[#BF8F5F]/40 flex items-center justify-center shrink-0 text-[#BF8F5F]">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                                <polyline points="22,6 12,13 2,6"></polyline>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col justify-center pt-1">
                                            <p className="text-sm text-[#222222] mb-1">Email Us:</p>
                                            <p className="text-[#BF8F5F] font-bold text-[15px]">info@dwarajewels.com</p>
                                        </div>
                                    </div>

                                    {/* Locate Us */}
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 border border-[#BF8F5F]/40 flex items-center justify-center shrink-0 text-[#BF8F5F]">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                        </div>
                                        <div className="flex flex-col justify-center pt-1">
                                            <p className="text-sm text-[#222222] mb-1">Locate Us:</p>
                                            <p className="text-[#BF8F5F] font-bold text-[15px] leading-relaxed max-w-[260px]">
                                                57A, Gayatri Nagar 2nd, Sanganer, Jaipur, 302029
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Form */}
                            <div className="w-full lg:w-1/2 flex flex-col hidden">
                                <h2 className="text-xl text-[#222222] mb-8">
                                    Fill the form below:
                                </h2>

                                <form className="flex flex-col gap-8 w-full max-w-md">
                                    
                                    {/* Enquiry Related To */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm text-[#222222]">Enquiry Related To:</label>
                                        <div className="relative">
                                            <select className="w-full bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none text-[#BF8F5F] appearance-none cursor-pointer rounded-none border-0">
                                                <option>Select</option>
                                                <option>Order Issue</option>
                                                <option>Product Query</option>
                                                <option>Other</option>
                                            </select>
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BF8F5F] pointer-events-none text-xs">▼</span>
                                        </div>
                                    </div>

                                    {/* If Other */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm text-[#222222]">If Other (Please Mention)</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter here" 
                                            className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-none border-0" 
                                        />
                                    </div>

                                    {/* Additional Message */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm text-[#222222]">Additional Message</label>
                                        <textarea 
                                            placeholder="Enter here" 
                                            className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-none border-0 min-h-[120px] resize-y"
                                        ></textarea>
                                    </div>

                                    {/* Submit Button & Note */}
                                    <div className="mt-2 flex flex-col gap-4">
                                        <button 
                                            type="button" 
                                            className="bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-widest py-4 px-12 hover:bg-black transition-colors rounded-none border-0 w-max"
                                        >
                                            Submit
                                        </button>
                                        <p className="text-xs text-gray-400 leading-relaxed max-w-xs mt-2">
                                            Note: After Submitting Our team will get you back to you via mail/phone no. in 2 working days
                                        </p>
                                    </div>

                                </form>
                            </div>

                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}