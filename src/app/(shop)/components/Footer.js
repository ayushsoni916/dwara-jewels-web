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
                        <div className="relative w-48 h-12 -mt-2">
                            <Image src="/images/LogoNameFoot.svg" alt="Dwara Jewels" fill className="object-contain" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Image src="/icons/Loc.svg" alt="Location" width={16} height={16} className="mt-1" />
                                <p className="text-[13px] lg:text-[15px]">57A, Gayatri Nagar 2nd, Sanganer, Jaipur, 302029</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image src="/icons/Call.svg" alt="Phone" width={16} height={16} />
                                <p className="text-[13px] lg:text-[15px]">+91 6377584487</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image src="/icons/Email.svg" alt="Email" width={16} height={16} />
                                <p className="text-[13px] lg:text-[15px]">info@dwarajewels.com</p>
                            </div>
                        </div>
                    </div>



                    <FooterSection title="Products" links={[
                        { name: "Earrings", href: "/category?category=6acd0a05b2210243220ab66f" },
                        { name: "Chain Pendant", href: "/category?category=6acd0a20b2210243220ab673" },
                        { name: "Rings", href: "/category?category=6acd09e9b2210243220ab66b" },
                        { name: "Bracelet", href: "/category?category=6acd0a8db2210243220ab677" },
                        { name: "Anklet", href: "/category?category=6acfbe73c0e1a6df28d8b114" },
                    ]} />




                    <FooterSection title="Company" links={[
                        { name: "About Us", href: "/about" },
                        { name: "Terms & Conditions", href: "/terms-and-conditions" },
                        { name: "Warranty Policy", href: "/warranty-policy" },
                        { name: "Return & Exchange Policy", href: "/return-and-exchange-policy" },
                        { name: "Cancellation Policy", href: "/cancellation-policy" },
                        { name: "Gemstone Policy", href: "/gemstone-policy" },
                    ]} />


                    <FooterSection title="Account" links={[
                        { name: "Orders", href: "/account/orders" },
                        { name: "Wishlist", href: "/account/wishlist" },
                        // { name: "Addresses", href: "/account/address" }
                    ]} />


                    <FooterSection title="Support" links={[
                        { name: "FAQs", href: "/faq" },
                        { name: "Customer Support", href: "/account/support" },
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

                    <li>
                        <Link href="/privacy" className="hover:text-brand-gold">
                            Privacy Policy |
                        </Link>
                    </li>
                    <li>
                        <Link href="/terms-and-conditions" className="hover:text-brand-gold">
                            Terms & Conditions |
                        </Link>
                    </li>
                    <li>
                        <Link href="/sitemap.xml" className="hover:text-brand-gold">
                            Sitemap
                        </Link>
                    </li>

                </ul>


                <div className="flex items-center gap-5 lg:gap-7">
                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/dwara_jewels?utm_source=qr&mdxt=MXRtb3V1YWh4MWh0cA=="
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Dwara Jewels Instagram"
                        className="hover:opacity-70 transition-opacity"
                    >
                        <Image
                            src="/icons/Insta.svg"
                            alt="Instagram"
                            width={24}
                            height={24}
                            className="object-contain"
                        />
                    </a>

                    {/* Google Play Store */}
                    <a
                        href="https://play.google.com/store/apps/details?id=com.dwarajewelsapp"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Dwara Jewels on Google Play"
                        className="text-[#BF8F5F] hover:opacity-70 transition-opacity"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M4 2.5L20 12L4 21.5V2.5Z" />
                            <path d="M4 2.5L14 15.5" />
                            <path d="M4 21.5L14 8.5" />
                        </svg>
                    </a>

                    {/* Apple App Store */}
                    <a
                        href="https://apps.apple.com/us/app/dwara-jewels/id6790142702"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Dwara Jewels on the App Store"
                        className="text-[#BF8F5F] hover:opacity-70 transition-opacity"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M8 3L17 20" />
                            <path d="M16 3L7 20" />
                            <path d="M5 15H19" />
                        </svg>
                    </a>
                </div>


                {/* <div className="flex gap-4 lg:gap-8.25">
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
                </div> */}
            </div>
        </footer>
    );
}