"use client";
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, ImageIcon, Loader2, Plus, Upload, X } from 'lucide-react';
// import imageCompression from 'browser-image-compression';
// import heic2any from "heic2any";
import axios from 'axios';

const AddProduct = () => {

    const [productData, setProductData] = useState({
        title: '',
        sku: '',
        description: '',
        category: '',
        subCategory: '',
        collectionId: '', // Mapped to 'collection' in schema
        stock: 0,
        isNewArrival: false,
        isLuxe: false,
        tags: '', // Comma separated string in UI
        price: { basePrice: '', makingCharges: '', tax: '', finalPrice: '', currency: 'USD' },
        metal: { type: 'Gold', quality: '', color: '', weight: '' },
        dimensions: { width: '', length: '', size: '' }
    });

    const [stones, setStones] = useState([
        { type: '', shape: '', color: '', clarity: '', weight: '', count: '' }
    ]);
    const [selectedImages, setSelectedImages] = useState([]);

    // --- UI & API States ---
    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [availableSubCategories, setAvailableSubCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // --- Toast Helper ---
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

    // --- Fetch Initial Data ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, colRes] = await Promise.all([
                    axios.get('https://dwarajewels.in/api/category'),
                    axios.get('https://dwarajewels.in/api/collection')
                ]);
                if (catRes.data.success) setCategories(catRes.data.categories);
                if (colRes.data.success) setCollections(colRes.data.collections);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    // --- Change Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent, field, value) => {
        setProductData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleCategoryChange = (e) => {
        const catId = e.target.value;
        const found = categories.find(c => c._id === catId);
        setProductData(prev => ({ ...prev, category: catId, subCategory: '' }));
        setAvailableSubCategories(found?.subCategories || []);
    };

    const handleStoneChange = (index, field, value) => {
        const updatedStones = [...stones];
        updatedStones[index][field] = value;
        setStones(updatedStones);
    };

    const addStone = () => setStones([...stones, { type: '', shape: '', color: '', clarity: '', weight: '', count: '' }]);

    const removeImage = (index) => setSelectedImages(selectedImages.filter((_, i) => i !== index));

    // --- Image Processing ---
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        setIsConverting(true);

        try {
            const imageCompression = (await import('browser-image-compression')).default;
            const heic2any = (await import('heic2any')).default;
            const processedFiles = await Promise.all(
                files.map(async (file) => {
                    let fileToCompress = file;
                    const isHEIC = file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic");
                    if (isHEIC) {
                        const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
                        fileToCompress = new File([Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob],
                            file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
                    }
                    const compressedFile = await imageCompression(fileToCompress, { maxSizeMB: 1, fileType: "image/webp" });
                    const webpBlob = new File([compressedFile], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" });
                    return { url: URL.createObjectURL(webpBlob), file: webpBlob };
                })
            );
            setSelectedImages(prev => [...prev, ...processedFiles]);
        } catch (error) { showToast("Image conversion failed", "error"); } finally { setIsConverting(false); }
    };

    // --- Submit Logic ---
    const validateForm = () => {
        if (!productData.title) return "Product Name is required";
        if (!productData.sku) return "SKU is required";
        if (!productData.category) return "Please select a Category";
        if (!productData.price.finalPrice) return "Final Price is required";
        if (selectedImages.length === 0) return "At least one image is required";
        return null;
    };

    const handleCreateProduct = async () => {
        const errorMsg = validateForm();
        if (errorMsg) return showToast(errorMsg, 'error');

        setIsLoading(true);
        const formData = new FormData();

        // 1. Append Standard Text/Boolean Fields
        formData.append('title', productData.title);
        formData.append('sku', productData.sku);
        formData.append('description', productData.description);
        formData.append('category', productData.category);
        formData.append('subCategory', productData.subCategory);
        if (productData.collectionId) {
            formData.append('collection', productData.collectionId); // Maps to schema 'collection'
        }
        formData.append('stock', productData.stock);
        formData.append('isNewArrival', productData.isNewArrival);
        formData.append('isLuxe', productData.isLuxe);

        // 2. Format & Append Tags (UI String -> Backend Array)
        const tagsArray = productData.tags.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        formData.append('tags', JSON.stringify(tagsArray));

        // 3. Append Nested Objects (Must be stringified for FormData)
        formData.append('price', JSON.stringify(productData.price));
        formData.append('metal', JSON.stringify(productData.metal));
        formData.append('dimensions', JSON.stringify(productData.dimensions));

        // Filter out empty stone rows before appending
        const validStones = stones.filter(s => s.type || s.shape || s.weight);
        formData.append('stones', JSON.stringify(validStones));

        // 4. Append Files
        selectedImages.forEach(img => formData.append('images', img.file));

        try {
            const response = await axios.post('https://dwarajewels.in/api/product', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                showToast("Product Published Successfully!", "success");
                setTimeout(() => window.location.reload(), 2000);
            }
        } catch (error) {
            showToast(error.response?.data?.error || error.response?.data?.message || "Failed to create product", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pb-20 bg-linear-to-b from-[#f4f0ea] to-[#fafafa] px-6.5 pt-5">
            {/* Custom Toast */}
            {toast.show && (
                <div className={`fixed top-10 right-10 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl z-50 animate-bounce
                    ${toast.type === 'success' ? 'bg-[#222222] text-white' : 'bg-red-600 text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle2 size={20} className="text-[#B58E58]" /> : <AlertCircle size={20} />}
                    <p className="text-sm font-bold">{toast.message}</p>
                </div>
            )}

            <div>
                <h1 className="text-[#222222] text-[24px] font-bold">Add Product</h1>
            </div>

            <div className="grid grid-cols-2 gap-[63px] mt-[30px]">

                {/* LEFT COLUMN */}
                <div>
                    <div>
                        <h1 className="text-[#222222] font-semibold text-[18px]">
                            Product Information
                        </h1>
                        <div className="bg-white mt-[16px] rounded-[16px] p-[26px]">
                            <div className="space-y-6">

                                {/* Product Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">Product Name</label>
                                    <input
                                        name="title" value={productData.title} onChange={handleInputChange}
                                        type="text"
                                        placeholder="e.g. Elsa Peretti Diamonds by the Yard"
                                        className="w-full bg-[#F3F3F3] rounded-[8px] px-5 py-3 outline-none focus:ring-1 focus:ring-[#B58E58] text-[12px]"
                                    />
                                </div>

                                {/* SKU */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">SKU</label>
                                    <input
                                        name="sku" value={productData.sku} onChange={handleInputChange}
                                        type="text"
                                        placeholder="e.g. BR-LX-5541-2099"
                                        className="w-full bg-[#F3F3F3] rounded-[8px] px-5 py-3 outline-none focus:ring-1 focus:ring-[#B58E58] text-[12px]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                    <input name="stock" value={productData.stock} onChange={handleInputChange} type="number" className="w-full bg-[#F3F3F3] rounded-[8px] px-5 py-3 outline-none text-[12px]" />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">Description</label>
                                    <textarea
                                        name="description" value={productData.description} onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Tell about the product..."
                                        className="w-full bg-[#F3F3F3] border-none rounded-[8px] px-5 text-[12px] py-3 outline-none focus:ring-1 focus:ring-[#B58E58] resize-none"
                                    ></textarea>
                                </div>

                                {/* Category & Sub Category Dropdowns */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                                        <select value={productData.category} onChange={handleCategoryChange} className="w-full appearance-none bg-[#F3F3F3] rounded-[8px] px-4 py-3 text-[12px] outline-none">
                                            <option value="">Select Category</option>
                                            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name} {cat.isLuxeCategory ? '— LUXURY' : ''}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-4 bottom-4 text-gray-400" />
                                    </div>
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                                        <select value={productData.subCategory} onChange={(e) => handleInputChange({ target: { name: 'subCategory', value: e.target.value } })} className="w-full appearance-none bg-[#F3F3F3] rounded-[8px] px-4 py-3 text-[12px] outline-none">
                                            <option value="">Select Sub</option>
                                            {availableSubCategories.map((sub, i) => <option key={i} value={sub}>{sub}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="absolute right-4 bottom-4 text-gray-400" />
                                    </div>
                                </div>

                                {/* Collection Dropdown */}
                                <div className="relative">
                                    <label className="text-xs font-bold text-gray-400">COLLECTION</label>
                                    <select name="collectionId" value={productData.collectionId} onChange={handleInputChange} className="w-full bg-[#F3F3F3] rounded-[8px] px-4 py-3 mt-2 outline-none text-[12px] appearance-none">
                                        <option value="">Select Collection</option>
                                        {collections.map(col => <option key={col._id} value={col._id}>{col.name}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 bottom-4 text-gray-400" />
                                </div>

                                {/* Toggles: New Arrival & Luxe */}
                                <div className="flex gap-10">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-3">New Arrival?</p>
                                        <button onClick={() => setProductData(p => ({ ...p, isNewArrival: !p.isNewArrival }))} className={`w-12 h-6 rounded-full px-1 flex items-center transition-all ${productData.isNewArrival ? 'bg-[#B58E58]' : 'bg-gray-300'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full transition-all ${productData.isNewArrival ? 'translate-x-6' : ''}`} />
                                        </button>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-3">Luxe?</p>
                                        <button onClick={() => setProductData(p => ({ ...p, isLuxe: !p.isLuxe }))} className={`w-12 h-6 rounded-full px-1 flex items-center transition-all ${productData.isLuxe ? 'bg-[#222222]' : 'bg-gray-300'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full transition-all ${productData.isLuxe ? 'translate-x-6' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Price Distribution */}
                    <div className=" mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-[18px] font-semibold text-[#222222]">Price Distribution</h2>
                            {/* Currency Selector */}
                            <select
                                value={productData.price.currency}
                                onChange={(e) => handleNestedChange('price', 'currency', e.target.value)}
                                className="bg-white border border-gray-200 rounded-md px-3 py-1 text-sm outline-none"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="INR">INR (₹)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-6 bg-white rounded-[18px] p-8">
                            {['basePrice', 'makingCharges', 'tax', 'finalPrice'].map(f => (
                                <div key={f}>
                                    <label className="text-xs font-bold text-gray-400 uppercase">{f}</label>
                                    <input
                                        type="number"
                                        value={productData.price[f]}
                                        onChange={(e) => handleNestedChange('price', f, e.target.value)}
                                        className="w-full bg-[#F3F3F3] rounded-[10px] px-4 py-3 mt-2 outline-none text-[12px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Search Tags */}
                    <div className=" h-fit mt-8">
                        <h2 className="text-[18px] font-semibold text-[#222222] mb-4">Search Tags</h2>
                        <div className='bg-white rounded-[18px] p-8'>
                            <textarea
                                name="tags" value={productData.tags} onChange={handleInputChange}
                                placeholder="bridal, minimal, rose-gold (comma separated)"
                                className="w-full bg-[#F3F3F3] rounded-[10px] px-4 py-3 h-[120px] outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div>
                    <div>
                        <h1 className="text-[#222222] font-semibold text-[18px]">Product Images</h1>
                        <div className="bg-white rounded-[18px] p-[26px] mt-[16px]">
                            <label className="h-[121px] border-[1px] border-[#0000003B] rounded-[8px] border-dashed flex flex-col justify-center items-center bg-[#fafafa] cursor-pointer hover:bg-gray-50 transition-all">
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isConverting} />
                                <ImageIcon className="text-[#B58E58] mb-1" size={24} />
                                <p className="text-[#222222] font-semibold text-[14px]">{isConverting ? "Processing..." : "Upload Images"}</p>
                            </label>
                            <div className="flex flex-wrap gap-4 mt-6">
                                {selectedImages.map((img, i) => (
                                    <div key={i} className="relative w-20 h-20 bg-[#FCF6F2] rounded-lg border border-gray-100 flex items-center justify-center">
                                        <img src={img.url} className="w-[85%] h-[85%] object-contain" alt="preview" />
                                        <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-[#B58E58] text-white rounded-full p-1 shadow-md"><X size={10} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-[18px] font-semibold text-[#222222] mb-4">Metal Details</h2>
                        <div className="grid grid-cols-2 gap-x-[63px] gap-y-6 bg-white rounded-[18px] p-8">
                            <div className="relative">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Metal Type</label>
                                <select value={productData.metal.type} onChange={(e) => handleNestedChange('metal', 'type', e.target.value)} className="w-full bg-[#F3F3F3] rounded-[8px] px-4 py-3 mt-1 outline-none text-[12px] appearance-none">
                                    <option value="Gold">Gold</option><option value="Silver">Silver</option><option value="Platinum">Platinum</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 bottom-4 text-gray-400" />
                            </div>
                            {['quality', 'color', 'weight'].map(f => (
                                <div key={f}>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">{f}</label>
                                    <input
                                        placeholder={f === 'color' ? 'e.g. Rose Gold' : f === 'quality' ? 'e.g. 18k' : 'in grams'}
                                        value={productData.metal[f]}
                                        onChange={(e) => handleNestedChange('metal', f, e.target.value)}
                                        type={f === 'weight' ? 'number' : 'text'}
                                        className="w-full bg-[#F3F3F3] rounded-[8px] px-4 py-3 mt-1 outline-none text-[12px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Stone Details Section */}
                    <div className="bg-white rounded-[18px] p-8 mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[18px] font-semibold text-[#222222]">Stone Details</h2>
                            <button
                                onClick={addStone}
                                className="text-[#B58E58] font-bold text-sm flex items-center gap-1 hover:underline"
                            >
                                <Plus size={14} /> Add Stone
                            </button>
                        </div>

                        {stones.map((stone, i) => (
                            <div key={i} className="grid grid-cols-3 gap-3 p-3 border border-gray-50 rounded-xl mb-3 relative">
                                {['type', 'shape', 'color', 'clarity', 'weight', 'count'].map(field => (
                                    <input
                                        key={field}
                                        type={field === 'weight' || field === 'count' ? 'number' : 'text'}
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        value={stone[field]}
                                        onChange={(e) => handleStoneChange(i, field, e.target.value)}
                                        className="bg-[#F3F3F3] rounded-[6px] px-2 py-2 text-[10px] outline-none"
                                    />
                                ))}
                                {stones.length > 1 && <button onClick={() => setStones(stones.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 text-red-500 bg-white shadow-sm rounded-full p-0.5 border border-gray-100"><X size={10} /></button>}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-[18px] p-8 mt-8">
                        <h2 className="text-[18px] font-semibold text-[#222222] mb-6">Dimensions</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {['width', 'length', 'size'].map(f => (
                                <div key={f}>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">{f}</label>
                                    <input
                                        value={productData.dimensions[f]}
                                        onChange={(e) => handleNestedChange('dimensions', f, e.target.value)}
                                        type="text"
                                        placeholder={f === 'size' ? 'e.g. 7' : 'e.g. 0.5 in'}
                                        className="w-full bg-[#F3F3F3] rounded-[8px] px-3 py-2 mt-1 outline-none text-[12px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Final Submit Button */}
                <div className="col-span-2 mt-2 flex justify-end">
                    <button
                        disabled={isLoading}
                        onClick={handleCreateProduct}
                        className={`px-12 py-4 rounded-[15px] font-bold text-white shadow-lg transition-all flex items-center gap-3
        ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B58E58] hover:bg-[#9a7645] shadow-[#B58E58]/20'}`}
                    >
                        {isLoading && <Loader2 className="animate-spin" size={20} />}
                        {isLoading ? 'Creating Product...' : 'Publish Product'}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AddProduct;