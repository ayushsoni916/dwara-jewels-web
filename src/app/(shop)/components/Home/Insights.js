const updatesData = [
    {
        id: 1,
        tag: "TIPS",
        image: "/images/jewelry-1.png", 
        title: "How to Choose the Perfect Engagement Ring for Your Beloved One",
        description: "Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks.",
        author: "Jane Thompson",
        date: "May 10, 2023"
    },
    {
        id: 2,
        tag: "TIPS",
        image: "/images/jewelry-2.png", 
        title: "How to Choose the Perfect Engagement Ring for Your Beloved One",
        description: "Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks.",
        author: "Jane Thompson",
        date: "May 10, 2023"
    }
];

const Insights = () => {
    const exploreArrow = "/icons/ExploreArrow.svg";
    
    return (
        <section className="w-full">
            {/* Header */}
            <div>
                <h2 className="text-[#BF8F5F] heading-tag text-sm sm:text-base">INSIGHTS</h2>
                <h1 className="heading-main mt-2 text-3xl sm:text-4xl lg:text-[40px]">
                    Latest Updates
                </h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3 lg:mt-4">
                    <p className="heading-des text-sm sm:text-base text-gray-600">
                        Discover our handpicked exquisite jewelry
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group w-max">
                        <p className="link-explore text-sm sm:text-base group-hover:text-[#BF8F5F] transition-colors">
                            Explore More
                        </p>
                        <img 
                            src={exploreArrow} 
                            alt="Explore Arrow" 
                            className="w-5 sm:w-6 transition-transform group-hover:translate-x-1" 
                        />
                    </div>
                </div>
            </div>

            {/* Blog List Section */}
            <div className="flex flex-col gap-8 lg:gap-12 mt-8 lg:mt-[44px]">
                {updatesData.map((item) => (
                    <div 
                        key={item.id} 
                        className="flex flex-col sm:flex-row gap-5 sm:gap-6 lg:gap-8 items-stretch group cursor-pointer"
                    >
                        {/* Image Container */}
                        <div className="overflow-hidden shrink-0 rounded-lg sm:rounded-none">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-48 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-[225px] lg:h-[216px] object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        {/* Content Container */}
                        <div className="flex flex-grow flex-col justify-between py-1 sm:py-0">
                            <div>
                                <span className="heading-tag font-normal leading-4 text-xs sm:text-sm">
                                    {item.tag}
                                </span>

                                <h3 className="title-main mt-2 leading-tight sm:leading-7 text-lg sm:text-xl group-hover:text-[#BF8F5F] transition-colors">
                                    {item.title}
                                </h3>

                                <p className="title-des mt-2 lg:mt-3 leading-relaxed text-sm sm:text-base text-gray-600 line-clamp-3 sm:line-clamp-none">
                                    {item.description}
                                </p>
                            </div>

                            {/* Footer Meta Info */}
                            <div className="flex items-center gap-3 font-sans text-xs sm:text-sm text-gray-400 mt-4 sm:mt-0">
                                <span>{item.author}</span>
                                <span className="h-3 sm:h-4 w-px bg-gray-300"></span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Insights;