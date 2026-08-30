'use client';
import React from 'react';
import AccountSidebar from '../../components/AccountSidebar';

export default function AccountInformation() {
    return (
        <main className="bg-white min-h-screen pb-16">
            
            {/* Top Breadcrumb Banner */}
            <div className="w-full bg-[#FCF6F2] py-8 lg:py-12 px-4 sm:px-8 lg:px-20 mb-10 lg:mb-16">
                <div className="max-w-[1440px] mx-auto flex gap-3 text-xs sm:text-sm font-medium">
                    <span className="text-gray-400">Home</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">Profile</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-[#BF8F5F] font-bold">Account Information</span>
                </div>
            </div>

            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    
                    {/* Left Sidebar */}
                    <AccountSidebar activeTab="info" />

                    {/* Right Content: Form */}
                    <div className="flex-1 lg:pl-4">
                        <h1 className="font-serif text-3xl text-[#222222] mb-10">
                            Account Information
                        </h1>

                        <form className="flex flex-col gap-8 max-w-3xl">
                            {/* Row 1 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm text-[#222222]">First Name</label>
                                    <input type="text" placeholder="Address Line 1" className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-none border-0" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm text-[#222222]">Last Name</label>
                                    <input type="text" placeholder="Address Line 2" className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-none border-0" />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm text-[#222222]">Phone No.</label>
                                    <input type="tel" placeholder="Area" className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-none border-0" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm text-[#222222]">Email</label>
                                    <input type="email" placeholder="Landmark" className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-none border-0" />
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm text-[#222222]">Gender</label>
                                    <div className="relative">
                                        <select className="w-full bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none text-[#BF8F5F] appearance-none cursor-pointer rounded-none border-0">
                                            <option>Select</option>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BF8F5F] pointer-events-none text-xs">▼</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm text-[#222222]">DOB (dd/mm/yyyy)</label>
                                    <input type="text" placeholder="Pincode" className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-none border-0" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm text-[#222222]">Nationality</label>
                                    <div className="relative">
                                        <select className="w-full bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none text-[#BF8F5F] appearance-none cursor-pointer rounded-none border-0">
                                            <option>Select</option>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BF8F5F] pointer-events-none text-xs">▼</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6">
                                <button type="button" className="bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-widest py-4 px-12 hover:bg-black transition-colors rounded-none border-0">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </section>
        </main>
    );
}