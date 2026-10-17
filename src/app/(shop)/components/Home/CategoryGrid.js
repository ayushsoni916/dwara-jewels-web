
import Image from 'next/image';
import Link from 'next/link';

const categories = [
    {
        id: '6acd0a05b2210243220ab66f',
        title: 'Glamour Earrings',
        mobileTitle: 'Earrings',
        img: '/images/Earring copy.webp',
        description: 'A little sparkle for every moment',
    },
    {
        id: '6acd09e9b2210243220ab66b',
        title: 'Timeless Rings',
        mobileTitle: 'Rings',
        img: '/images/Ring.webp',
        description: 'A symbol of timeless elegance',
    },
    {
        id: '6acd0a20b2210243220ab673',
        title: 'Regal Necklaces',
        mobileTitle: 'Necklace',
        img: '/images/Nack.webp',
        description: 'Grace that speaks without words',
    },
    {
        id: '6acd0a8db2210243220ab677',
        title: 'Elegant Bracelets',
        mobileTitle: 'Bracelets',
        img: '/images/Bracelet.webp',
        description: 'Delicate charm for every day',
    },
];

export default function CategoryGrid() {
    return (
        <section className="px-4 sm:px-6 md:px-12 lg:px-[170px] py-8 md:py-[67px] mt-6 lg:mt-[100px] bg-white">
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:gap-5 lg:gap-[60px]">

                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={`/category?categoryId=${cat.id}`}
                        className="
                            group relative overflow-hidden
                            bg-[#F2DFCE47]
                            rounded-tr-[20px] rounded-bl-[20px]
                            lg:rounded-tr-[35px] lg:rounded-bl-[35px]
                            h-[85px] min-[400px]:h-[95px]
                            sm:h-[160px] lg:h-[256px]
                            px-2.5 min-[400px]:px-3 sm:px-6 lg:px-10
                            flex flex-row items-center justify-between
                            gap-1 sm:gap-3
                            transition-shadow duration-300
                         
                        "
                    >
                        {/* Text Content */}
                        <div className="relative z-10 flex-1 min-w-0 flex flex-col items-start justify-center gap-1 sm:gap-2 lg:gap-4">

                            <h2 className="text-[#222222] font-serif text-[12px] min-[400px]:text-[13px] sm:text-[20px] lg:text-[30px] leading-tight">
                                <span className="lg:hidden">
                                    {cat.mobileTitle}
                                </span>

                                <span className="hidden lg:inline">
                                    {cat.title}
                                </span>
                            </h2>

                            <p className="text-[#222222]/60 text-[8px] min-[400px]:text-[9px] sm:text-xs lg:text-sm leading-snug line-clamp-2 lg:line-clamp-3">
                                {cat.description}
                            </p>

                            {/* Desktop Explore Link */}
                            <span className="hidden lg:inline-block text-[#BF8F5F] font-bold uppercase text-xs tracking-widest border-b border-[#BF8F5F] pb-1 group-hover:text-[#222222] transition-colors">
                                Explore More →
                            </span>
                        </div>

                        {/* Jewelry Image */}
                        <div className="
                            relative shrink-0
                            w-[52px] h-[52px]
                            min-[400px]:w-[60px] min-[400px]:h-[60px]
                            sm:w-[100px] sm:h-[100px]
                            lg:w-[170px] lg:h-[170px]
                            transition-transform duration-500
                            group-hover:scale-110
                        ">
                            <Image
                                src={cat.img}
                                alt={cat.title}
                                fill
                                sizes="(max-width: 399px) 52px, (max-width: 639px) 60px, (max-width: 1023px) 100px, 170px"
                                className="object-contain"
                            />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
