"use client";
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Eye, Edit3, Trash2, Plus, Calendar, Layers, Folder, Sparkles } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const ProductPage = () => {
    // --- State Management ---
    const [filterMode, setFilterMode] = useState('category'); // 'category' | 'collection' | 'newArrival'
    const [isLuxeView, setIsLuxeView] = useState(false);
    
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCollection, setSelectedCollection] = useState(null);
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- API Functions ---
    const fetchCategoryApi = async (type = 'normal') => {
        const response = await axios.get(`https://dwarajewels.in/api/category?type=${type}`);
        return response.data;
    };

    const fetchCollectionApi = async () => {
        const response = await axios.get(`https://dwarajewels.in/api/collection`);
        return response.data;
    };

    const fetchProductApi = async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const response = await axios.get(`https://dwarajewels.in/api/product?${queryString}`);
        return response.data;
    };

    // --- Logic: Load Categories & Collections ---
    const loadCategories = async () => {
        try {
            const type = isLuxeView ? 'luxury' : 'normal';
            const data = await fetchCategoryApi(type); 
            if (data.success) {
                setCategories(data.categories);
                if (data.categories.length > 0) {
                    setSelectedCategory(data.categories[0]._id);
                } else {
                    setSelectedCategory(null);
                }
            }
        } catch (error) {
            console.error("Category Fetch Error:", error);
        }
    };

    const loadCollections = async () => {
        try {
            const data = await fetchCollectionApi();
            if (data.success) {
                setCollections(data.collections);
                if (data.collections.length > 0) {
                    setSelectedCollection(data.collections[0]._id);
                } else {
                    setSelectedCollection(null);
                }
            }
        } catch (error) {
            console.error("Collection Fetch Error:", error);
        }
    };

    // --- Logic: Load Products ---
    const loadProducts = async () => {
        // Prevent fetching if the active mode has no selection yet (does not apply to newArrival)
        if (filterMode === 'category' && !selectedCategory) {
            setProducts([]);
            return;
        }
        if (filterMode === 'collection' && !selectedCollection) {
            setProducts([]);
            return;
        }
        
        setLoading(true);
        try {
            // Build dynamic params based strictly on the ACTIVE filter mode
            const params = {};
            if (filterMode === 'category') params.category = selectedCategory;
            if (filterMode === 'collection') params.collection = selectedCollection;
            if (filterMode === 'newArrival') params.isNewArrival = true;

            const data = await fetchProductApi(params);
            if (data.success) setProducts(data.products);
        } catch (error) {
            console.error("Product Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Effects ---
    
    // 1. Initial Load for Collections
    useEffect(() => {
        loadCollections();
    }, []);

    // 2. Load Categories when Luxe toggle changes
    useEffect(() => {
        loadCategories();
    }, [isLuxeView]);

    // 3. Ensure default selections when switching Filter Mode
    useEffect(() => {
        if (filterMode === 'category' && categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0]._id);
        } else if (filterMode === 'collection' && collections.length > 0 && !selectedCollection) {
            setSelectedCollection(collections[0]._id);
        }
    }, [filterMode, categories, collections]);

    // 4. Load Products when Mode or active IDs change
    useEffect(() => {
        loadProducts();
    }, [filterMode, selectedCategory, selectedCollection]);

    // Helper function to resolve Collection Name text
    const getCollectionName = (collectionData) => {
        if (!collectionData) return '—';
        if (collectionData.name) return collectionData.name;
        if (typeof collectionData === 'string') {
            const matchedCol = collections.find(c => c._id === collectionData);
            return matchedCol ? matchedCol.name : '—';
        }
        return '—';
    };

    return (
        <div className="min-h-screen bg-[#FDFBF9] px-8 py-6">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-[#222222] text-2xl font-bold font-serif">Product List</h1>
                <div className="flex items-center gap-4">

                    {/* LUXE TOGGLE (Only visible when viewing Categories) */}
                    {filterMode === 'category' && (
                        <div className="flex bg-[#FCF6F2] rounded-xl p-1 border border-[#BF8F5F]/20">
                            <button
                                onClick={() => setIsLuxeView(false)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isLuxeView ? 'bg-[#B58E58] text-white shadow-sm' : 'text-[#B58E58]/60 hover:text-[#B58E58]'}`}
                            >
                                Standard
                            </button>
                            <button
                                onClick={() => setIsLuxeView(true)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isLuxeView ? 'bg-[#B58E58] text-white shadow-sm' : 'text-[#B58E58]/60 hover:text-[#B58E58]'}`}
                            >
                                Luxury
                            </button>
                        </div>
                    )}
                    
                    {/* MASTER SWITCH: Category vs Collection vs New Arrivals */}
                    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                        <button
                            onClick={() => setFilterMode('category')}
                            className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold transition-all ${filterMode === 'category' ? 'bg-[#222222] text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            <Layers size={16} /> Categories
                        </button>
                        <button
                            onClick={() => setFilterMode('collection')}
                            className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold transition-all ${filterMode === 'collection' ? 'bg-[#222222] text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            <Folder size={16} /> Collections
                        </button>
                        <button
                            onClick={() => setFilterMode('newArrival')}
                            className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold transition-all ${filterMode === 'newArrival' ? 'bg-[#222222] text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            <Sparkles size={16} /> New Arrivals
                        </button>
                    </div>

                    <Link href="/admin/add-product" className="bg-[#B58E58] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#9a7645] transition-all ml-2">
                        <Plus size={18} /> New Product
                    </Link>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 mb-8">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="text" placeholder="Search by Title or SKU..." className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 outline-none text-sm shadow-sm focus:border-[#B58E58]" />
                </div>
                
                <div className="relative">
                    <select className="appearance-none bg-white border border-gray-100 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none shadow-sm cursor-pointer min-w-[140px]">
                        <option>Status : All</option>
                        <option>In Stock</option>
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

            {/* DYNAMIC TABS: Renders Categories or Collections based on filterMode (Hidden for New Arrivals) */}
            {filterMode !== 'newArrival' && (
                <div className="flex gap-8 border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar">
                    {filterMode === 'category' ? (
                        categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat._id)}
                                className={`pb-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${selectedCategory === cat._id ? 'border-[#B58E58] text-[#B58E58]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                {cat.name}
                            </button>
                        ))
                    ) : (
                        collections.map((col) => (
                            <button
                                key={col._id}
                                onClick={() => setSelectedCollection(col._id)}
                                className={`pb-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${selectedCollection === col._id ? 'border-[#B58E58] text-[#B58E58]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                {col.name}
                            </button>
                        ))
                    )}
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#FCFAF8] border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collection</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metal Details</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">SKU</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="8" className="text-center py-20 text-gray-400">Loading products...</td></tr>
                        ) : products.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-[#F9F4EF] rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                                            <img src={item.thumbnail || (item.images && item.images[0]) || '/placeholder.png'} className="w-full h-full object-cover" alt={item.title} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#222222] line-clamp-1" title={item.title}>
                                                {item.title}
                                                {item.isNewArrival && <span className="ml-2 text-[8px] bg-[#B58E58] text-white px-1.5 py-0.5 rounded-sm uppercase tracking-wider">New</span>}
                                            </p>
                                            <p className="text-[10px] text-gray-400">{item.subCategory || '—'}</p>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                    {getCollectionName(item.collection)}
                                </td>
                                
                                <td className="px-6 py-4 text-sm font-bold text-[#222222]">
                                    {item.price?.currency === 'USD' ? '$' : 'Rs. '}
                                    {item.price?.finalPrice?.toLocaleString()}
                                </td>
                                
                                <td className="px-6 py-4 text-xs text-gray-500 capitalize">
                                    {item.metal?.color} {item.metal?.type} {item.metal?.quality}
                                </td>
                                
                                <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                    {item.sku}
                                </td>
                                
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                
                                <td className="px-6 py-4">
                                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${item.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                                    </span>
                                </td>
                                
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-3">
                                        <button className="text-gray-400 hover:text-[#B58E58] transition-all" title="View"><Eye size={18} /></button>
                                        <button className="text-gray-400 hover:text-blue-500 transition-all" title="Edit"><Edit3 size={18} /></button>
                                        <button className="text-gray-400 hover:text-red-500 transition-all" title="Delete"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        
                        {!loading && products.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-20 text-gray-400 text-sm">
                                    No products found for this {filterMode === 'newArrival' ? 'filter' : filterMode}.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductPage;