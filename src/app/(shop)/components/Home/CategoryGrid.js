import Image from 'next/image';
import Link from 'next/link';

const categories = [
    { title: "Glamour Earrings", img: "/images/Earring.webp", link: "/earrings" },
    { title: "Shining Rings", img: "/images/Rings.webp", link: "/rings" },
    { title: "Traditional Necklaces", img: "/images/Nacklace.webp", link: "/necklaces" },
    { title: "Precision Jhumkas", img: "/images/Jhumkas.webp", link: "/jhumkas" },
];

export default function CategoryGrid() {
    return (
        <section className="px-42.5 py-16.75 grid grid-cols-1 md:grid-cols-2 gap-15 bg-white mt-25">
            {categories.map((cat) => (
                <div key={cat.title} className="relative group overflow-hidden bg-[#F9F6F2] rounded-bl-[35px] rounded-tr-[35px] py-7 px-10 flex justify-between items-center h-64">
                    <div className="z-10">
                        <h2 className="text-[#222222] font-serif text-[32px] mb-4">{cat.title}</h2>
                        <p className="text-sm opacity-60 mb-6 max-w-50">Lorem Ipsum is simply dummy text of the printing.</p>
                        <Link href={cat.link} className="text-[#BF8F5F] font-bold pb-1 uppercase text-xs tracking-widest hover:text-[#222222] transition-colors">
                            Explore More →
                        </Link>
                    </div>
                    <div className="relative w-48 h-48 transition-transform duration-500 group-hover:scale-110">
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