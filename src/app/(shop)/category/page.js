'use client';
import { useState } from "react";
import ProductFilterSidebar from "./components/ProductFilterSidebar";

// Sample Categories matching your Mongoose Schema structure
const sampleCategories = [
    { _id: "cat_1", name: "Rings", isLuxeCategory: false },
    { _id: "cat_2", name: "Necklaces", isLuxeCategory: true },
    { _id: "cat_3", name: "Bracelets", isLuxeCategory: false },
    { _id: "cat_4", name: "Earrings", isLuxeCategory: false },
    { _id: "cat_5", name: "Pendants", isLuxeCategory: true },
];

const ProductsPage = () => {
    const img1 = "/images/CatBanner.webp";
    const img2 = "/images/Rings.webp";
    const heart = "/icons/Heart.svg";
    const cart = "/icons/Cart.svg";

    const [activeFilters, setActiveFilters] = useState({
        category: '',
        maxPrice: 500000, // Adjusted for jewelry pricing
        metal: [],
        size: []
    });

    const clearFilters = () => {
        setActiveFilters({
            category: '',
            maxPrice: 500000,
            metal: [],
            size: []
        });
    };

    return (
        <div className="flex flex-col lg:flex-row  min-h-screen gap-10 horizontal-padding mt-[100px]">

            {/* Reusable Filter Sidebar */}
            <div className="w-full lg:w-[280px] shrink-0">
                <ProductFilterSidebar
                    categories={sampleCategories}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    onClearFilters={clearFilters}
                />
            </div>

            {/* Product Display Area */}
            <main className="flex-1">
                <img src={img1} alt="Collection Image 1" className="w-full h-auto mb-15 transition-transform duration-500 hover:scale-105 cursor-pointer" />

                <div className="flex mb-15 flex-col">
                    <h2 className="heading-main">Our Products</h2>
                    <div className="justify-between items-center mt-[36px]">
                        <p className="heading-des">Showing 12 Products</p>
                    </div>
                    <div className="bg-[#BF8F5F] h-px w-full mt-[28px]" />
                </div>

                {/* Placeholder for Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="group cursor-pointers mb-[60px]">
                            <div className="bg-[#F9F6F2] mb-6 overflow-hidden relative h-[275px] w-[275px]">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest">
                                    <img src={img2} alt={`Product ${item}`} className="object-contain p-6 transition-transform duration-500 group-hover:scale-110" />
                                </div>
                            </div>
                            <div className="flex justify-between pr-2">
                                <h3 className="title-main">Diamond Eternity Ring</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <img src={heart} alt="Wishlist" className="w-5 h-5 cursor-pointer transition-transform duration-300 hover:scale-125" />
                                    <img src={cart} alt="Add to Cart" className="w-5 h-5 cursor-pointer transition-transform duration-300 hover:scale-125" />
                                </div>
                            </div>
                            <p className="title-main mt-[15px]">₹45,000</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ProductsPage;