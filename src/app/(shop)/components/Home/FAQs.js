
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export const faqData = [
    {
        id: 1,
        category: 'Jewellery & Care',
        question: 'What materials are used in Dwara Jewels products?',
        answer:
            'All Dwara Jewels pieces are crafted from high-quality 925 sterling silver, which consists of 92.5% pure silver. Many of our designs also feature semi-precious gemstones, zircon crystals, and durable gold or rhodium plating.',
    },
    {
        id: 2,
        category: 'Jewellery & Care',
        question: 'How do I know my jewelry is authentic 925 silver?',
        answer:
            'Every piece from Dwara Jewels comes stamped with an official 925 hallmark to guarantee the purity and authenticity of the silver.',
    },
    {
        id: 3,
        category: 'Jewellery & Care',
        question: 'Will the jewelry tarnish over time?',
        answer:
            'Pure silver naturally reacts with moisture, air, and chemicals over time, which can cause oxidation. However, our rhodium and gold-plated layers provide a protective barrier to minimize tarnishing. Regular care and proper storage will keep your pieces looking brand new.',
    },
    {
        id: 4,
        category: 'Jewellery & Care',
        question: 'How should I care for and store my Dwara Jewels?',
        answer:
            'Keep your jewelry away from water, perfumes, lotions, sanitizers, and harsh household chemicals.\n\nWear your jewelry last when getting ready.\n\nStore each piece individually in an airtight pouch or a lined box to prevent scratches and exposure to air.\n\nWipe gently with a soft microfiber cloth after each use.',
    },
    {
        id: 5,
        category: 'Jewellery & Care',
        question: 'Is 925 silver jewelry safe for sensitive skin?',
        answer:
            'Yes! 925 sterling silver is naturally hypoallergenic and nickel-free, making Dwara Jewels safe and comfortable for daily wear on sensitive skin.',
    },
    {
        id: 6,
        category: 'Jewellery & Care',
        question: 'Do you offer a warranty on your jewelry?',
        answer:
            'Yes, we offer a quality warranty covering manufacturing defects and anti-tarnish plating within our standard warranty period. Please check our Warranty Policy for complete terms and conditions.',
    },
    {
        id: 7,
        category: 'Orders, Shipping & Returns',
        question: 'How long will it take to receive my order?',
        answer:
            'Standard Shipping: Delivered within 7 to 10 business days depending on your location.\n\nExpress shipping options may be available at checkout.',
    },
    {
        id: 8,
        category: 'Orders, Shipping & Returns',
        question: 'What is your exchange and return policy?',
        answer:
            'We want you to love your pieces! We offer returns and exchanges on unused, undamaged items in their original packaging within 3 days of delivery. Custom or personalized items are final sale.',
    },
    {
        id: 9,
        category: 'Orders, Shipping & Returns',
        question: 'Can I customize or personalize a design?',
        answer:
            'Depending on the piece, we offer select custom options such as ring sizing, stone selection, or custom engravings. Contact our customer support team to discuss your custom request.',
    },
    {
        id: 10,
        category: 'Orders, Shipping & Returns',
        question: 'How do I find my ring or bracelet size?',
        answer:
            'Refer to our Size Guide on the website for simple step-by-step instructions and size conversion charts to find your perfect fit before ordering.',
    },
    {
        id: 11,
        category: 'Jewellery & Care',
        question: 'Can I wear my Dwara Jewels in the shower or while swimming?',
        answer:
            'We recommend removing your silver jewelry before showering, swimming, or working out. Exposure to water, chlorine, salt water, and body sweat can accelerate tarnishing and dull the protective plating.',
    },
    {
        id: 12,
        category: 'Jewellery & Care',
        question: 'My silver jewelry has started to tarnish. How can I clean it at home?',
        answer:
            'Gently wipe the piece using a specialized silver polishing cloth. Avoid using harsh chemical cleaners, abrasive pastes, or paper towels, as these can strip protective coatings or scratch the silver surface.',
    },
    {
        id: 13,
        category: 'Jewellery & Care',
        question: 'What is the difference between silver-plated and 925 sterling silver?',
        answer:
            'Silver-plated jewelry consists of a cheap base metal (like brass or nickel) covered with a micro-thin layer of silver that wears off quickly. 925 Sterling Silver is solid precious metal (92.5% pure silver) throughout, ensuring long-lasting value, durability, and skin safety.',
    },
    {
        id: 14,
        category: 'Orders, Shipping & Returns',
        question: 'Does Dwara Jewels packaging arrive ready for gifting?',
        answer:
            'Yes! Every Dwara Jewels piece arrives in our signature branded gift packaging, making it ready to present immediately—whether for a birthday, anniversary, festival, or personal treat.',
    },
    {
        id: 15,
        category: 'Orders, Shipping & Returns',
        question: 'What should I do if my package arrives damaged or missing an item?',
        answer:
            'Please inspect your shipment upon arrival. If there is any visible damage or an issue with your order, contact our support team within 24 hours of delivery with pictures/videos of the package so we can arrange an immediate replacement.',
    },
];

