import Image from 'next/image';

const LuxeSocial = () => {
    const img1 = "/images/social1.webp";
    const img2 = "/images/social2.webp";
    const img3 = "/images/social3.webp";
    const img4 = "/images/social4.webp";

    const x = "/icons/X.svg";
    const fb = "/icons/Fb.svg";
    const insta = "/icons/Insta.svg";

    const instagramUrl = "https://www.instagram.com/dwara_jewels";

    const socialPosts = [
        { img: img1, icon: insta, alt: "Instagram" },
        { img: img2, icon: insta, alt: "Instagram" },
        { img: img3, icon: insta, alt: "Instagram" },
        { img: img4, icon: insta, alt: "Instagram" },
    ];

    return (
        <section
            className="relative w-full py-16 md:py-24 px-6 lg:px-20 overflow-hidden z-10"
            style={{ background: 'radial-gradient(69.72% 78.08% at 47.07% 0%, #1F2A40 0%, #0C0E17 100%)' }}
        >
            {/* Starry Background Layer to match the rest of the site */}
            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-40">
                <Image
                    src="/images/Background.png"
                    alt="Luxury Starry Background"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Overline Tag */}
                <div className="mb-10 text-center lg:text-left">
                    <span className="text-[#D6B693] font-sans font-semibold text-[13px] lg:text-[14px] uppercase tracking-[0.2em] block mb-2">
                        JOIN THE EXCLUSIVITY
                    </span>
                    <h2 className="font-serif font-normal text-white text-[32px] sm:text-[40px] leading-tight">
                        Follow Our Journey
                    </h2>
                </div>

                {/* Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {socialPosts.map((post, index) => (
                        <a
                            key={index}
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit Dwara Jewels Instagram - Image ${index + 1}`}
                            className="relative group block overflow-hidden border border-white/10 hover:border-[#D6B693]/50 transition-colors duration-500 cursor-pointer aspect-square sm:aspect-[4/5]"
                        >
                            <Image
                                src={post.img}
                                alt={`Social Image ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                            />

                            {/* Dark Theme Social Handle Label */}
                            <div className="absolute bottom-0 right-0 bg-[#0C0E17]/90 backdrop-blur-md border-t border-l border-white/10 group-hover:border-[#D6B693]/50 transition-colors duration-500 flex items-center gap-2 px-5 py-3 md:px-6 md:py-4">
                                <Image
                                    src={post.icon}
                                    alt={post.alt}
                                    width={16}
                                    height={16}
                                    className="brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                                />
                                <p className="font-sans text-[#D6B693] text-xs md:text-sm tracking-wider m-0">
                                    @dwara_jewels
                                </p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* SEO / Story Text Section */}
                <div className="mt-16 md:mt-24 max-w-4xl">
                    <h2 className="font-serif text-white text-2xl md:text-3xl mb-6">
                        The Legacy of Luxe
                    </h2>


                    <p className="mt-4 md:mt-6 font-sans text-white/50 text-sm md:text-[15px] leading-relaxed tracking-wide">
                        At Dwara Jewels, we believe jewellery is more than an accessory.
                        It is an expression of individuality, elegance, and the moments
                        that make life extraordinary. Our Luxe collection celebrates
                        timeless designs with a contemporary spirit, crafted to
                        complement every special occasion.
                    </p>

                    <p className="mt-4 md:mt-6 font-sans text-white/50 text-sm md:text-[15px] leading-relaxed tracking-wide">
                        Discover pieces designed to be cherished, from delicate everyday
                        statements to jewellery that adds a touch of brilliance to your
                        most memorable celebrations. Follow our journey on Instagram
                        for new collections, styling inspiration, and a closer look
                        at the world of Dwara Jewels.
                    </p>

                </div>

            </div>

            {/* Bottom Gradient Border Line connecting to the footer */}
            <div className="absolute bottom-0 inset-x-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[#F2DFCE] to-transparent z-20"></div>
        </section>
    );
};

export default LuxeSocial;