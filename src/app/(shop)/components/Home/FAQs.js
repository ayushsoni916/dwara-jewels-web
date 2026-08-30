'use client';
import { useState } from "react";

const faqData = [
    {
        id: 1,
        question: "Are your products certified and of high quality?",
        answer: "Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks. We also provide certificates of authenticity for our diamond and gemstone jewelry."
    },
    {
        id: 2,
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, UPI, and bank transfers to make your shopping experience seamless."
    },
    {
        id: 3,
        question: "Do you offer customization options for jewelry?",
        answer: "Absolutely. We specialize in bespoke designs. You can consult with our artisans to create a unique piece tailored to your vision."
    }
];

const FAQs = () => {
    const [openId, setOpenId] = useState(1);
    const exploreArrow = "/icons/ExploreArrow.svg";

    return (
        <section className="w-full">
            {/* Header */}
            <div>
                <h2 className="text-[#BF8F5F] heading-tag text-sm sm:text-base">QUESTIONS</h2>
                <h1 className="heading-main mt-2 text-3xl sm:text-4xl lg:text-[40px]">
                    Frequently Asked Questions (FaQ)
                </h1>
                
                {/* Flex-col on mobile, Flex-row on tablet+ */}
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

            {/* Accordion Section */}
            <div className="flex flex-col gap-3 sm:gap-4 mt-8 lg:mt-[58px]">
                {faqData.map((item) => (
                    <div
                        key={item.id}
                        className={`transition-all duration-300 overflow-hidden rounded-lg sm:rounded-none ${
                            openId === item.id 
                                ? "bg-[#FCF6F2] p-4 sm:p-6 lg:p-8" 
                                : "bg-white px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4"
                        }`}
                    >
                        <div
                            className="flex items-center gap-4 sm:gap-6 cursor-pointer"
                            onClick={() => setOpenId(openId === item.id ? null : item.id)}
                        >
                            {/* Icon: Minus if open, Plus if closed */}
                            <span className="text-[#B58E58] text-xl sm:text-2xl font-light w-5 sm:w-6 flex-shrink-0 text-center">
                                {openId === item.id ? "—" : "+"}
                            </span>

                            <h4 className="title-main text-base sm:text-lg">{item.question}</h4>
                        </div>

                        {/* Answer Content */}
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${
                                openId === item.id 
                                    ? "grid-rows-[1fr] opacity-100 mt-2 sm:mt-3" 
                                    : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden">
                                <p className="title-des ml-9 sm:ml-12 text-sm sm:text-base text-gray-600">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQs;