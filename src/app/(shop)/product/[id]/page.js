import { notFound } from 'next/navigation';
import FaqInsight from "../../components/Home/FaqInsight";
import RecentlyViewed from "../../components/Home/RecentlyViewed";
import ProductAccordions from "./../components/ProductAccordions";
import ProductGallery from "./../components/ProductGallery";
import ProductHeader from "./../components/ProductHeader";
import RecentlyViewedTracker from '../../components/RecentlyViewedTracker';

// --- 1. Server-Side Data Fetching ---
async function getProduct(id) {
    try {
        const res = await fetch(`http://localhost:4500/api/product/${id}`, {
            // Using no-store temporarily so we don't cache 404 errors while testing
            cache: 'no-store' 
        });
        
        if (!res.ok) {
            console.error(`Backend returned status: ${res.status}`);
            return null;
        }
        
        const data = await res.json();
        return data.product; 
    } catch (error) {
        console.error("Error fetching single product:", error.message);
        return null;
    }
}

// --- 2. Dynamic SEO Metadata ---
export async function generateMetadata({ params }) {
    // AWAIT PARAMS (Required in Next.js 15+)
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.id);

    if (!product) {
        return {
            title: 'Product Not Found | Dwara Jewels',
            description: 'The requested jewelry piece could not be found.'
        };
    }

    const imageUrl = product.thumbnail || (product.images && product.images[0]) || '/placeholder.webp';

    return {
        title: `${product.title} | Dwara Jewels`,
        description: product.description || `Discover the exquisite ${product.title}.`,
        openGraph: {
            title: `${product.title} | Dwara Jewels`,
            images: [{ url: imageUrl, width: 800, height: 800 }],
        }
    };
}

// --- 3. Main Page Component ---
export default async function ProductPage({ params }) {
    // AWAIT PARAMS (Required in Next.js 15+)
    const resolvedParams = await params;
    const product = await getProduct(resolvedParams.id);

    // DEBUGGING UI: Instead of an instant 404, let's see what is failing
    if (!product) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Product</h1>
                <p>We could not fetch the product with ID: <strong>{resolvedParams.id}</strong></p>
                <p className="text-sm text-gray-500 mt-2">Check your terminal running Next.js for error logs.</p>
            </div>
        );
    }

    return (
        <main className="bg-white overflow-hidden">
            <RecentlyViewedTracker product={product} />
            
            <section className="py-12 lg:py-20 px-4 sm:px-8 lg:px-20 mx-auto max-w-[1440px]">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    
                    <div className="w-full lg:w-1/2 flex flex-col order-2 lg:order-1">
                        <ProductHeader product={product} />
                        <ProductAccordions product={product} />
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6 order-1 lg:order-2">
                        <ProductGallery images={product.images || []} thumbnail={product.thumbnail} />
                    </div>

                </div>
            </section>

            <RecentlyViewed />
            <FaqInsight />
            
        </main>
    );
}