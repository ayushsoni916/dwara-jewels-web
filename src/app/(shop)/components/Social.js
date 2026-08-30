const Social = () => {
    const img1 = "/images/social1.webp";
    const img2 = "/images/social2.webp";
    const img3 = "/images/social3.webp";
    const img4 = "/images/social4.webp";

    const x = "/icons/X.svg";
    const fb = "/icons/Fb.svg";
    const insta = "/icons/Insta.svg";

    // Grouping the data makes rendering cleaner and easier to maintain
    const socialPosts = [
        { img: img1, icon: insta, alt: "Instagram Icon" },
        { img: img2, icon: x, alt: "X Icon" },
        { img: img3, icon: fb, alt: "Facebook Icon" },
        { img: img4, icon: insta, alt: "Instagram Icon" },
    ];

    return (
        <section className="horizontal-padding mt-16 md:mt-24 lg:mt-[150px]">
            {/* Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {socialPosts.map((post, index) => (
                    <div 
                        key={index} 
                        className="relative transition-transform duration-500 hover:scale-105 cursor-pointer overflow-hidden rounded-lg lg:rounded-none"
                    >
                        <img 
                            src={post.img} 
                            alt={`Social Image ${index + 1}`} 
                            className="w-full h-auto object-cover aspect-square sm:aspect-auto" 
                        />
                        {/* Scaled padding and positioning for smaller screens */}
                        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 lg:bottom-5 lg:right-[23px] bg-[#FCF6F2] flex items-center gap-1.5 md:gap-2.5 px-4 py-2 md:px-6 md:py-3 lg:px-9 lg:py-4.5 rounded-tl-[16px] lg:rounded-tl-[20px] rounded-br-lg lg:rounded-br-none shadow-sm lg:shadow-none">
                            <img 
                                src={post.icon} 
                                alt={post.alt} 
                                className="w-4 h-4 md:w-5 md:h-5 lg:w-auto lg:h-auto" 
                            />
                            <p className="title-des text-[#BF8F5F] opacity-100 text-xs md:text-sm lg:text-base m-0">
                                @handicraftly
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Adjusted top margins for text sections based on screen size */}
            <h2 className="link-explore mt-16 md:mt-24 lg:mt-[150px]">Lorem Ipsum</h2>
            
            <p className="mt-4 md:mt-4.5 title-des text-sm md:text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
            </p>
            
            <p className="mt-4 md:mt-4.5 title-des text-sm md:text-base">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
            </p>
        </section>
    );
};

export default Social;