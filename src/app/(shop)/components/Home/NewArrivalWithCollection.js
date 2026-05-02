const NewArrivalWithCollection = () => {
    const collectionImg = '/images/Collection5.webp';
    return (
        <section className="horizontal-padding mt-50.5 grid grid-cols-[3fr_1fr] gap-6">
            <div>
                <h2 className="text-[#BF8F5F] heading-tag">NEW ARRIVAL</h2>
                <h1 className="heading-main">Beauty At Its Finest</h1>
                <div className="flex justify-between mt-2">
                    <p className="heading-des">
                        Discover our handpicked selection of exquisite jewelry pieces, curated
                    </p>
                    <div className="flex items-center gap-3 cursor-pointer">
                        <p className="link-explore">Explore More</p>
                        {/* <img src={exploreArrow} alt="Explore Arrow" className="w-6" /> */}
                    </div>
                </div>
            </div>
            <div className="transition-transform duration-500 hover:scale-105 cursor-pointer">
                <img src={collectionImg} alt="Collection" className="w-full h-full object-cover" />
            </div>
        </section>
    );
}
export default NewArrivalWithCollection;