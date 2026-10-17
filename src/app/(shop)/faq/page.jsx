
'use client';

import { useState } from 'react';
import Link from 'next/link';

// Adjust this path to your existing FAQs.jsx location
import { faqData } from '../components/Home/FAQs';

const faqCategories = [
    {
        title: 'Jewellery & Care',
        description:
            'Learn about our materials, authenticity, jewellery care and warranty.',
    },
    {
        title: 'Orders, Shipping & Returns',
        description:
            'Find information about delivery, exchanges, sizing and gifting.',
    },
];

export default function FAQPage() {
    const [openId, setOpenId] = useState(null);

    const toggleFAQ = (id) => {
        setOpenId((previous) => previous === id ? null : id);
    };

    return (
        <main className="bg-white min-h-screen">

            {/* Page Header */}
            <section className="bg-[#FCF6F2] px-5 sm:px-10 lg:px-20 py-12 sm:py-16 lg:py-24">

                <div className="max-w-7xl mx-auto">

                    {/* Breadcrumb */}
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center gap-2 text-xs sm:text-sm mb-8"
                    >
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-[#BF8F5F] transition-colors"
                        >
                            Home
                        </Link>

                        <span className="text-gray-400">/</span>

                        <span className="text-[#BF8F5F]">
                            FAQs
                        </span>
                    </nav>

                    {/* Heading */}
                    <div className="max-w-3xl">

                        <p className="heading-tag text-[#BF8F5F] uppercase mb-3">
                            HERE TO HELP
                        </p>

                        <h1 className="heading-main text-3xl sm:text-4xl lg:text-5xl leading-tight">
                            Frequently Asked Questions
                        </h1>

                        <p className="heading-des text-gray-600 text-sm sm:text-base mt-5 leading-relaxed">
                            Everything you need to know about Dwara Jewels.
                            From our 925 sterling silver jewellery and
                            craftsmanship to shipping, returns, and care,
                            find your answers here.
                        </p>

                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="px-5 sm:px-10 lg:px-20 py-12 sm:py-16 lg:py-24">

                <div className="max-w-5xl mx-auto">

                    {faqCategories.map((category, categoryIndex) => {

                        const categoryFAQs = faqData.filter(
                            (item) => item.category === category.title
                        );

                        return (
                            <div
                                key={category.title}
                                className={
                                    categoryIndex > 0
                                        ? 'mt-14 sm:mt-20'
                                        : ''
                                }
                            >

                                {/* Category Heading */}
                                <div className="mb-8 sm:mb-10">

                                    <span className="text-[#BF8F5F] text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase">
                                        {String(categoryIndex + 1).padStart(2, '0')}
                                        {' / '}
                                        FAQ
                                    </span>

                                    <h2 className="font-serif text-[#222222] text-2xl sm:text-3xl lg:text-4xl mt-3">
                                        {category.title}
                                    </h2>

                                    <p className="text-gray-500 text-sm sm:text-base mt-3 leading-relaxed">
                                        {category.description}
                                    </p>

                                    <div className="w-full h-px bg-[#BF8F5F]/30 mt-6" />
                                </div>

                                {/* Accordion */}
                                <div className="flex flex-col gap-3 sm:gap-4">

                                    {categoryFAQs.map((item) => {

                                        const isOpen = openId === item.id;

                                        return (
                                            <div
                                                key={item.id}
                                                className={`
                                                    overflow-hidden
                                                    transition-all duration-300
                                                    rounded-lg sm:rounded-none
                                                    ${
                                                        isOpen
                                                            ? 'bg-[#FCF6F2] p-4 sm:p-6 lg:p-8'
                                                            : 'bg-white px-4 py-4 sm:px-6 sm:py-5 lg:px-8'
                                                    }
                                                `}
                                            >

                                                {/* Question Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => toggleFAQ(item.id)}
                                                    aria-expanded={isOpen}
                                                    aria-controls={`faq-answer-${item.id}`}
                                                    className="flex items-start sm:items-center gap-4 sm:gap-6 w-full text-left"
                                                >

                                                    {/* Plus / Minus */}
                                                    <span
                                                        className="text-[#B58E58] text-xl sm:text-2xl font-light w-5 sm:w-6 shrink-0 text-center leading-tight"
                                                        aria-hidden="true"
                                                    >
                                                        {isOpen ? '−' : '+'}
                                                    </span>

                                                    {/* Question */}
                                                    <span className="title-main text-sm sm:text-base lg:text-lg leading-relaxed text-[#222222] flex-1">
                                                        {item.question}
                                                    </span>

                                                </button>

                                                {/* Answer */}
                                                <div
                                                    id={`faq-answer-${item.id}`}
                                                    aria-hidden={!isOpen}
                                                    className={`
                                                        grid transition-all duration-300 ease-in-out
                                                        ${
                                                            isOpen
                                                                ? 'grid-rows-[1fr] opacity-100 mt-3 sm:mt-4'
                                                                : 'grid-rows-[0fr] opacity-0'
                                                        }
                                                    `}
                                                >
                                                    <div className="overflow-hidden">
                                                        <p className="title-des text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line ml-9 sm:ml-12">
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>

                            </div>
                        );
                    })}

                </div>
            </section>

            {/* Bottom Help Section */}
            <section className="bg-[#FCF6F2] px-5 sm:px-10 lg:px-20 py-12 sm:py-16">

                <div className="max-w-5xl mx-auto text-center">

                    <p className="text-[#BF8F5F] text-xs uppercase tracking-[0.2em] mb-3">
                        WE'RE HERE FOR YOU
                    </p>

                    <h2 className="font-serif text-[#222222] text-2xl sm:text-3xl lg:text-4xl">
                        Still Have Questions?
                    </h2>

                    <p className="text-gray-600 text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
                        Couldn't find the answer you were looking for?
                        Our team would be happy to help with your questions.
                    </p>

                    <Link
                        href="account/support"
                        className="inline-flex items-center justify-center gap-3 mt-8 border border-[#BF8F5F] text-[#BF8F5F] px-8 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-[#BF8F5F] hover:text-white transition-colors"
                    >
                        Contact Us
                        <span aria-hidden="true">→</span>
                    </Link>

                </div>
            </section>

        </main>
    );
}
