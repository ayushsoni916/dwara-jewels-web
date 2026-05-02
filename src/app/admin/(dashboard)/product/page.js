"use client";
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Eye, Edit3, Trash2, Plus, Calendar } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const ProductPage = () => {
    // --- State Management ---
    const [isLuxeView, setIsLuxeView] = useState(false); // Toggle between Normal and Luxe
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- Inline API Functions ---
    const fetchCategoryApi = async (type = 'normal') => {
        // type is 'luxury' or 'normal'
        const response = await axios.get(`http://localhost:4500/api/category?type=${type}`);
        return response.data;
    };

    const fetchProductApi = async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(`http://localhost:4500/api/product?${queryString}`);
        return response.data;
    };

    // --- API Calls (Simulated based on your functions) ---
   // --- Logic: Load Categories when Toggle changes ---
    const loadCategories = async () => {
        try {
            const type = isLuxeView ? 'luxury' : 'normal';
            const data = await fetchCategoryApi(type); 
            if (data.success) {
                setCategories(data.categories);
                // Set first category as default if available, otherwise clear products
                if (data.categories.length > 0) {
                    setSelectedCategory(data.categories[0]._id);
                } else {
                    setSelectedCategory(null);
                    setProducts([]);
                }
            }
        } catch (error) {
            console.error("Category Fetch Error:", error);
        }
    };

    // --- Logic: Load Products when Category changes ---
    const loadProducts = async () => {
        if (!selectedCategory) return;
        setLoading(true);
        try {
            const data = await fetchProductApi({ category: selectedCategory });
            if (data.success) setProducts(data.products);
        } catch (error) {
            console.error("Product Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, [isLuxeView]);

    useEffect(() => {
        loadProducts();
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-[#FDFBF9] px-8 py-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-[#222222] text-2xl font-bold font-serif">Product List</h1>
                <div className="flex items-center gap-4">
                    {/* Luxury Toggle Switch */}
                    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                        <button
                            onClick={() => setIsLuxeView(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isLuxeView ? 'bg-[#B58E58] text-white' : 'text-gray-400 hover:text-[#B58E58]'}`}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => setIsLuxeView(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isLuxeView ? 'bg-[#222222] text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            Luxury
                        </button>
                    </div>
                    <Link href="/admin/add-product" className="bg-[#B58E58] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#9a7645] transition-all">
                        <Plus size={18} /> New Product
                    </Link>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 mb-8">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="text" placeholder="Search..." className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 outline-none text-sm shadow-sm focus:border-[#B58E58]" />
                </div>
                <div className="relative">
                    <select className="appearance-none bg-white border border-gray-100 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none shadow-sm cursor-pointer min-w-[140px]">
                        <option>Status : All</option>
                        <option>Available</option>
                        <option>Out of Stock</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
                </div>
                <div className="relative">
                    <div className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm text-gray-500 shadow-sm cursor-pointer hover:bg-gray-50 transition-all">
                        <Calendar size={16} /> Filter by date range <ChevronDown size={14} />
                    </div>
                </div>
            </div>

            {/* Tabs for Categories */}
            <div className="flex gap-8 border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        onClick={() => setSelectedCategory(cat._id)}
                        className={`pb-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${selectedCategory === cat._id ? 'border-[#B58E58] text-[#B58E58]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#FCFAF8] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metal/Quality</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-20 text-gray-400">Loading products...</td></tr>
                        ) : products.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-[#F9F4EF] rounded-lg overflow-hidden flex items-center justify-center">
                                            <img src={item.thumbnail || item.images?.[0]?.url} className="w-full h-full object-contain p-1" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#222222]">{item.title}</p>
                                            <p className="text-[10px] text-gray-400">{item.subCategory}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-[#222222]">
                                    {'₹'}{item.price?.finalPrice}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500 uppercase">
                                    {item.metal?.type} {item.metal?.quality}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    {item.sku}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${item.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {item.stock > 0 ? 'Available' : 'Out of stock'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-3">
                                        <button className="text-gray-400 hover:text-[#B58E58] transition-all"><Eye size={18} /></button>
                                        <button className="text-gray-400 hover:text-blue-500 transition-all"><Edit3 size={18} /></button>
                                        <button className="text-gray-400 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductPage;