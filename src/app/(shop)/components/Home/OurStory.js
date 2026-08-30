const OurStory = () => {
    const exploreArrow = "/icons/ExploreArrow.svg";
    const flower = "/icons/Flower.svg";
    const img1 = "/images/ImgStory1.webp";
    const img2 = "/images/ImgStory2.webp";
    
    return (
        <section className="horizontal-padding mt-16 md:mt-24 lg:mt-[100px] flex flex-col lg:grid lg:grid-cols-[1fr_1.3fr] gap-10 lg:gap-20">
            {/* Text Content */}
            <div className="flex flex-col justify-center">
                <h2 className="text-[#BF8F5F] heading-tag text-sm sm:text-base mb-2">OUR STORY</h2>
                <h1 className="heading-main text-3xl sm:text-4xl lg:text-5xl leading-tight">
                    Tradition Cared For<br />Since <span className="text-[36px] sm:text-[38px] md:text-[40px] lg:text-[44px] xl:text-[48px] font-medium">2016</span>
                </h1>
                <p className="link-explore mt-6 lg:mt-[40px] text-sm sm:text-base">
                    Lorem Ipsum is a simple dummy text of the
                </p>
                <p className="mt-4 heading-des text-sm sm:text-base text-gray-600">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged
                </p>
                <div className="flex items-center gap-3 cursor-pointer mt-8 lg:mt-[53px] group w-max">
                    <p className="link-explore text-sm sm:text-base group-hover:text-[#BF8F5F] transition-colors">Explore More</p>
                    <img 
                        src={exploreArrow} 
                        alt="Explore Arrow" 
                        className="w-5 lg:w-6 transition-transform group-hover:translate-x-1" 
                    />
                </div>
            </div>

            {/* Images Section */}
            <div className="flex w-full gap-4 sm:gap-8">
                {/* Left Image */}
                <div className="w-1/2">
                    <img 
                        src={img1} 
                        alt="Our Story Image 1" 
                        className="w-full h-[250px] sm:h-[350px] lg:h-[408px] object-cover rounded-md lg:rounded-none" 
                    />
                </div>
                
                {/* Right Image (Staggered) */}
                <div className="w-1/2 flex flex-col mt-8 sm:mt-12 lg:mt-15">
                    <img 
                        src={img2} 
                        alt="Our Story Image 2" 
                        className="w-full h-[150px] sm:h-[200px] lg:h-[217px] object-cover rounded-md lg:rounded-none" 
                    />
                    <img 
                        src={flower} 
                        alt="Flower" 
                        className="mt-6 lg:mt-[60px] h-10 lg:h-[60px] w-auto object-contain self-start" 
                    />
                </div>
            </div>
        </section>
    );
};

export default OurStory;