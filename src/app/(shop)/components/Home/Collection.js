import Link from "next/link";

const Collection = () => {
    const img1 = "/images/LuxuryBanner.webp";
    const img2 = "/images/GiftForHerWeb.webp";
    const img3 = "/images/GiftForHimWeb.webp";

    return (
        <section className="horizontal-padding mt-16 md:mt-24 lg:mt-[150px]">
            {/* First Image */}
            <div className="overflow-hidden mb-6 md:mb-10 lg:mb-15">
                <Link href="/luxe" className="block w-full h-full">
                    <img
                        src={img1}
                        alt="Collection Image 1"
                        className="w-full h-auto transition-transform duration-500 hover:scale-105 cursor-pointer"
                    />
                </Link>
            </div>

            {/* Bottom Images Container */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-15">
                {/* Second Image */}
                <div className="w-full md:w-1/2 overflow-hidden">
                    <img
                        src={img2}
                        alt="Collection Image 2"
                        className="w-full h-auto transition-transform duration-500 hover:scale-105 cursor-pointer"
                    />
                </div>

                {/* Third Image */}
                <div className="w-full md:w-1/2 overflow-hidden ">
                    <img
                        src={img3}
                        alt="Collection Image 3"
                        className="w-full h-auto transition-transform duration-500 hover:scale-105 cursor-pointer"
                    />
                </div>
            </div>
        </section>
    );
};

export default Collection;