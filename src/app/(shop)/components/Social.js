const Social = () => {
    const img1 = "/images/social1.webp";
    const img2 = "/images/social2.webp";
    const img3 = "/images/social3.webp";
    const img4 = "/images/social4.webp";

    const x = "/icons/X.svg"
    const fb = "/icons/Fb.svg"
    const insta = "/icons/Insta.svg"

    return (
        <section className="horizontal-padding mt-[150px]">
            <div className=" grid grid-cols-4 gap-5">
                <div className="relative transition-transform duration-500 hover:scale-105 cursor-pointer">
                    <img src={img1} alt="Social Image 1" className="" />
                    <div className="absolute bottom-5 right-5.75 bg-[#FCF6F2] flex gap-2.5 px-9 py-4.5 rounded-tl-[20px]">
                        <img src={insta} alt="Instagram Icon" className="" />
                        <p className="title-des text-[#BF8F5F] opacity-100">@handicraftly</p>
                    </div>
                </div>
                <div className="relative transition-transform duration-500 hover:scale-105 cursor-pointer">
                    <img src={img2} alt="Social Image 2" className="" />
                    <div className="absolute bottom-5 right-5.75 bg-[#FCF6F2] flex gap-2.5 px-9 py-4.5 rounded-tl-[20px]">
                        <img src={x} alt="X Icon" className="" />
                        <p className="title-des text-[#BF8F5F] opacity-100">@handicraftly</p>
                    </div>
                </div>
                <div className="relative transition-transform duration-500 hover:scale-105 cursor-pointer">
                    <img src={img3} alt="Social Image 3" className="" />
                    <div className="absolute bottom-5 right-5.75 bg-[#FCF6F2] flex gap-2.5 px-9 py-4.5 rounded-tl-[20px]">
                        <img src={fb} alt="Facebook Icon" className="" />
                        <p className="title-des text-[#BF8F5F] opacity-100">@handicraftly</p>
                    </div>
                </div>
                <div className="relative transition-transform duration-500 hover:scale-105 cursor-pointer">
                    <img src={img4} alt="Social Image 4" className="" />
                    <div className="absolute bottom-5 right-5.75 bg-[#FCF6F2] flex gap-2.5 px-9 py-4.5 rounded-tl-[20px]">
                        <img src={insta} alt="Instagram Icon" className="" />
                        <p className="title-des text-[#BF8F5F] opacity-100">@handicraftly</p>
                    </div>
                </div>
            </div>

            <h2 className="link-explore mt-[150px]">Lorem Ipsum</h2>
            <p className="mt-4.5 title-des">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
            </p>
            <p className="mt-4.5 title-des">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
            </p>

        </section>
    )
}
export default Social;