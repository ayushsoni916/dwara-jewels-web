const Collection = () => {

    const img1 = "/images/collection1.webp";
    const img2 = "/images/collection2.webp";
    const img3 = "/images/collection3.webp";

    return (
        <section className="horizontal-padding mt-[150px]">
            <img src={img1} alt="Collection Image 1" className="w-full h-auto mb-15 transition-transform duration-500 hover:scale-105 cursor-pointer" />
            <div className="flex flex-col md:flex-row gap-15 overflow-hidden h-[228px]">
                {/* First Image */}
                <div className="w-full md:w-1/2 aspect-[4/5] ">
                    <img
                        src={img2}
                        alt="Collection Image 2"
                        className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                    />
                </div>

                {/* Second Image */}
                <div className="w-full md:w-1/2 aspect-[4/5] ">
                    <img
                        src={img3}
                        alt="Collection Image 3"
                        className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                    />
                </div>
            </div>
        </section>
    )
}
export default Collection;