const FAQs = () => {
    const [openId, setOpenId] = useState(null);

    // Show only 3 FAQs on the homepage
    const homeFaqs = faqData.slice(0, 3);

    return (
        <section className="w-full">

            {/* Header */}
            <div>
                <h2 className="text-[#BF8F5F] heading-tag text-sm sm:text-base">
                    QUESTIONS
                </h2>

                <h1 className="heading-main mt-2 text-3xl sm:text-4xl lg:text-[40px]">
                    Frequently Asked Questions (FAQ)
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3 lg:mt-4">

                    <p className="heading-des text-sm sm:text-base text-gray-600">
                        Find answers to your questions about Dwara Jewels.
                    </p>

                    <Link
                        href="/faq"
                        className="flex items-center gap-2 sm:gap-3 group w-max shrink-0"
                    >
                        <span className="link-explore text-sm sm:text-base group-hover:text-[#BF8F5F] transition-colors">
                            View All FAQs
                        </span>

                        <Image
                            src="/icons/ExploreArrow.svg"
                            alt=""
                            width={24}
                            height={24}
                            className="w-5 sm:w-6 transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>
            </div>

            {/* Accordion - Only 3 FAQs */}
            <div className="flex flex-col gap-3 sm:gap-4 mt-8 lg:mt-[58px]">

                {homeFaqs.map((item) => {
                    const isOpen = openId === item.id;

                    return (
                        <div
                            key={item.id}
                            className={`transition-all duration-300 overflow-hidden rounded-lg sm:rounded-none ${
                                isOpen
                                    ? 'bg-[#FCF6F2] p-4 sm:p-6 lg:p-8'
                                    : 'bg-white px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4'
                            }`}
                        >

                            {/* Question */}
                            <button
                                type="button"
                                onClick={() =>
                                    setOpenId(isOpen ? null : item.id)
                                }
                                aria-expanded={isOpen}
                                aria-controls={`faq-answer-${item.id}`}
                                className="flex items-center gap-4 sm:gap-6 w-full text-left cursor-pointer"
                            >
                                <span
                                    className="text-[#B58E58] text-xl sm:text-2xl font-light w-5 sm:w-6 shrink-0 text-center"
                                    aria-hidden="true"
                                >
                                    {isOpen ? '−' : '+'}
                                </span>

                                <span className="title-main text-base sm:text-lg">
                                    {item.question}
                                </span>
                            </button>

                            {/* Answer */}
                            <div
                                id={`faq-answer-${item.id}`}
                                className={`grid transition-all duration-300 ease-in-out ${
                                    isOpen
                                        ? 'grid-rows-[1fr] opacity-100 mt-2 sm:mt-3'
                                        : 'grid-rows-[0fr] opacity-0'
                                }`}
                                aria-hidden={!isOpen}
                            >
                                <div className="overflow-hidden">
                                    <p className="title-des ml-9 sm:ml-12 text-sm sm:text-base text-gray-600 whitespace-pre-line leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FAQs;

