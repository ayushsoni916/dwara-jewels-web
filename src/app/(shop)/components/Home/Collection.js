
import Link from "next/link";

const Collection = () => {
    const img1 = "/images/LuxuryBanner.webp";
    const img2 = "/images/GiftForHerWeb.webp";
    const img3 = "/images/GiftForHimWeb.webp";

    return (
        <section className="horizontal-padding mt-16 md:mt-24 lg:mt-[150px]">
            {/* Luxe Collection */}
            <div className="overflow-hidden mb-6 md:mb-10 lg:mb-15">
                <Link
                    href="/category?luxe=true"
                    className="block w-full h-full"
                >
                    <img
                        src={img1}
                        alt="Explore Dwara Jewels Luxe Collection"
                        className="w-full h-auto transition-transform duration-500 hover:scale-105 cursor-pointer"
                    />
                </Link>
            </div>

            {/* Gift Collections */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-15">

                {/* Gift for Her */}
                <div className="w-full md:w-1/2 overflow-hidden">
                    <Link
                        href="/category?gender=Female"
                        className="block w-full h-full"
                    >
                        <img
                            src={img2}
                            alt="Explore Gift for Her Collection"
                            className="w-full h-auto transition-transform duration-500 hover:scale-105 cursor-pointer"
                        />
                    </Link>
                </div>

                {/* Gift for Him */}
                <div className="w-full md:w-1/2 overflow-hidden">
                    <Link
                        href="/category?gender=Male"
                        className="block w-full h-full"
                    >
                        <img
                            src={img3}
                            alt="Explore Gift for Him Collection"
                            className="w-full h-auto transition-transform duration-500 hover:scale-105 cursor-pointer"
                        />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Collection;
