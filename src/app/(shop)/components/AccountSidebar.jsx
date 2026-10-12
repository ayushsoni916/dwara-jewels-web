'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../../context/AuthContext';

export default function AccountSidebar({ activeTab }) {

    const { user, loading } = useAuth();

    if (loading || !user) return null;

    const fullName =
        [user.firstName, user.lastName].filter(Boolean).join(' ') ||
        'Customer';


    // Replaced emojis with clean, thin-stroke SVGs matching your design system
    const menuItems = [
        {
            id: 'info',
            name: 'Account Information',
            href: '/account/info',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            )
        },
        {
            id: 'orders',
            name: 'Orders',
            href: '/account/orders',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8v13H3V8M1 3h22v5H1V3zm10 9h4"></path>
                </svg>
            )
        },
        {
            id: 'about',
            name: 'About Us',
            href: '/account/about',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
            )
        },
        {
            id: 'support',
            name: 'Customer Support',
            href: '/account/support',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
            )
        },
        {
            id: 'blog',
            name: 'Blog',
            href: '/account/blog',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
            )
        },
        {
            id: 'faq',
            name: 'FAQ',
            href: '/account/faq',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"></path>
                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
                </svg>
            )
        },
    ];

    return (
        <aside className="w-full lg:w-[300px] shrink-0 border-r border-gray-200 pr-0 lg:pr-8">

            {/* User Profile Header (Zero border radius as requested) */}
            <div className="flex items-center gap-5 mb-10">
                <div className="w-20 h-20 bg-[#FCF6F2] p-2 shrink-0 rounded-none">
                    <Image
                        src="/images/UserAvatar.webp"
                        alt="Rakesh Kumar"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full rounded-none"
                    />
                </div>
                <div>
                    <h2 className="font-serif text-2xl text-[#222222] leading-tight mb-1">
                        {fullName}
                    </h2>

                    <p className="text-gray-400 text-sm mb-3">
                        +91 {user.phone}
                    </p>

                    {activeTab === 'info' ? (
                        <button className="text-[#BF8F5F] text-xs font-bold flex items-center gap-2 hover:underline">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Update Picture
                        </button>
                    ) : (
                        <Link href="/account/info" className="text-[#BF8F5F] text-xs font-bold hover:underline">
                            View Profile
                        </Link>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-2 text-sm font-bold text-[#222222]">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            // Applying text-[#BF8F5F] to the active state automatically colors the SVG due to stroke="currentColor"
                            className={`flex items-center justify-between px-5 py-4 rounded-none transition-colors ${isActive
                                ? 'bg-[#FCF6F2] text-[#BF8F5F]'
                                : 'hover:bg-[#FCF6F2] hover:text-[#BF8F5F]'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="flex items-center justify-center">
                                    {item.icon}
                                </span>
                                {item.name}
                            </div>

                            {/* SVG Chevron Arrow matching your screenshot */}
                            {isActive && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            )}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    );
}