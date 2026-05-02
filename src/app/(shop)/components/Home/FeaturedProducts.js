import Image from 'next/image';
import Link from 'next/link';

const trendingProducts = [
    {
        id: 1,
        name: "Anes Narrow Diamond Ring",
        material: "in 18k rose old",
        price: "$699.00",
        img: "/images/Nacklace.webp",
        badge: null
    },
    {
        id: 2,
        name: "Elsa Peretti Diamonds",
        material: "by the Yard",
        price: "$1,299.00",
        img: "/images/Jhumkas.webp",
        badge: "- 30%"
    },
    {
        id: 3,
        name: "Tiffany HardWear ball dangle",
        material: "ring in 18k gold",
        price: "$1,599.00",
        img: "/images/Rings.webp",
        badge: null
    },
    {
        id: 4,
        name: "Tiffany Embrace band ring",
        material: "in platinum & diamonds",
        price: "$899.00",
        img: "/images/Earring.webp",
        badge: null
    }
];

export default function FeaturedProducts() {
    return (
        <section className="bg-[#F9F1E7] py-20 px-6 lg:px-20 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
                
                {/* Left Sidebar Text */}
                <div className="lg:w-1/4 flex flex-col justify-center">
                    <span className="text-[#BF8F5F] font-sans text-xs uppercase tracking-[0.3em] mb-4">
                        Trending Products
                    </span>
                    <h2 className="text-[#222222] font-serif text-4xl lg:text-5xl leading-tight mb-6">
                        Beauty At Its Finest
                    </h2>
                    <p className="text-gray-600 text-sm mb-8 leading-relaxed">
                        Discover our handpicked selection of exquisite jewelry pieces, curated to elevate your style and capture the essence.
                    </p>
                    <Link href="/shop" className="text-[#BF8F5F] font-bold border-b border-[#BF8F5F] pb-1 uppercase text-xs tracking-widest inline-block w-fit">
                        Explore More →
                    </Link>
                </div>

                {/* Right Product Slider Area */}
                <div className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingProducts.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                            <div className="relative aspect-square bg-white mb-4 overflow-hidden rounded-sm">
                                {product.badge && (
                                    <span className="absolute top-3 left-3 bg-[#BF8F5F] text-white text-[10px] px-2 py-1 z-10">
                                        {product.badge}
                                    </span>
                                )}
                                <Image 
                                    src={product.img} 
                                    alt={product.name}
                                    fill
                                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Quick Action Icons */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="bg-white p-2 rounded-full shadow-sm hover:bg-brand-gold hover:text-white transition-colors">
                                        <Image src="/icons/Heart.svg" alt="Wishlist" width={18} height={18} />
                                    </button>
                                    <button className="bg-white p-2 rounded-full shadow-sm hover:bg-brand-gold hover:text-white transition-colors">
                                        <Image src="/icons/Cart.svg" alt="Add to Cart" width={18} height={18} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-[#222222] font-bold text-sm leading-tight mb-1">{product.name}</h3>
                            <p className="text-gray-500 text-xs mb-2">{product.material}</p>
                            <p className="text-[#BF8F5F] font-bold text-sm">{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Carousel Navigation (Visible on Desktop) */}
            <div className="flex justify-end gap-4 mt-12 max-w-7xl mx-auto hidden lg:flex">
                <button className="w-10 h-10 border border-[#BF8F5F] rounded-full flex items-center justify-center text-[#BF8F5F] hover:bg-[#BF8F5F] hover:text-white transition-all">
                    ←
                </button>
                <button className="w-10 h-10 border border-[#BF8F5F] rounded-full flex items-center justify-center text-[#BF8F5F] hover:bg-[#BF8F5F] hover:text-white transition-all">
                    →
                </button>
            </div>
        </section>
    );
}