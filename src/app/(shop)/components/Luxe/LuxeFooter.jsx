"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LuxeFooter() {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    const FooterSection = ({ title, links }) => (
        <div className="border-b border-white/10 lg:border-none">
            <button
                onClick={() => toggleSection(title)}
                className="w-full flex items-center justify-between py-4 lg:py-0 lg:cursor-default"
            >
                <h4 className="font-semibold lg:font-bold font-sans text-[16px] lg:text-[20px] text-[#D6B693] lg:mb-4">
                    {title}
                </h4>
                {/* Arrow icon only visible on mobile */}
                <span className={`lg:hidden transition-transform duration-300 ${openSection === title ? 'rotate-180' : ''}`}>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 1L6 6L11 1" stroke="#D6B693" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </span>
            </button>

            <ul className={`space-y-2 text-[12px] lg:text-[14px] leading-6 text-white/70 font-sans transition-all duration-300 overflow-hidden 
                ${openSection === title ? 'max-h-60 pb-4 opacity-100' : 'max-h-0 lg:max-h-none opacity-0 lg:opacity-100'}`}
            >
                {links.map((link) => (
                    <li key={link.name}>
                        <Link href={link.href} className="hover:text-[#E5D3C4] transition-colors">{link.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <footer className="relative w-full pt-16  overflow-hidden bg-[#0C0E17]">
            {/* Top Gradient Border Line */}
            <div className="absolute top-0 inset-x-0 h-[1px] w-full bg-gradient-to-r from-transparent via-[#F2DFCE]/50 to-transparent z-20"></div>

            {/* Starry Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-50">
                <Image
                    src="/images/Background.png"
                    alt="Luxury Starry Background"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20">

                {/* N E W S L E T T E R */}
                <div className="border-b border-white/10 mb-14 pb-12 lg:pb-16">
                    <h1 className="text-[#D6B693] font-sans font-semibold tracking-[0.3em] uppercase text-[12px] lg:text-[14px] mb-4 lg:mb-2">
                        Newsletter
                    </h1>
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
                        <div className="flex-1">
                            <h1 className="text-white font-serif text-[28px] lg:text-[40px] leading-tight">
                                Get Monthly Updates
                            </h1>
                        </div>
                        <div className="flex-1 w-full lg:max-w-md">
                            <form className="relative flex items-center border-b border-white/30 pb-2 transition-colors focus-within:border-[#D6B693]">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="bg-transparent w-full text-sm lg:text-base outline-none text-white placeholder:text-white/40 py-2 font-sans"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="ml-4 hover:translate-x-1 transition-transform duration-300"
                                    aria-label="Subscribe to newsletter"
                                >
                                    <svg width="30" height="15" viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 7.5H28.5M28.5 7.5L22 1M28.5 7.5L22 14" stroke="#D6B693" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* MAIN LINKS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 text-white">
                    {/* Brand Info */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="relative w-48 h-12  -mt-2">
                            {/* Inverting standard logo to be white for dark mode */}
                            <Image src="/images/LuxeLogo.webp" alt="Dwara Jewels" fill className="object-contain" />
                        </div>
                        <div className="space-y-4 text-white/70 font-sans">
                            <div className="flex items-start gap-3">
                                <Image src="/icons/Loc.svg" alt="Location" width={16} height={16} className="mt-1 brightness-0 invert opacity-70" />
                                <p className="text-[13px] leading-relaxed">57A, Gayatri Nagar 2nd, Sanganer, Jaipur, 302029</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image src="/icons/Call.svg" alt="Phone" width={16} height={16} className="brightness-0 invert opacity-70" />
                                <p className="text-[13px]">+91 6377584487</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image src="/icons/Email.svg" alt="Email" width={16} height={16} className="brightness-0 invert opacity-70" />
                                <p className="text-[13px]">info@dwarajewels.com</p>
                            </div>
                        </div>
                    </div>


                    <FooterSection title="Products" links={[
                        { name: "Earrings", href: "/category?category=6acd0a05b2210243220ab66f&luxe=true" },
                        { name: "Chain Pendant", href: "/category?category=6acd0a20b2210243220ab673&luxe=true" },
                        { name: "Rings", href: "/category?category=6acd09e9b2210243220ab66b&luxe=true" },
                        { name: "Bracelet", href: "/category?category=6acd0a8db2210243220ab677&luxe=true" },
                        { name: "Anklet", href: "/category?category=6acfbe73c0e1a6df28d8b114&luxe=true" },
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
                    ]} />

                    <FooterSection title="Support" links={[
                        { name: "FAQs", href: "/faq" },
                        { name: "Customer Support", href: "/account/support" },
                    ]} />

                </div>

                {/* JAIPUR SKYLINE SECTION (Inverted for Dark Theme) */}
                <div className="w-full h-auto mt-4 overflow-hidden opacity-30 pointer-events-none">
                    <div className="block lg:hidden w-full relative h-[100px]">
                        <Image
                            src="/images/LuxeFooterMob.svg"
                            alt="Dwara Jewels Jaipur Heritage"
                            fill
                            className="object-contain object-bottom brightness-0 invert"
                            loading="lazy"
                        />
                    </div>
                    <div className="hidden lg:block w-full relative h-[200px]">
                        <Image
                            src="/images/LuxeFooter.svg"
                            alt="Dwara Jewels Jaipur Heritage"
                            fill
                            className="object-contain object-bottom brightness-0 invert"
                            loading="lazy"
                        />
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="relative z-10 border-t border-white/10 py-6">
                <div className="max-w-7xl mx-auto px-6 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-4">

                    <ul className="flex items-center gap-2 text-[11px] lg:text-[13px] text-white/50 font-sans tracking-wide">
                        <li>
                            <Link href="/privacy" className="hover:text-[#D6B693] transition-colors">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>|</li>
                        <li>
                            <Link href="/terms-and-conditions" className="hover:text-[#D6B693] transition-colors">
                                Terms & Conditions
                            </Link>
                        </li>
                        <li>|</li>
                        <li>
                            <Link href="/sitemap.xml" className="hover:text-[#D6B693] transition-colors">
                                Sitemap
                            </Link>
                        </li>
                    </ul>



                    <div className="flex items-center gap-5 lg:gap-7">
                        {/* Instagram */}
                        <a
                            href="https://www.instagram.com/dwara_jewels"
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
                                className="object-contain brightness-0 invert"
                            />
                        </a>

                        {/* Google Play Store */}
                        <a
                            href="https://play.google.com/store/apps/details?id=com.dwarajewelsapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Dwara Jewels on Google Play"
                            className="text-white hover:opacity-70 transition-opacity"
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
                            className="text-white hover:opacity-70 transition-opacity"
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

                </div>
            </div>

        </footer>
    );
}