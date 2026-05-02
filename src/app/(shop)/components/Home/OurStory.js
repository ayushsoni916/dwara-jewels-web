const OurStory = () => {
    const exploreArrow = "/icons/ExploreArrow.svg";
    const flower = "/icons/Flower.svg";
    const img1 = "/images/ImgStory1.webp";
    const img2 = "/images/ImgStory2.webp";
    return (
        <section className="horizontal-padding grid  grid-cols-[1fr_1.3fr] mt-[100px] gap-20">
            <div>
                <h2 className="text-[#BF8F5F] heading-tag">OUR STORY</h2>
                <h1 className="heading-main">Tradition Cared For<br />Since <span className="text-[36px] sm:text-[38px] md:text-[40px] lg:text-[44px] xl:text-[48px] font-medium">2016</span></h1>
                <p className="link-explore mt-[40px]">Lorem Ipsum is a simple dummy text of the</p>
                <p className="mt-4 heading-des">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged</p>
                <div className="flex items-center gap-3 cursor-pointer mt-[53px]">
                    <p className="link-explore">Explore More</p>
                    <img src={exploreArrow} alt="Explore Arrow" className="w-6" />
                </div>
            </div>
            <div className="flex w-full gap-8">
                <img src={img1} alt="Our Story Image 1" className="h-102" />
                <div className="mt-15">
                    <img src={img2} alt="Our Story Image 2" className="h-54.25" />
                    <img src={flower} alt="Flower" className="mt-[60px] h-[60px]" />
                </div>
            </div>
        </section>
    )
}
export default OurStory;