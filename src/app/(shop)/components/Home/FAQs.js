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
            {/* header */}
            <div>
                <h2 className="text-[#BF8F5F] heading-tag">QUESTIONS</h2>
                <h1 className="heading-main">Frequently Asked Questions (FaQ)</h1>
                <div className="flex justify-between mt-2">
                    <p className="heading-des">
                        Discover our handpicked exquisite jewelry
                    </p>
                    <div className="flex items-center gap-3 cursor-pointer">
                        <p className="link-explore">Explore More</p>
                        <img src={exploreArrow} alt="Explore Arrow" className="w-6" />
                    </div>
                </div>
            </div>
            {/* Accordion Section */}
            <div className="flex flex-col gap-4 mt-14.5">
                {faqData.map((item) => (
                    <div
                        key={item.id}
                        className={`transition-all duration-300 overflow-hidden ${openId === item.id ? "bg-[#FCF6F2] p-8" : "bg-white px-8 py-4"
                            }`}
                    >
                        <div
                            className="flex items-center gap-6 cursor-pointer"
                            onClick={() => setOpenId(openId === item.id ? null : item.id)}
                        >
                            {/* Icon: Minus if open, Plus if closed */}
                            <span className="text-[#B58E58] text-2xl font-light w-6">
                                {openId === item.id ? "—" : "+"}
                            </span>

                            <h4 className="title-main">{item.question}</h4>
                        </div>

                        {/* Answer Content */}
                        <div
                            className={`grid transition-all duration-300 ease-in-out ${openId === item.id ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                                }`}
                        >
                            <div className="overflow-hidden">
                                <p className="title-des ml-12">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default FAQs;