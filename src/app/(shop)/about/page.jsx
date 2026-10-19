
import Link from 'next/link';

export const metadata = {
    title: 'About Us | Dwara Jewels',
    description: 'Discover Dwara Jewels and our collection of 925 sterling silver jewellery.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <section className="bg-[#FCF6F2] px-5 py-16 md:py-24 text-center">
                <p className="text-[#BF8F5F] text-xs uppercase tracking-[0.3em] mb-4">
                    OUR STORY
                </p>
                <h1 className="font-serif text-4xl md:text-6xl text-[#222222] mb-6">
                    About Dwara Jewels
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg leading-8">
                    Timeless elegance, thoughtful design, and the enduring
                    beauty of 925 sterling silver.
                </p>
            </section>

            <section className="max-w-5xl mx-auto px-5 md:px-8 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
                    <div>
                        <p className="text-[#BF8F5F] uppercase tracking-[0.2em] text-xs mb-4">
                            WHO WE ARE
                        </p>
                        <h2 className="font-serif text-3xl md:text-4xl text-[#222222] leading-tight">
                            Jewellery That Tells Your Story
                        </h2>
                    </div>

                    <div className="space-y-5 text-gray-600 text-sm md:text-base leading-8">
                        <p>
                            Welcome to Dwara Jewels, a jewellery brand
                            dedicated to celebrating personal style through
                            elegant 925 sterling silver creations.
                        </p>
                        <p>
                            We believe jewellery is more than an accessory.
                            It is an expression of individuality, a reminder
                            of meaningful moments, and a piece of beauty
                            that becomes part of your story.
                        </p>
                        <p>
                            Our collections bring together classic design
                            and contemporary aesthetics, offering jewellery
                            for everyday wear, special occasions, and
                            thoughtful gifting.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-[#FCF6F2] py-16 md:py-24 px-5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[#BF8F5F] uppercase tracking-[0.2em] text-xs mb-3">
                            WHAT WE VALUE
                        </p>
                        <h2 className="font-serif text-3xl md:text-4xl text-[#222222]">
                            The Dwara Philosophy
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: '925 Sterling Silver',
                                description: 'Our jewellery is designed around the timeless appeal of sterling silver, with a focus on material authenticity.',
                            },
                            {
                                title: 'Thoughtful Design',
                                description: 'From minimal everyday pieces to statement styles, we believe beautiful jewellery should feel personal.',
                            },
                            {
                                title: 'Customer Care',
                                description: 'We aim to provide clear product details, transparent policies, and helpful support throughout your shopping experience.',
                            },
                        ].map(item => (
                            <div
                                key={item.title}
                                className="bg-white p-7 border border-[#BF8F5F]/20"
                            >
                                <h3 className="font-serif text-xl text-[#BF8F5F] mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-sm leading-7 text-gray-600">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="text-center px-5 py-16 md:py-24">
                <h2 className="font-serif text-3xl text-[#222222] mb-5">
                    Explore Dwara Jewels
                </h2>
                <p className="text-gray-600 text-sm mb-8">
                    Find a piece that feels uniquely yours.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-[#BF8F5F] text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#222222]"
                >
                    Explore Collections
                </Link>
            </section>
        </main>
    );
}
