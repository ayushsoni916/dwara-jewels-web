'use client';
import React from 'react';
import Image from 'next/image';
import AccountSidebar from '../../components/AccountSidebar';

// Updated Dummy Order Data with requested images
const ordersData = [
    {
        id: "JYU78956782",
        name: "Anes Narrow Diamond Ring in 18k rose old",
        items: 1,
        status: "Delivered",
        date: "24th November 2025",
        price: "$699.00",
        img: "/images/Rings.webp"
    },
    {
        id: "JYU78956783",
        name: "Elsa Peretti Diamonds by the Yard",
        items: 1,
        status: "Delivered",
        date: "12th October 2025",
        price: "$1,299.00",
        img: "/images/Jhumkas.webp"
    },
    {
        id: "JYU78956784",
        name: "Tiffany HardWear ball dangle",
        items: 1,
        status: "Delivered",
        date: "5th September 2025",
        price: "$1,599.00",
        img: "/images/Earring.webp"
    },
    {
        id: "JYU78956785",
        name: "Tiffany Embrace band ring",
        items: 2,
        status: "Delivered",
        date: "1st August 2025",
        price: "$899.00",
        img: "/images/Nacklace.webp"
    }
];

export default function OrdersPage() {
    return (
        <main className="bg-white min-h-screen pb-16">
            
            {/* Top Breadcrumb Banner */}
            <div className="w-full bg-[#FCF6F2] py-8 lg:py-12 px-4 sm:px-8 lg:px-20 mb-10 lg:mb-16">
                <div className="max-w-[1440px] mx-auto flex gap-3 text-xs sm:text-[13px] font-medium">
                    <span className="text-gray-400">Home</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">Profile</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-[#BF8F5F] font-bold">Orders</span>
                </div>
            </div>

            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    
                    {/* Left Sidebar */}
                    <AccountSidebar activeTab="orders" />

                    {/* Right Content: Orders List */}
                    <div className="flex-1 lg:pl-4">
                        
                        {/* Header & Search */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-4">
                            <h1 className="font-serif text-3xl text-[#222222]">
                                Orders
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 border-b border-[#BF8F5F] pb-1 w-full sm:w-64">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BF8F5F" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <input type="text" placeholder="Search here" className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-[#222222]" />
                                </div>
                                <button className="text-[#BF8F5F] shrink-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                                </button>
                            </div>
                        </div>

                        {/* Order Cards */}
                        <div className="flex flex-col gap-8">
                            {ordersData.map((order, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100">
                                    
                                    {/* Product Image (Matched size and sharp edges) */}
                                    <div className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] bg-[#FCF6F2] rounded-none flex items-center justify-center shrink-0 p-4">
                                        <Image src={order.img} alt={order.name} width={100} height={100} className="object-contain w-full h-full" />
                                    </div>

                                    {/* Order Info (Typography exactly matching image_095ad7.png) */}
                                    <div className="flex flex-col flex-grow py-1">
                                        <p className="text-[#999999] text-[13px] mb-2">
                                            #{order.id}
                                        </p>
                                        <h3 className="font-bold text-[#222222] text-[16px] mb-3">
                                            {order.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-[13px] mb-4">
                                            <span className="text-[#999999]">{order.items} {order.items > 1 ? 'Items' : 'Item'}</span>
                                            <span className="text-[#BF8F5F] font-bold">{order.status}</span>
                                        </div>
                                        <p className="text-[13px] text-[#999999] mt-auto">
                                            Delivered on: <span className="text-[#222222] font-medium">{order.date}</span>
                                        </p>
                                    </div>

                                    {/* Price and Sharp Double-Arrow Button */}
                                    <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end shrink-0 py-1 min-w-[120px]">
                                        <p className="text-[#BF8F5F] font-bold text-[18px] sm:text-[20px]">
                                            {order.price}
                                        </p>
                                        <button className="w-10 h-10 sm:w-[46px] sm:h-[46px] bg-[#BF8F5F] text-white flex items-center justify-center rounded-none hover:bg-black transition-colors">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="13 17 18 12 13 7"></polyline>
                                                <polyline points="6 17 11 12 6 7"></polyline>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}