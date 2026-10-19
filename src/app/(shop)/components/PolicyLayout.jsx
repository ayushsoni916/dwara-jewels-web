
import Link from 'next/link';

export default function PolicyLayout({
    title,
    updated,
    intro,
    sections,
}) {
    return (
        <main className="min-h-screen bg-white">
            <header className="bg-[#FCF6F2] px-5 py-14 md:py-20 text-center">
                <p className="text-[#BF8F5F] text-xs uppercase tracking-[0.3em] mb-4">
                    DWARA JEWELS
                </p>

                <h1 className="font-serif text-3xl md:text-5xl text-[#222222]">
                    {title}
                </h1>

                {updated && (
                    <p className="mt-4 text-sm text-gray-500">
                        Last Updated: {updated}
                    </p>
                )}
            </header>

            <div className="max-w-4xl mx-auto px-5 md:px-8 py-12 md:py-16">
                <p className="border-l-2 border-[#BF8F5F] pl-5 text-gray-600 leading-8 mb-12">
                    {intro}
                </p>

                <div className="space-y-10">
                    {sections.map((section, index) => (
                        <section
                            key={index}
                            className="border-b border-[#BF8F5F]/20 pb-8"
                        >
                            <h2 className="font-serif text-xl md:text-2xl text-[#222222] mb-5">
                                {section.title}
                            </h2>

                            <div className="space-y-4">
                                {section.items.map((item, i) => (
                                    <p
                                        key={i}
                                        className="text-gray-600 text-sm md:text-base leading-7"
                                    >
                                        {item}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                <div className="bg-[#FCF6F2] p-6 md:p-8 mt-12">
                    <h2 className="font-serif text-xl mb-3 text-[#222222]">
                        Need Assistance?
                    </h2>

                    <p className="text-sm text-gray-600 mb-4">
                        Contact our support team for any questions.
                    </p>

                    <a
                        href="mailto:dwarajewels.official@gmail.com"
                        className="text-[#BF8F5F] font-semibold hover:underline break-all"
                    >
                        dwarajewels.official@gmail.com
                    </a>
                    <p className="text-xs text-gray-500 mt-3">
                        Monday – Saturday | 10:00 AM – 7:00 PM IST
                    </p>
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/"
                        className="inline-block border border-[#BF8F5F] text-[#BF8F5F] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#BF8F5F] hover:text-white"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
