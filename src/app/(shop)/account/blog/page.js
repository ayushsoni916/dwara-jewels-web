'use client';
import React from 'react';
import Image from 'next/image';
import AccountSidebar from '../../components/AccountSidebar';

// Dummy Blog Data using your existing placeholder images
const blogPosts = [
    { 
        id: 1, 
        category: "Tips", 
        title: "How to Choose the Perfect Engagement Ring for Your Beloved One", 
        excerpt: "Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks.", 
        author: "Jane Thompson", 
        date: "May 10, 2023", 
        img: "/images/Earring.webp" 
    },
    { 
        id: 2, 
        category: "Tips", 
        title: "How to Choose the Perfect Engagement Ring for Your Beloved One", 
        excerpt: "Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks.", 
        author: "Jane Thompson", 
        date: "May 10, 2023", 
        img: "/images/Jhumkas.webp" 
    },
    { 
        id: 3, 
        category: "Tips", 
        title: "How to Choose the Perfect Engagement Ring for Your Beloved One", 
        excerpt: "Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks.", 
        author: "Jane Thompson", 
        date: "May 10, 2023", 
        img: "/images/Rings.webp" 
    },
    { 
        id: 4, 
        category: "Tips", 
        title: "How to Choose the Perfect Engagement Ring for Your Beloved One", 
        excerpt: "Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks.", 
        author: "Jane Thompson", 
        date: "May 10, 2023", 
        img: "/images/Nacklace.webp" 
    }
];

export default function BlogPage() {
    return (
        <main className="bg-white min-h-screen pb-16 lg:pb-24">
            
            {/* Top Breadcrumb Banner */}
            <div className="w-full bg-[#FCF6F2] py-8 lg:py-12 px-4 sm:px-8 lg:px-20 mb-10 lg:mb-16">
                <div className="max-w-[1440px] mx-auto flex gap-3 text-xs sm:text-[13px] font-medium">
                    <span className="text-gray-400">Home</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400">Profile</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-[#BF8F5F] font-bold">Blog</span>
                </div>
            </div>

            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                    
                    {/* Left Sidebar */}
                    <AccountSidebar activeTab="blog" />

                    {/* Right Content: Blog List */}
                    <div className="flex-1 lg:pl-4">
                        
                        {/* Page Header */}
                        <div className="mb-10 lg:mb-14 flex flex-col items-start border-b border-gray-100 pb-8 lg:pb-12">
                            <h1 className="font-serif text-3xl text-[#222222] mb-8">
                                Blog
                            </h1>
                            <span className="text-[#BF8F5F] text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] mb-3">
                                INSIGHTS
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-[#222222] mb-3">
                                Latest Updates
                            </h2>
                            <p className="text-gray-400 text-sm sm:text-[15px]">
                                Discover our handpicked selection of exquisite jewelry
                            </p>
                        </div>

                        {/* Blog Posts List */}
                        <div className="flex flex-col gap-10 lg:gap-12">
                            {blogPosts.map((post) => (
                                <article key={post.id} className="flex flex-col md:flex-row gap-6 md:gap-8 items-start group">
                                    
                                    {/* Image Container (Sharp edges) */}
                                    <div className="w-full md:w-[45%] lg:w-[40%] aspect-[3/2] bg-[#FCF6F2] shrink-0 relative rounded-none overflow-hidden cursor-pointer">
                                        <Image 
                                            src={post.img} 
                                            alt={post.title} 
                                            fill 
                                            className="object-cover rounded-none transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>

                                    {/* Post Content */}
                                    <div className="flex flex-col flex-grow py-2">
                                        <span className="text-[#BF8F5F] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] mb-3">
                                            {post.category}
                                        </span>
                                        <h3 className="font-bold text-[#222222] text-lg sm:text-[20px] leading-snug mb-3 cursor-pointer hover:text-[#BF8F5F] transition-colors pr-4">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-lg">
                                            {post.excerpt}
                                        </p>
                                        
                                        <div className="mt-auto flex items-center gap-2 text-xs text-gray-400 font-medium">
                                            <span className="text-[#999999]">{post.author}</span>
                                            <span className="text-gray-300">|</span>
                                            <span className="text-[#999999]">{post.date}</span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-16 lg:mt-20 flex flex-col items-center justify-center gap-4">
                            <div className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
                                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#BF8F5F] transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                
                                <button className="w-8 h-8 flex items-center justify-center bg-[#BF8F5F] text-white rounded-none">1</button>
                                <button className="w-8 h-8 flex items-center justify-center text-[#222222] hover:bg-[#FCF6F2] transition-colors rounded-none">2</button>
                                <button className="w-8 h-8 flex items-center justify-center text-[#222222] hover:bg-[#FCF6F2] transition-colors rounded-none">3</button>
                                
                                <span className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                                
                                <button className="w-8 h-8 flex items-center justify-center text-[#222222] hover:bg-[#FCF6F2] transition-colors rounded-none">10</button>
                                
                                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#BF8F5F] transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#BF8F5F] transition-colors">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                                </button>
                            </div>
                            <p className="text-gray-400 text-xs">Page 1 out of 10</p>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}