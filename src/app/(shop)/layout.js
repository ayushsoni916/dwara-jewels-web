import { Playfair_Display, DM_Sans } from "next/font/google";
import "./../globals.css";
import NavigationWrapper from "@/app/(shop)/components/NavigationWrapper";

// Font for luxury headings (Serif)
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
});

// Font for readable body text (Sans)
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: 'swap',
});

/** @type {import('next').Metadata} */
export const metadata = {
  metadataBase: new URL('https://dwarajewels.com'), // Replace with your actual domain
  title: {
    default: "Dwara Jewels | Handcrafted Gold & Diamond Jewelry India",
    template: "%s | Dwara Jewels",
  },
  description: "Exquisite handcrafted 18K and 24K gold jewelry, certified diamonds, and traditional Jaipur craftsmanship. Shop rings, necklaces, and more at Dwara Jewels.",
  keywords: ["Luxury Jewelry India", "Gold Jewelry Jaipur", "Diamond Rings Online", "Dwara Jewels"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Dwara Jewels | Luxury Handcrafted Jewelry",
    description: "Discover timeless elegance and certified purity in every piece.",
    url: 'https://dwarajewels.com',
    siteName: 'Dwara Jewels',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for Local Business/Organization SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": "Dwara Jewels",
    "image": "https://dwarajewels.com/logo.png", // Ensure this exists in /public
    "@id": "https://dwarajewels.com",
    "url": "https://dwarajewels.com",
    "telephone": "+91-9828250500",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "38 A, Vasundhara Colony Gopalpura Bypass, Tonk Road",
      "addressLocality": "Jaipur",
      "addressRegion": "RJ",
      "postalCode": "302018",
      "addressCountry": "IN"
    },
    "priceRange": "$$$"
  };

  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${dmSans.className} antialiased font-sans text-brand-dark`}>
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
      </body>
    </html>
  );
}