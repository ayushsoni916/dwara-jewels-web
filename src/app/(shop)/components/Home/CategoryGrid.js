import Image from 'next/image';
import Link from 'next/link';

// Hardcoded with actual MongoDB collection IDs and SEO-friendly descriptions
const categories = [
    {
        id: "6a93d4c99e04a111e7096ef5",
        title: "Glamour Earrings",
        img: "/images/Earring.webp",
        link: "/category?collection=6a93d4c99e04a111e7096ef5",
        description: "Stunning earrings crafted for everyday elegance."
    },
    {
        id: "6a93d4d79e04a111e7096ef9",
        title: "Shining Rings",
        img: "/images/Rings.webp",
        link: "/category?collection=6a93d4d79e04a111e7096ef9",
        description: "Beautifully crafted rings with timeless designs."
    },
    {
        id: "6a93d4e39e04a111e7096efd",
        title: "Traditional Necklaces",
        img: "/images/Nacklace.webp",
        link: "/category?collection=6a93d4e39e04a111e7096efd",
        description: "Heritage-inspired necklaces crafted to perfection."
    },
    {
        id: "6a93d4ee9e04a111e7096f01",
        title: "Precision Jhumkas",
        img: "/images/Jhumkas.webp",
        link: "/category?collection=6a93d4ee9e04a111e7096f01",
        description: "Intricately designed jhumkas for festive moments."
    },
];

export default function CategoryGrid() {
    return (
        <section className="px-4 md:px-12 lg:px-[170px] py-10 md:py-[67px] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-[60px] bg-white mt-10 lg:mt-[100px]">
            {categories.map((cat) => (
                <div
                    key={cat.id}
                    className="relative group overflow-hidden bg-[#F9F6F2] rounded-bl-[35px] rounded-tr-[35px] p-6 sm:py-7 sm:px-10 flex flex-col-reverse sm:flex-row justify-between items-center sm:h-64 gap-6 sm:gap-0"
                >
                    {/* Text Content */}
                    <div className="z-10 flex flex-col items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
                        <h2 className="text-[#222222] font-serif text-2xl sm:text-[32px] mb-3 sm:mb-4 leading-tight">
                            {cat.title}
                        </h2>
                        {/* Replaced Lorem Ipsum with dynamic description */}
                        <p className="text-sm opacity-60 mb-5 sm:mb-6 max-w-[250px] sm:max-w-[200px]">
                            {cat.description}
                        </p>
                        <Link
                            href={cat.link}
                            className="text-[#BF8F5F] font-bold pb-1 uppercase text-xs tracking-widest hover:text-[#222222] transition-colors"
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
                            className="object-contain"
                        />
                    </div>
                </div>
            ))}
        </section>
    );
}