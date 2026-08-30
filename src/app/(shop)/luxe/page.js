import LuxeCategoriesGrid from '../components/Luxe/LuxeCategoriesGrid';
import LuxeHero from '../components/Luxe/LuxeHero';
import LuxeNewArrivalsSection from '../components/Luxe/LuxeNewArrivalsSection';
import LuxeRecentlyViewed from '../components/Luxe/LuxeRecentlyViewed';
import LuxeSplitBanner from '../components/Luxe/LuxeSplitBanner';
import LuxeTestimonials from '../components/Luxe/LuxeTestimonials';
import LuxeTrendingProducts from '../components/Luxe/LuxeTrendingProducts';

export const metadata = {
    title: 'Luxe Collection | Dwara Jewels',
    description: 'Fine Gold & Silver Jewellery, designed to shine beyond generations.',
};

export default function LuxePage() {
    return (
        <main
            className="min-h-screen flex flex-col w-full selection:bg-[#E5D3C4] selection:text-black"
            // Applied the global Luxe gradient here
            style={{ background: 'radial-gradient(69.72% 78.08% at 47.07% 0%, #1F2A40 0%, #0C0E17 100%)' }}
        >
            <LuxeHero />
            <LuxeTrendingProducts />
            {/* <LuxeCategoriesGrid/> */}
            {/* <LuxeRecentlyViewed /> */}
            <LuxeSplitBanner
                title="The Nocturnal Pavé"
                collectionId="6a93f7d8e98af8245969c401"
                imagePosition="left"
                backImage="/images/col1.png"
                frontImage="/images/col2.png"
                description='A modern, bold collection featuring dark metallic finishes, geometric structures, and deep crimson rubies designed for avant-garde statement pieces.'
            />
            <LuxeNewArrivalsSection/>
           
            <LuxeSplitBanner
                title="The Celestial Heritage"
                collectionId="6a93f7cce98af8245969c3fd"
                imagePosition="right"
                backImage="/images/col3.png"
                frontImage="/images/col4.webp"
                description="A royal, opulent collection crafted in heavy gold with intricate polki diamonds, vibrant teal gemstones, and delicate pearl drops for timeless bridal elegance."
            />
             <LuxeRecentlyViewed />
            <LuxeTestimonials />

            {/* Future components like LuxeSplitBanner will go here */}
        </main>
    );
}