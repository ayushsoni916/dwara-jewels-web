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
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-[#222222]">Our Collection</h2>
                    <p className="text-sm text-gray-500 font-medium">Showing 12 Products</p>
                </div>

                {/* Placeholder for Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="group cursor-pointer">
                            <div className="aspect-[4/5] bg-[#F9F6F2] rounded-2xl mb-4 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest">
                                    Product Image
                                </div>
                                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] font-bold text-[#B58E58]">VIEW</span>
                                </div>
                            </div>
                            <h3 className="text-[#222222] font-semibold text-lg">Diamond Eternity Ring</h3>
                            <p className="text-[#B58E58] font-bold mt-1">₹45,000</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ProductsPage;