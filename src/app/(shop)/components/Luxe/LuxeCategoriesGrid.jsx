import Image from 'next/image';
import Link from 'next/link';

// Hardcoded with actual MongoDB collection IDs and SEO-friendly descriptions adapted for Luxe
const luxeCategories = [
    {
        id: "6a93d4c99e04a111e7096ef5",
        title: "Glamour Earrings",
        img: "/images/Earring.webp",
        link: "/luxe/category?collection=6a93d4c99e04a111e7096ef5",
        description: "Stunning earrings crafted for everyday elegance."
    },
    {
        id: "6a93d4d79e04a111e7096ef9",
        title: "Shining Rings",
        img: "/images/Rings.webp",
        link: "/luxe/category?collection=6a93d4d79e04a111e7096ef9",
        description: "Beautifully crafted rings with timeless designs."
    },
    {
        id: "6a93d4e39e04a111e7096efd",
        title: "Traditional Necklaces",
        img: "/images/Nacklace.webp",
        link: "/luxe/category?collection=6a93d4e39e04a111e7096efd",
        description: "Heritage-inspired necklaces crafted to perfection."
    },
    {
        id: "6a93d4ee9e04a111e7096f01",
        title: "Precision Jhumkas",
        img: "/images/Jhumkas.webp",
        link: "/luxe/category?collection=6a93d4ee9e04a111e7096f01",
        description: "Intricately designed jhumkas for festive moments."
    },
];

export default function LuxeCategoryGrid() {
    return (
        <section className="relative w-full overflow-hidden py-10 md:py-[67px]">
            {/* Starry Background Layer matching LuxeHero */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/images/Background.png"
                    alt="Luxury Starry Background"
                    fill
                    className="object-cover opacity-60"
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 px-4 md:px-12 lg:px-[170px] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-[60px]">
                {luxeCategories.map((cat) => (
                    <div
                        key={cat.id}
                        className="relative group overflow-hidden bg-[#12141D]/90 backdrop-blur-sm border border-white/10 rounded-bl-[35px] rounded-tr-[35px] p-6 sm:py-7 sm:px-10 flex flex-col-reverse sm:flex-row justify-between items-center sm:h-64 gap-6 sm:gap-0 transition-all duration-300 hover:border-[#D6B693]/50 shadow-xl"
                    >
                        {/* Text Content */}
                        <div className="z-10 flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
                            <h2 className="text-white font-serif text-2xl sm:text-[32px] mb-3 sm:mb-4 leading-tight">
                                {cat.title}
                            </h2>
                            <p className="text-sm text-gray-400 opacity-80 mb-5 sm:mb-6 max-w-[250px] sm:max-w-[200px]">
                                {cat.description}
                            </p>
                            <Link
                                href={cat.link}
                                className="text-[#E5D3C4] font-bold pb-1 uppercase text-xs tracking-widest hover:text-white transition-colors"
                            >
                                Explore More →
                            </Link>
                        </div>

                        {/* Image Container */}
                        <div className="relative w-36 h-36 sm:w-48 sm:h-48 transition-transform duration-500 group-hover:scale-110 flex-shrink-0">
                            <Image
                                src={cat.img}
                                alt={cat.title}
                                fill
                                className="object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}