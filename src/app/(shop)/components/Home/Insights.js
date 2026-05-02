const updatesData = [
    {
        id: 1,
        tag: "TIPS",
        image: "/images/jewelry-1.png", // Replace with your actual path
        title: "How to Choose the Perfect Engagement Ring for Your Beloved One",
        description: "Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks.",
        author: "Jane Thompson",
        date: "May 10, 2023"
    },
    {
        id: 2,
        tag: "TIPS",
        image: "/images/jewelry-2.png", // Replace with your actual path
        title: "How to Choose the Perfect Engagement Ring for Your Beloved One",
        description: "Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks.",
        author: "Jane Thompson",
        date: "May 10, 2023"
    }
];
const Insights = () => {
    const exploreArrow = "/icons/ExploreArrow.svg";
    return (
        <section className=" w-full">
            {/* header */}
            <div>
                <h2 className="text-[#BF8F5F] heading-tag">INSIGHTS</h2>
                <h1 className="heading-main">Latest Updates</h1>
                <div className="flex justify-between items-center mt-2">
                    <p className="heading-des">
                        Discover our handpicked exquisite jewelry
                    </p>
                    <div className="flex items-center gap-3 cursor-pointer">
                        <p className="link-explore">Explore More</p>
                        <img src={exploreArrow} alt="Explore Arrow" className="w-6" />
                    </div>
                </div>
            </div>
            {/* Blog List Section */}
            <div className="flex flex-col gap-12 mt-[44px]">
                {updatesData.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row gap-8  items-stretch">
                        {/* Image Container */}
                        <div className=" overflow-hidden shrink-0">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-52 sm:w-44 sm:h-40 md:w-52 md:h-48 lg:w-56.25 lg:h-54 object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>

                        {/* Content Container */}
                        <div className="flex flex-grow flex-col justify-between ">
                            <div>
                                <span className="heading-tag font-normal leading-4">{item.tag}</span>

                                <h3 className="title-main mt-2 leading-7">
                                    {item.title}
                                </h3>

                                <p className="title-des mt-2 leading-6.5">
                                    {item.description}
                                </p>
                            </div>

                            {/* Footer Meta Info */}
                            <div className="flex items-center gap-3 font-sans text-sm text-gray-400 ">
                                <span>{item.author}</span>
                                <span className="h-4 w-px bg-gray-300"></span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Insights; 