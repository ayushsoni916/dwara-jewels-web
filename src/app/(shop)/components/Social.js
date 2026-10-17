
import Image from 'next/image';
import Link from 'next/link';

const Social = () => {
    const INSTAGRAM_URL = 'https://www.instagram.com/dwara_jewels/';

    const socialPosts = [
        { img: '/images/social1.webp' },
        { img: '/images/social2.webp' },
        { img: '/images/social3.webp' },
        { img: '/images/social4.webp' },
    ];
    return (
        <section className="horizontal-padding mt-10 md:mt-24 lg:mt-[150px]">

            {/* Social Images */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">

                {socialPosts.map((post, index) => (
                    <Link
                        key={index}
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Visit Dwara Jewels on Instagram"
                        className="group relative overflow-hidden block rounded-md lg:rounded-none"
                    >

                        {/* Image */}
                        <div className="relative w-full aspect-square">
                            <Image
                                src={post.img}
                                alt={`Dwara Jewels collection ${index + 1}`}
                                fill
                                sizes="(max-width: 1023px) 50vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Social Handle */}
                        <div
                            className="
        absolute bottom-2 right-2
        sm:bottom-3 sm:right-3
        lg:bottom-5 lg:right-[23px]
        bg-[#FCF6F2]
        flex items-center
        gap-1 sm:gap-2 lg:gap-2.5
        px-2 py-1.5
        sm:px-3 sm:py-2
        lg:px-9 lg:py-4.5
        rounded-tl-[12px] lg:rounded-tl-[20px]
        rounded-br-md lg:rounded-br-none
    "
                        >
                            <Image
                                src="/icons/Insta.svg"
                                alt=""
                                width={20}
                                height={20}
                                className="w-3 h-3 sm:w-4 sm:h-4 lg:w-auto lg:h-auto"
                            />

                            <span className="title-des text-[#BF8F5F] opacity-100 text-[8px] sm:text-xs lg:text-base whitespace-nowrap">
                                @dwara_jewels
                            </span>
                        </div>

                    </Link>
                ))}
            </div>

            {/* Brand Content */}
            <div className="mt-10 md:mt-24 lg:mt-[150px]">

                <h2 className="link-explore text-lg sm:text-xl lg:text-2xl">
                    A Little Sparkle, A Lot of Love
                </h2>

                <p className="mt-4 title-des text-sm md:text-base text-gray-600 leading-relaxed">
                    At Dwara Jewels, we believe that every piece of jewellery
                    carries a story. A story of love, celebration, individuality,
                    and unforgettable moments. Our collections bring together
                    timeless elegance and contemporary design, creating
                    jewellery that complements your personal style.
                </p>

                <p className="mt-4 title-des text-sm md:text-base text-gray-600 leading-relaxed">
                    Whether you're celebrating a special occasion, searching
                    for a thoughtful gift, or adding a little sparkle to
                    everyday life, Dwara Jewels is here to make every moment
                    feel extraordinary. Discover designs that reflect your
                    personality and become part of the memories you'll cherish
                    for years to come.
                </p>

            </div>
        </section>
    );
};

export default Social;
