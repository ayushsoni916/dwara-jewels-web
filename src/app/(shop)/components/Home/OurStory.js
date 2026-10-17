
const OurStory = () => {
    const flower = "/icons/Flower.svg";
    const img1 = "/images/ImgStory1.webp";
    const img2 = "/images/ImgStory2.webp";

    return (
        <section className="horizontal-padding mt-16 md:mt-24 lg:mt-[200px] flex flex-col lg:grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-20">

            {/* Text Content */}
            <div className="flex flex-col justify-center">

                <h2 className="text-[#BF8F5F] heading-tag text-sm sm:text-base mb-2">
                    OUR STORY
                </h2>

                <h1 className="heading-main text-3xl sm:text-4xl lg:text-5xl leading-tight">
                    A New Beginning,
                    <br />
                    A Timeless Tradition
                </h1>

                <p className="link-explore mt-6 lg:mt-[40px] text-sm sm:text-base">
                    Every piece tells a story. Let yours shine.
                </p>

                <p className="mt-4 heading-des text-sm sm:text-base text-gray-600">
                    At Dwara Jewels, we believe jewellery is more than
                    an accessory. It is a reflection of love, individuality,
                    and the moments that make life beautiful.
                </p>

                <p className="mt-4 heading-des text-sm sm:text-base text-gray-600">
                    Our journey begins with a simple vision: to bring
                    timeless elegance and contemporary design together,
                    creating jewellery that feels as special as the
                    person wearing it.
                </p>

                <p className="mt-4 heading-des text-sm sm:text-base text-gray-600">
                    From everyday celebrations to life's unforgettable
                    milestones, we hope to become a small part of
                    your most cherished memories.
                </p>

            </div>

            {/* Images Section */}
            <div className="flex w-full gap-4 sm:gap-8">

                {/* Left Image */}
                <div className="w-1/2">
                    <img
                        src={img1}
                        alt="Dwara Jewels jewellery collection"
                        className="w-full h-[250px] sm:h-[350px] lg:h-[408px] object-cover rounded-md lg:rounded-none"
                    />
                </div>

                {/* Right Image (Staggered) */}
                <div className="w-1/2 flex flex-col mt-8 sm:mt-12 lg:mt-15">
                    <img
                        src={img2}
                        alt="Elegant jewellery by Dwara Jewels"
                        className="w-full h-[150px] sm:h-[200px] lg:h-[217px] object-cover rounded-md lg:rounded-none"
                    />

                    <img
                        src={flower}
                        alt=""
                        aria-hidden="true"
                        className="mt-6 lg:mt-[60px] h-10 lg:h-[60px] w-auto object-contain self-start"
                    />
                </div>

            </div>
        </section>
    );
};

export default OurStory;
