
import Link from 'next/link';

export const metadata = {
    title: 'Terms & Conditions | Dwara Jewels',
    description: 'Read the terms and conditions for shopping at Dwara Jewels.',
};

const sections = [
    {
        title: '1. General Conditions',
        paragraphs: [
            'By using this website, you represent that you are at least the age of majority in your state or country of residence.',
            'We reserve the right to refuse service to anyone for any reason at any time.',
            'You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of our products, design images, or website content without express written permission from Dwara Jewels.',
        ],
    },
    {
        title: '2. Product Information & Purity Standards',
        paragraphs: [
            'Material Authenticity: All Dwara Jewels products are crafted from authentic 925 sterling silver, containing 92.5% pure silver by weight, and bear the 925 hallmark stamp.',
            'Accuracy: We strive to display colors, textures, and dimensions accurately. However, monitor differences and hand-finished craftsmanship may result in slight variations.',
            'Pricing & Availability: Prices, promotions, and product availability may change without prior notice. We reserve the right to modify or discontinue products.',
        ],
    },
    {
        title: '3. Orders & Payments',
        paragraphs: [
            'Order Acceptance: An order confirmation does not necessarily signify final acceptance. We may cancel or limit orders affected by stock issues, suspected fraud, or pricing errors.',
            'Payment Methods: Payments must be completed using the payment methods made available at checkout, including cards, UPI, and net banking where supported.',
            'Cash on Delivery: If COD is offered, additional verification may be required before dispatch.',
        ],
    },
    {
        title: '4. Shipping & Delivery',
        paragraphs: [
            'Delivery timelines are estimates and may vary due to location, weather, courier delays, or other circumstances.',
            'Risk of loss and title for items pass to the customer upon delivery to the specified shipping address.',
            'Please inspect the package upon delivery and report shipping damage within 24 hours with relevant photo or video evidence.',
        ],
    },
    {
        title: '5. Returns, Exchanges & Refunds',
        paragraphs: [
            'Eligible items may be returned or exchanged within 7 days of delivery, provided they are unused, in original condition, and accompanied by their original packaging and invoice.',
            'Customized, engraved, and final-sale items are generally not eligible for return or exchange unless damaged or defective on arrival.',
            'Return eligibility, intact security tags, shipping charges, and refund processing are governed by our Return & Exchange Policy.',
        ],
    },
    {
        title: '6. Intellectual Property',
        paragraphs: [
            'All website content, including our brand name, logos, product designs, photography, graphics, text, and marketing materials, belongs to Dwara Jewels or its respective rights holders and is protected under applicable intellectual property laws.',
        ],
    },
    {
        title: '7. Natural Tarnishing & Jewelry Care',
        paragraphs: [
            'Sterling silver naturally oxidizes or tarnishes over time when exposed to oxygen, sulfur, moisture, and certain household chemicals.',
            'Natural tarnishing does not automatically constitute a manufacturing defect. Customers should follow the recommended jewelry care guidelines to preserve their pieces.',
        ],
    },
    {
        title: '8. Limitation of Liability',
        paragraphs: [
            'To the extent permitted by applicable law, Dwara Jewels limits its liability for losses arising from the use of our website, products, or services. Nothing in these terms excludes rights or remedies that cannot legally be excluded under applicable consumer protection laws.',
        ],
    },
    {
        title: '9. Governing Law',
        paragraphs: [
            'These Terms and Conditions are governed by the laws of India. Subject to applicable consumer protection laws and mandatory jurisdiction rules, disputes shall be subject to the courts in Jaipur, Rajasthan.',
        ],
    },
    {
        title: '10. Warranty & Plating Coverage',
        paragraphs: [
            'Dwara Jewels provides a limited 6-month warranty covering eligible structural manufacturing defects and anti-tarnish plating issues under normal wearing conditions.',
            'The warranty may cover manufacturing-related clasp defects, faulty settings, eligible prong repairs, and premature plating issues when care instructions have been followed.',
            'Accidental damage, lost gemstones, chemical damage, normal wear and tear, and unauthorized third-party repairs are excluded as described in our Warranty Policy.',
            'Warranty service and gemstone replacement requests are subject to inspection, eligibility verification, and applicable shipping or replacement charges.',
        ],
    },
];

export default function TermsAndConditionsPage() {
    return (
        <main className="min-h-screen bg-white">
            <section className="bg-[#FCF6F2] px-5 py-12 md:py-20 text-center">
                <p className="text-[#BF8F5F] text-xs tracking-[0.3em] uppercase mb-4">
                    Dwara Jewels
                </p>

                <h1 className="font-serif text-3xl md:text-5xl text-[#222222]">
                    Terms & Conditions
                </h1>

                <p className="text-gray-500 text-sm mt-4">
                    Last Updated: October 11, 2026
                </p>
            </section>

            <section className="max-w-4xl mx-auto px-5 sm:px-8 py-12 md:py-16">
                <div className="border-l-2 border-[#BF8F5F] pl-5 mb-12">
                    <p className="text-gray-600 text-sm md:text-base leading-8">
                        Welcome to Dwara Jewels ("we," "our," or "us").
                        These Terms and Conditions govern your access to
                        and use of our website, services, and purchase of
                        products from Dwara Jewels. By visiting or shopping
                        on our website, you agree to these terms.
                        Please read them carefully.
                    </p>
                </div>

                <div className="space-y-10">
                    {sections.map(section => (
                        <section
                            key={section.title}
                            className="border-b border-[#BF8F5F]/20 pb-8"
                        >
                            <h2 className="font-serif text-xl md:text-2xl text-[#222222] mb-5">
                                {section.title}
                            </h2>

                            <div className="space-y-4">
                                {section.paragraphs.map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className="text-gray-600 text-sm md:text-base leading-7"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="mt-12 bg-[#FCF6F2] p-6 md:p-8">
                    <h2 className="font-serif text-xl text-[#222222] mb-3">
                        Have Questions?
                    </h2>

                    <p className="text-gray-600 text-sm leading-7 mb-4">
                        For any questions regarding these terms,
                        please contact our support team.
                    </p>

                    <a
                        href="mailto:dwarajewels.official@gmail.com"
                        className="text-[#BF8F5F] text-sm font-bold hover:underline"
                    >
                        dwarajewels.official@gmail.com
                    </a>
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/"
                        className="inline-block border border-[#BF8F5F] text-[#BF8F5F] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#BF8F5F] hover:text-white transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </section>
        </main>
    );
}
