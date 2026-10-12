"use client";
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Eye, Edit3, Trash2, Plus, Calendar, Layers, Folder, Sparkles } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

import {
    getAdminProductsApi,
    setProductActiveApi,
} from '../../../api/adminProductApi';
import { fetchCategoryApi } from '../../../api/categoryApi';
import { fetchCollectionApi } from '../../../api/collectionApi';

const getTotalStock = (product) =>
    product.totalStock ??
    (Array.isArray(product.dimensions)
        ? product.dimensions.reduce(
            (total, option) => total + Number(option.stock ?? 0),
            0
        )
        : 0);

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

    const [statusLoading, setStatusLoading] = useState(false);
    const [actionError, setActionError] = useState('');

    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loadedCategoryType, setLoadedCategoryType] = useState(null);
    const [categoryError, setCategoryError] = useState('');
    const [collectionError, setCollectionError] = useState('');

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [refreshKey, setRefreshKey] = useState(0);

    const [genderFilter, setGenderFilter] = useState('');

    const limit = 10;

    const changeFilter = (setter, value) => {
        setPage(1);
        setter(value);
    };

    const handleActiveChange = async item => {
        if (statusLoading) return;

        setStatusLoading(true);
        setActionError('');

        try {
            const response = await setProductActiveApi(
                item._id,
                item.isActive === false
            );

            if (!response.success) {
                throw new Error(response.error || 'Unable to update status');
            }

            setProducts(previous =>
                previous.map(product =>
                    product._id === item._id
                        ? { ...product, isActive: response.product.isActive }
                        : product
                )
            );
            setRefreshKey(previous => previous + 1);
        } catch (error) {
            setActionError(error.data?.error || error.message);
        } finally {
            setStatusLoading(false);
        }
    };



    // Categories: reload when Standard / Luxury changes.
    useEffect(() => {
        let ignore = false;
        const type = isLuxeView ? 'luxury' : 'normal';

        setLoadedCategoryType(null);
        setCategories([]);
        setSelectedCategory(null);
        setCategoryError('');

        const load = async () => {
            try {
                const data = await fetchCategoryApi(type);

                if (!data.success || !Array.isArray(data.categories)) {
                    throw new Error(data.error || 'Unable to fetch categories');
                }

                if (ignore) return;

                setCategories(data.categories);
                setSelectedCategory(data.categories[0]?._id ?? null);
                setPage(1);
            } catch (error) {
                if (!ignore) {
                    setCategoryError(error.data?.error || error.message);
                }
            } finally {
                if (!ignore) setLoadedCategoryType(type);
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, [isLuxeView]);

    useEffect(() => {
        const value = search.trim();

        if (value === debouncedSearch) return;

        const timer = setTimeout(() => {
            setPage(1);
            setDebouncedSearch(value);
        }, 350);

        return () => clearTimeout(timer);
    }, [search, debouncedSearch]);

    // Collections: load once.
    useEffect(() => {
        let ignore = false;

        const load = async () => {
            try {
                const data = await fetchCollectionApi();

                if (!data.success || !Array.isArray(data.collections)) {
                    throw new Error(data.error || 'Unable to fetch collections');
                }

                if (ignore) return;

                setCollections(data.collections);
                setSelectedCollection(data.collections[0]?._id ?? null);
            } catch (error) {
                if (!ignore) {
                    setCollectionError(error.data?.error || error.message);
                }
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, []);

    // Products: filtered and paginated by the backend.
    useEffect(() => {
        let ignore = false;
        const type = isLuxeView ? 'luxury' : 'normal';

        if (
            filterMode === 'category' &&
            loadedCategoryType !== type
        ) {
            setLoading(true);
            return;
        }

        if (
            (filterMode === 'category' && !selectedCategory) ||
            (filterMode === 'collection' && !selectedCollection)
        ) {
            setProducts([]);
            setTotal(0);
            setTotalPages(0);
            setLoading(false);
            return;
        }

        const load = async () => {
            setLoading(true);
            setActionError('');

            try {
                const params = {
                    page,
                    limit,
                    sort: sortOrder,
                    ...(debouncedSearch && { search: debouncedSearch }),
                    ...(stockFilter && { stock: stockFilter }),
                    ...(activeFilter && { isActive: activeFilter }),
                    ...(genderFilter && { gender: genderFilter }),
                };

                if (filterMode === 'category') {
                    params.category = selectedCategory;
                    params.luxe = isLuxeView;
                } else if (filterMode === 'collection') {
                    params.collection = selectedCollection;
                } else {
                    params.isNewArrival = true;
                }

                const data = await getAdminProductsApi(params);

                if (!data.success || !Array.isArray(data.products)) {
                    throw new Error(data.error || 'Unable to fetch products');
                }

                if (ignore) return;

                const lastPage = Math.max(1, data.totalPages);

                if (page > lastPage) {
                    setPage(lastPage);
                    return;
                }

                setProducts(data.products);
                setTotal(data.total);
                setTotalPages(data.totalPages);
            } catch (error) {
                if (!ignore) {
                    setProducts([]);
                    setTotal(0);
                    setTotalPages(0);
                    setActionError(error.data?.error || error.message);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, [
        filterMode,
        selectedCategory,
        selectedCollection,
        isLuxeView,
        loadedCategoryType,
        page,
        limit,
        debouncedSearch,
        stockFilter,
        activeFilter,
        sortOrder,
        refreshKey,
        genderFilter
    ]);


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
                                onClick={() => changeFilter(setIsLuxeView, false)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isLuxeView ? 'bg-[#B58E58] text-white shadow-sm' : 'text-[#B58E58]/60 hover:text-[#B58E58]'}`}
                            >
                                Standard
                            </button>
                            <button
                                onClick={() => changeFilter(setIsLuxeView, true)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isLuxeView ? 'bg-[#B58E58] text-white shadow-sm' : 'text-[#B58E58]/60 hover:text-[#B58E58]'}`}
                            >
                                Luxury
                            </button>
                        </div>
                    )}

                    {/* MASTER SWITCH: Category vs Collection vs New Arrivals */}
                    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                        <button
                            onClick={() => changeFilter(setFilterMode, 'category')}
                            className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold transition-all ${filterMode === 'category' ? 'bg-[#222222] text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            <Layers size={16} /> Categories
                        </button>
                        <button
                            onClick={() => changeFilter(setFilterMode, 'collection')}
                            className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-bold transition-all ${filterMode === 'collection' ? 'bg-[#222222] text-white shadow-md' : 'text-gray-400 hover:text-black'}`}
                        >
                            <Folder size={16} /> Collections
                        </button>
                        <button
                            onClick={() => changeFilter(setFilterMode, 'newArrival')}
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
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                    <Search
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        placeholder="Search by Title or SKU..."
                        aria-label="Search products by title or SKU"
                        className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 outline-none text-sm shadow-sm focus:border-[#B58E58]"
                    />
                </div>
                <div className="relative">
                    <select
                        value={genderFilter}
                        onChange={event =>
                            changeFilter(setGenderFilter, event.target.value)
                        }
                        aria-label="Filter by gender"
                        className="appearance-none bg-white border border-gray-100 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none shadow-sm cursor-pointer min-w-[140px]"
                    >
                        <option value="">Gender: All</option>
                        <option value="Male">Men</option>
                        <option value="Female">Women</option>
                        <option value="Unisex">Unisex</option>
                    </select>

                    <ChevronDown
                        className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                        size={16}
                    />
                </div>

                {/* Stock */}
                <div className="relative">
                    <select
                        value={stockFilter}
                        onChange={event =>
                            changeFilter(setStockFilter, event.target.value)
                        }
                        aria-label="Filter by stock"
                        className="appearance-none bg-white border border-gray-100 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none shadow-sm cursor-pointer min-w-[140px]"
                    >
                        <option value="">Stock: All</option>
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>

                    <ChevronDown
                        className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                        size={16}
                    />
                </div>

                {/* Active / Inactive — replaces date filter */}
                <div className="relative">
                    <select
                        value={activeFilter}
                        onChange={event =>
                            changeFilter(setActiveFilter, event.target.value)
                        }
                        aria-label="Filter by active status"
                        className="appearance-none bg-white border border-gray-100 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none shadow-sm cursor-pointer min-w-[140px]"
                    >
                        <option value="">Status: All</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>

                    <ChevronDown
                        className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                        size={16}
                    />
                </div>

                {/* Sorting */}
                <div className="relative">
                    <select
                        value={sortOrder}
                        onChange={event =>
                            changeFilter(setSortOrder, event.target.value)
                        }
                        aria-label="Sort products"
                        className="appearance-none bg-white border border-gray-100 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none shadow-sm cursor-pointer min-w-[160px]"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price_low_high">Price: Low to High</option>
                        <option value="price_high_low">Price: High to Low</option>
                    </select>

                    <ChevronDown
                        className="absolute right-3 top-3 text-gray-400 pointer-events-none"
                        size={16}
                    />
                </div>

                {(search || stockFilter || activeFilter || genderFilter || sortOrder !== 'newest') && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('');
                            setDebouncedSearch('');
                            setStockFilter('');
                            setActiveFilter('');
                            setSortOrder('newest');
                            setGenderFilter('');
                            setPage(1);
                        }}
                        className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-[#B58E58] shadow-sm hover:bg-[#FCF6F2] transition-colors"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* DYNAMIC TABS: Renders Categories or Collections based on filterMode (Hidden for New Arrivals) */}
            {filterMode !== 'newArrival' && (
                <div className="flex gap-8 border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar">
                    {filterMode === 'category' ? (
                        categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => changeFilter(setSelectedCategory, cat._id)}
                                className={`pb-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${selectedCategory === cat._id ? 'border-[#B58E58] text-[#B58E58]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                {cat.name}
                            </button>
                        ))
                    ) : (
                        collections.map((col) => (
                            <button
                                key={col._id}
                                onClick={() => changeFilter(setSelectedCollection, col._id)}
                                className={`pb-4 text-sm font-bold transition-all whitespace-nowrap border-b-2 ${selectedCollection === col._id ? 'border-[#B58E58] text-[#B58E58]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                {col.name}
                            </button>
                        ))
                    )}
                </div>
            )}

            {(actionError || categoryError || collectionError) && (
                <p role="alert" className="mb-4 text-sm text-red-500">
                    {[actionError, categoryError, collectionError]
                        .filter(Boolean)
                        .join(' ')}
                </p>
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
                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender</th>
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

                                <td className="px-6 py-4 text-xs font-medium text-gray-600">
                                    {item.gender === 'Male'
                                        ? 'Men'
                                        : item.gender === 'Female'
                                            ? 'Women'
                                            : item.gender || '—'}
                                </td>

                                <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                    {item.sku}
                                </td>

                                <td className="px-6 py-4 text-xs text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>

                                <td className="px-6 py-4">


                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${getTotalStock(item) > 0
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-red-50 text-red-600'
                                                }`}
                                        >
                                            {getTotalStock(item) > 0
                                                ? `${getTotalStock(item)} in stock`
                                                : 'Out of stock'}
                                        </span>
                                    </td>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <Link
                                            href={`/admin/add-product?id=${item._id}&mode=view`}
                                            className="text-gray-400 hover:text-[#B58E58] transition-all"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </Link>

                                        <Link
                                            href={`/admin/add-product?id=${item._id}&mode=edit`}
                                            className="text-gray-400 hover:text-blue-500 transition-all"
                                            title="Edit"
                                        >
                                            <Edit3 size={18} />
                                        </Link>

                                        <button
                                            type="button"
                                            role="switch"
                                            aria-checked={item.isActive !== false}
                                            aria-label={`Active status for ${item.title}`}
                                            disabled={statusLoading}
                                            onClick={() => handleActiveChange(item)}
                                            title={item.isActive === false ? 'Activate' : 'Deactivate'}
                                            className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors disabled:opacity-50 ${item.isActive !== false ? 'bg-[#B58E58]' : 'bg-gray-300'
                                                }`}
                                        >
                                            <span
                                                className={`w-4 h-4 bg-white rounded-full transition-transform ${item.isActive !== false ? 'translate-x-5' : ''
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {!loading && products.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center py-20 text-gray-400 text-sm">
                                    No products found for this {filterMode === 'newArrival' ? 'filter' : filterMode}.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
            {total > 0 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        Showing {(page - 1) * limit + 1}–
                        {Math.min(page * limit, total)} of {total} products
                    </p>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            disabled={loading || page <= 1}
                            onClick={() => setPage(previous => previous - 1)}
                            className="rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm font-bold text-[#B58E58] transition-colors hover:bg-[#FCF6F2] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <span className="text-sm text-gray-500">
                            {page} / {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={loading || page >= totalPages}
                            onClick={() => setPage(previous => previous + 1)}
                            className="rounded-xl bg-[#B58E58] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#9a7645] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductPage;