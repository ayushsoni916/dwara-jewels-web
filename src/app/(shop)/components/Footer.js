"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const FooterSection = ({ title, links }) => (
        <div className="border-b border-[#FFFFFF6B] lg:border-none">
            <button
                onClick={() => toggleSection(title)}
                className="w-full flex items-center justify-between py-4 lg:py-0 lg:cursor-default"
            >
                <h4 className="font-semibold lg:font-bold font-sans text-[16px] lg:text-[24px] text-[#BF8F5F] lg:mb-4">
                    {title}
                </h4>
                {/* Arrow icon only visible on mobile */}
                <span className={`lg:hidden transition-transform duration-300 ${openSection === title ? 'rotate-180' : ''}`}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1L6 6L11 1" stroke="#BF8F5F" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </span>
            </button>

            <ul className={`space-y-2 text-[12px] lg:text-[16px] leading-6 text-[#222222] transition-all duration-300 overflow-hidden 
                ${openSection === title ? 'max-h-60 pb-4 opacity-100' : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100'}`}
            >
                {links.map((link) => (
                    <li key={link.name}>
                        <Link href={link.href} className="hover:text-brand-gold">{link.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );


    return (
        <footer className="mt-20 pb-8 mx-7.5 lg:mx-42">
            <div className="bg-[#F2DFCE]">
                {/* N E W S L E T T E R */}
                <div className="pt-9.25 lg:pt-16.75 px-5.25 lg:px-14.5 border-b border-[#FFFFFF] mb-14 pb-15">
                    <h1 className="text-[#BF8F5F] font-sans text-[12px] lg:text-[16px] leading-6">
                        N E W S L E T T E R
                    </h1>
                    <div className="flex-col lg:flex lg:flex-row lg:justify-between">
                        <div className="flex-1">
                            <h1 className="text-[#222222] font-serif text-[24px] lg:text-[40px] leading-14 me-2">
                                Get Monthly Updates
                            </h1>
                        </div>
                        <div className="flex-1 ">
                            <form className="relative flex items-center border-b border-[#222222] pb-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="bg-transparent w-full text-sm lg:text-base outline-none text-[#222222] placeholder:text-[#222222]/50 py-2 font-sans"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="ml-4 hover:translate-x-1 transition-transform duration-300"
                                    aria-label="Subscribe to newsletter"
                                >
                                    {/* Using an arrow icon to match your screenshot */}
                                    <svg
                                        width="30"
                                        height="15"
                                        viewBox="0 0 30 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1 7.5H28.5M28.5 7.5L22 1M28.5 7.5L22 14"
                                            stroke="#BF8F5F"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                {/* MAIN LINKS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8 px-6 lg:px-14 text-[#222222]">
                    {/* Brand Info */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="relative w-48 h-12">
                            <Image src="/images/LogoNameFoot.svg" alt="Dwara Jewels" fill className="object-contain" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Image src="/icons/Loc.svg" alt="Location" width={16} height={16} className="mt-1" />
                                <p className="text-[13px] lg:text-[15px]">38 A, Vasundhara Colony, Tonk Road, Jaipur - 302018</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image src="/icons/Call.svg" alt="Phone" width={16} height={16} />
                                <p className="text-[13px] lg:text-[15px]">+91 99999 99999</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image src="/icons/Email.svg" alt="Email" width={16} height={16} />
                                <p className="text-[13px] lg:text-[15px]">info@dwarajewels.com</p>
                            </div>
                        </div>
                    </div>

                    <FooterSection title="Products" links={[
                        { name: "Earrings", href: "/category/earrings" },
                        { name: "Necklace", href: "/category/necklace" },
                        { name: "Bracelet", href: "/category/bracelet" },
                        { name: "Ring", href: "/category/rings" },
                        { name: "Men's Jewelry", href: "/category/mens" }
                    ]} />

                    <FooterSection title="Company" links={[
                        { name: "About Us", href: "/about" },
                        { name: "Testimonials", href: "/reviews" },
                        { name: "Best Seller", href: "/best-sellers" },
                        { name: "Terms & Condition", href: "/terms" }
                    ]} />

                    <FooterSection title="Account" links={[
                        { name: "Orders", href: "/account/orders" },
                        { name: "Wishlist", href: "/account/wishlist" },
                        { name: "Addresses", href: "/account/address" }
                    ]} />

                    <FooterSection title="Support" links={[
                        { name: "Size Charts", href: "/size-guide" },
                        { name: "Help Centre", href: "/help" },
                        { name: "Privacy Policy", href: "/privacy" },
                        { name: "FAQs", href: "/faqs" }
                    ]} />
                </div>
                {/* <img src="/images/FooterWeb.svg" alt="Dwara Jewels Icon" className="w-full h-full object-contain" /> */}
                {/* JAIPUR SKYLINE SECTION */}
                <div className="w-full h-auto mt-4 overflow-hidden">
                    {/* Mobile Image: Shown by default, hidden on Large (lg) screens */}
                    <div className="block lg:hidden w-full relative h-[100px]">
                        <Image
                            src="/images/FooterMobile.svg"
                            alt="Dwara Jewels Jaipur Heritage Mobile"
                            fill
                            className="object-contain object-bottom"
                            loading="lazy"
                        />
                    </div>

                    {/* Desktop Image: Hidden by default, shown on Large (lg) screens */}
                    <div className="hidden lg:block w-full">
                        <Image
                            src="/images/FooterWeb.svg"
                            alt="Dwara Jewels Jaipur Heritage Desktop"
                            width={1440}
                            height={200}
                            className="w-full h-auto object-contain"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-10.25 text-center  flex items-center justify-between">
                <ul className="space-y-2 text-[9px] lg:text-[16px] text-[#222222] font-serif flex gap-1">
                    <li><a href="/shipping" className="hover:text-brand-gold">Privacy Policy  |</a></li>
                    <li><a href="/returns" className="hover:text-brand-gold">Terms & Condition  |</a></li>
                    <li><a href="/contact" className="hover:text-brand-gold">Sitemap</a></li>
                </ul>
                <div className="flex gap-4 lg:gap-8.25">
                    <Image
                        src="/icons/Wp.svg"
                        alt="Whatsapp"
                        width={22}
                        height={22}
                        className="object-contain cursor-pointer h-4.25 w-4.25 lg:h-5.5 lg:w-5.5"
                    />
                    <Image
                        src="/icons/Insta.svg"
                        alt="Instagram"
                        width={20}
                        height={20}
                        className="object-contain cursor-pointer h-4.25 w-4.25 lg:h-5.5 lg:w-5.5"
                    />
                    <Image
                        src="/icons/Fb.svg"
                        alt="Facebook"
                        width={11}
                        height={20}
                        className="object-contain cursor-pointer h-4 w-4 lg:h-5.5 lg:w-5.5"
                    />
                    <Image
                        src="/icons/X.svg"
                        alt="Twitter"
                        width={18}
                        height={18}
                        className="object-contain cursor-pointer h-4.25 w-4.25 lg:h-5.5 lg:w-5.5"
                    />
                </div>
            </div>
        </footer>
    );
}