"use client";
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, ImageIcon, Loader2, Plus, Upload, X } from 'lucide-react';
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const AddProduct = () => {

    const [productData, setProductData] = useState({
        title: '',
        sku: '',
        description: '',
        category: '',
        subCategory: '',
        collectionId: '',
        isNewArrival: false,
        isLuxe: false,
        tags: '',
        price: { basePrice: '', makingCharges: 0, compareAtPrice: '', tax: '', finalPrice: '', currency: 'INR' }, // Default INR, makingCharges 0
        metal: { type: 'Gold', quality: '92.5', color: '', weight: '' },
        dimensions: [{ width: '', length: '', size: '', stock: 0 }]
    });

    const [stones, setStones] = useState([
        { type: '', shape: '', color: '', clarity: '', weight: '', count: '' }
    ]);
    const [selectedImages, setSelectedImages] = useState([]);

    const [categories, setCategories] = useState([]);
    const [collections, setCollections] = useState([]);
    const [availableSubCategories, setAvailableSubCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [cropModal, setCropModal] = useState({ isOpen: false, index: null, src: '' });
    const [crop, setCrop] = useState({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
    const [completedCrop, setCompletedCrop] = useState(null);

    // --- DRAG & DROP REARRANGING ---
    const handleDragStart = (e, index) => setDraggedIndex(index);

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropIndex) return;

        const newImages = [...selectedImages];
        const [draggedImage] = newImages.splice(draggedIndex, 1);
        newImages.splice(dropIndex, 0, draggedImage);

        setSelectedImages(newImages);
        setDraggedIndex(null);
    };

    const handleDimensionChange = (index, field, value) => {
        setProductData(prev => ({
            ...prev,
            dimensions: prev.dimensions.map((dimension, i) =>
                i === index ? { ...dimension, [field]: value } : dimension
            )
        }));
    };

    const addDimension = () => {
        setProductData(prev => ({
            ...prev,
            dimensions: [
                ...prev.dimensions,
                { width: '', length: '', size: '', stock: 0 }
            ]
        }));
    };

    const removeDimension = (index) => {
        setProductData(prev => ({
            ...prev,
            dimensions: prev.dimensions.length > 1
                ? prev.dimensions.filter((_, i) => i !== index)
                : prev.dimensions
        }));
    };

    // --- CROP SAVING LOGIC ---
    // const handleSaveCrop = async () => {
    //     if (!completedCrop || !completedCrop.width || !completedCrop.height) return;
    //     setIsLoading(true);

    //     const image = document.getElementById('crop-source-image');
    //     const canvas = document.createElement('canvas');
    //     const scaleX = image.naturalWidth / image.width;
    //     const scaleY = image.naturalHeight / image.height;
    //     canvas.width = completedCrop.width;
    //     canvas.height = completedCrop.height;
    //     const ctx = canvas.getContext('2d');

    //     ctx.drawImage(
    //         image,
    //         completedCrop.x * scaleX, completedCrop.y * scaleY,
    //         completedCrop.width * scaleX, completedCrop.height * scaleY,
    //         0, 0, completedCrop.width, completedCrop.height
    //     );

    //     canvas.toBlob((blob) => {
    //         if (blob) {
    //             const file = new File([blob], 'cropped-image.webp', { type: 'image/webp' });
    //             const url = URL.createObjectURL(file);
    //             const newImages = [...selectedImages];
    //             newImages[cropModal.index] = {
    //                 ...newImages[cropModal.index], // <-- ADD THIS: Keeps the originalUrl intact
    //                 url: url,
    //                 file: file
    //             };
    //             setSelectedImages(newImages);
    //             setCropModal({ isOpen: false, index: null, src: '' });
    //         }
    //         setIsLoading(false);
    //     }, 'image/webp');
    // };

    const handleSaveCrop = async () => {
        if (!completedCrop?.width || !completedCrop?.height) return;

        setIsLoading(true);

        const image = document.getElementById('crop-source-image');
        const canvas = document.createElement('canvas');

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // Preserve the original image resolution
        canvas.width = Math.round(completedCrop.width * scaleX);
        canvas.height = Math.round(completedCrop.height * scaleY);

        const ctx = canvas.getContext('2d');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const file = new File(
                        [blob],
                        'cropped-image.webp',
                        { type: 'image/webp' }
                    );

                    const url = URL.createObjectURL(file);
                    const newImages = [...selectedImages];

                    newImages[cropModal.index] = {
                        ...newImages[cropModal.index],
                        url,
                        file
                    };

                    setSelectedImages(newImages);
                    setCropModal({
                        isOpen: false,
                        index: null,
                        src: ''
                    });
                }

                setIsLoading(false);
            },
            'image/webp',
            1
        );
    };
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
    };

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

    // --- NEW: Price Calculation Logic ---
    const handlePriceChange = (e) => {
        const finalPrice = e.target.value;
        const numFinal = parseFloat(finalPrice) || 0;

        // Calculate Base (100%) and Tax (3%)
        const basePrice = (numFinal / 1.03).toFixed(2);
        const tax = (numFinal - basePrice).toFixed(2);

        setProductData(prev => ({
            ...prev,
            price: {
                ...prev.price,
                finalPrice: finalPrice,
                basePrice: basePrice,
                tax: tax,
                makingCharges: 0, // Always 0
                currency: 'INR'
            }
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

    // --- UPDATED: Sequential Image Processing ---
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        setIsConverting(true);

        try {
            const imageCompression = (await import('browser-image-compression')).default;
            const heic2any = (await import('heic2any')).default;

            const processedFiles = [];

            // Process images sequentially instead of Promise.all to prevent browser crashes
            for (const file of files) {
                let fileToCompress = file;
                const isHEIC = file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic");

                if (isHEIC) {
                    const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
                    fileToCompress = new File([Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob],
                        file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
                }

                // Reduced maxSizeMB to 0.5 (500kb) to prevent "Payload Too Large" errors when uploading 5+ images
                const compressedFile = await imageCompression(fileToCompress, { maxSizeMB: 1.5, fileType: "image/webp" });
                const webpBlob = new File([compressedFile], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" });

                processedFiles.push({
                    url: URL.createObjectURL(webpBlob),
                    file: webpBlob,
                    originalUrl: URL.createObjectURL(webpBlob) // <-- ADD THIS
                });
            }

            setSelectedImages(prev => [...prev, ...processedFiles]);
        } catch (error) {
            showToast("Image conversion failed", "error");
        } finally {
            setIsConverting(false);
        }
    };

    const validateForm = () => {
        if (!productData.title) return "Product Name is required";
        if (!productData.sku) return "SKU is required";
        if (!productData.category) return "Please select a Category";
        if (!productData.price.finalPrice) return "Final Price is required";
        if (selectedImages.length === 0) return "At least one image is required";
        if (productData.dimensions.some(dimension =>
            String(dimension.stock ?? '').trim() === '' ||
            !Number.isInteger(Number(dimension.stock)) ||
            Number(dimension.stock) < 0
        )) {
            return "Each dimension needs a non-negative whole-number stock";
        }
        return null;
    };

    const handleCreateProduct = async () => {
        const errorMsg = validateForm();
        if (errorMsg) return showToast(errorMsg, 'error');

        setIsLoading(true);
        const formData = new FormData();

        formData.append('title', productData.title);
        formData.append('sku', productData.sku);
        formData.append('description', productData.description);
        formData.append('category', productData.category);
        formData.append('subCategory', productData.subCategory);
        if (productData.collectionId) {
            formData.append('collection', productData.collectionId);
        }
        // formData.append('stock', productData.stock);
        formData.append('isNewArrival', productData.isNewArrival);
        formData.append('isLuxe', productData.isLuxe);

        const tagsArray = productData.tags.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        formData.append('tags', JSON.stringify(tagsArray));

        formData.append('price', JSON.stringify(productData.price));
        formData.append('metal', JSON.stringify(productData.metal));
        formData.append('dimensions', JSON.stringify(
            productData.dimensions.map(dimension => ({
                ...dimension,
                stock: Number(dimension.stock)
            }))
        ));

        const validStones = stones.filter(s => s.type || s.shape || s.weight);
        formData.append('stones', JSON.stringify(validStones));

        selectedImages.forEach(img => formData.append('images', img.file));

        try {
            const response = await axios.post('http://localhost:4500/api/product', formData, {
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">Product Name</label>
                                    <input
                                        name="title" value={productData.title} onChange={handleInputChange}
                                        type="text"
                                        placeholder="e.g. Elsa Peretti Diamonds by the Yard"
                                        className="w-full bg-[#F3F3F3] rounded-[8px] px-5 py-3 outline-none focus:ring-1 focus:ring-[#B58E58] text-[12px]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">SKU</label>
                                    <input
                                        name="sku" value={productData.sku} onChange={handleInputChange}
                                        type="text"
                                        placeholder="e.g. BR-LX-5541-2099"
                                        className="w-full bg-[#F3F3F3] rounded-[8px] px-5 py-3 outline-none focus:ring-1 focus:ring-[#B58E58] text-[12px]"
                                    />
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                    <input name="stock" value={productData.stock} onChange={handleInputChange} type="number" className="w-full bg-[#F3F3F3] rounded-[8px] px-5 py-3 outline-none text-[12px]" />
                                </div> */}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4">Description</label>
                                    <textarea
                                        name="description" value={productData.description} onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Tell about the product..."
                                        className="w-full bg-[#F3F3F3] border-none rounded-[8px] px-5 text-[12px] py-3 outline-none focus:ring-1 focus:ring-[#B58E58] resize-none"
                                    ></textarea>
                                </div>

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

                                <div className="relative">
                                    <label className="text-xs font-bold text-gray-400">COLLECTION</label>
                                    <select name="collectionId" value={productData.collectionId} onChange={handleInputChange} className="w-full bg-[#F3F3F3] rounded-[8px] px-4 py-3 mt-2 outline-none text-[12px] appearance-none">
                                        <option value="">Select Collection</option>
                                        {collections.map(col => <option key={col._id} value={col._id}>{col.name}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 bottom-4 text-gray-400" />
                                </div>

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

                    {/* UPDATED: Price Distribution Section */}
                    <div className=" mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-[18px] font-semibold text-[#222222]">Price Distribution (INR ₹)</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 bg-white rounded-[18px] p-8">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">
                                    Original / Cross Price (₹)
                                </label>

                                <input
                                    type="number"
                                    value={productData.price.compareAtPrice}
                                    onChange={(e) =>
                                        handleNestedChange('price', 'compareAtPrice', e.target.value)
                                    }
                                    placeholder="Enter original price, e.g. 1000"
                                    className="w-full bg-[#F3F3F3] rounded-[10px] px-4 py-3 mt-2 outline-none text-[12px]"
                                />
                            </div>

                            {/* Final Price Input */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase">Final Price (₹) - Includes 3% Tax</label>
                                <input
                                    type="number"
                                    value={productData.price.finalPrice}
                                    onChange={handlePriceChange}
                                    placeholder="Enter final price..."
                                    className="w-full bg-[#F3F3F3] rounded-[10px] px-4 py-3 mt-2 outline-none text-[12px]"
                                />
                            </div>

                            {/* Disabled Base Price & Tax */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Base Price (100%)</label>
                                    <input
                                        type="text"
                                        disabled
                                        value={productData.price.basePrice}
                                        className="w-full bg-gray-100 text-gray-500 rounded-[10px] px-4 py-3 mt-2 outline-none text-[12px] cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase">Tax (3%)</label>
                                    <input
                                        type="text"
                                        disabled
                                        value={productData.price.tax}
                                        className="w-full bg-gray-100 text-gray-500 rounded-[10px] px-4 py-3 mt-2 outline-none text-[12px] cursor-not-allowed"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

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
                                    <div
                                        key={i}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, i)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, i)}
                                        onClick={() => setCropModal({ isOpen: true, index: i, src: img.originalUrl || img.url })}
                                        className={`relative w-24 h-24 rounded-lg flex items-center justify-center cursor-move transition-all
                ${i === 0 ? 'border-2 border-[#B58E58] bg-[#FCF6F2] shadow-md' : 'border border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                                    >
                                        {/* THUMBNAIL HIGHLIGHTER */}
                                        {i === 0 && (
                                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#B58E58] text-white text-[9px] px-2 py-0.5 rounded-full font-bold z-10 whitespace-nowrap">
                                                Main Thumbnail
                                            </div>
                                        )}

                                        <img src={img.url} className="w-[85%] h-[85%] object-contain pointer-events-none" alt="preview" />

                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md z-20 hover:scale-110"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* --- CROP MODAL --- */}
                            {cropModal.isOpen && (
                                <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4">
                                    <h3 className="text-white font-bold mb-4">Crop Image (Drag to adjust)</h3>

                                    <div className="w-full flex justify-center items-center">
                                        <ReactCrop
                                            crop={crop}
                                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                                            onComplete={(c) => setCompletedCrop(c)}
                                            ruleOfThirds
                                        >
                                            {/* 
                  Using inline styles for maxHeight and maxWidth is the only 
                  guaranteed way to restrict react-image-crop 
                */}
                                            <img
                                                id="crop-source-image"
                                                src={cropModal.src}
                                                alt="Crop source"
                                                style={{ maxHeight: '65vh', maxWidth: '100%', objectFit: 'contain' }}
                                                className="block mx-auto"
                                            />
                                        </ReactCrop>
                                    </div>

                                    <div className="flex gap-4 mt-6">
                                        <button
                                            onClick={() => setCropModal({ isOpen: false, index: null, src: '' })}
                                            className="px-6 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveCrop}
                                            className="px-6 py-2 rounded-lg bg-[#B58E58] text-white font-semibold hover:bg-[#9a7645] transition-all flex items-center gap-2"
                                        >
                                            {isLoading ? 'Saving...' : 'Apply Crop'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-[18px] font-semibold text-[#222222] mb-4">Metal Details</h2>
                        <div className="grid grid-cols-2 gap-x-[63px] gap-y-6 bg-white rounded-[18px] p-8">
                            <div className="relative">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">Metal Type</label>
                                <select value={productData.metal.type} onChange={(e) => handleNestedChange('metal', 'type', e.target.value)} className="w-full bg-[#F3F3F3] rounded-[8px] px-4 py-3 mt-1 outline-none text-[12px] appearance-none">
                                    {/* <option value="Gold">Gold</option><option value="Silver">Silver</option><option value="Platinum">Platinum</option> */}
                                    <option value="Silver">Silver</option>
                                </select>
                                <ChevronDown size={14} className="absolute right-4 bottom-4 text-gray-400" />
                            </div>
                            {['quality', 'color', 'weight'].map(f => (
                                <div key={f}>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase">{f}</label>
                                    <input
                                        placeholder={f === 'color' ? 'e.g. Rose Gold' : f === 'quality' ? 'e.g. 92.5' : 'in grams'}
                                        value={productData.metal[f]}
                                        onChange={(e) => handleNestedChange('metal', f, e.target.value)}
                                        type={f === 'weight' ? 'number' : 'text'}
                                        className="w-full bg-[#F3F3F3] rounded-[8px] px-4 py-3 mt-1 outline-none text-[12px]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

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
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                            <h2 className="text-[18px] font-semibold text-[#222222]">
                                Dimensions
                            </h2>

                            <button
                                type="button"
                                onClick={addDimension}
                                className="text-[#B58E58] font-bold text-sm flex items-center gap-1 hover:underline"
                            >
                                <Plus size={14} /> Add Dimension
                            </button>
                        </div>

                        <div className="space-y-4">
                            {productData.dimensions.map((dimension, index) => (
                                <div
                                    key={index}
                                    className="relative grid grid-cols-2 xl:grid-cols-4 gap-3 border border-gray-100 rounded-xl p-4"
                                >
                                    {['width', 'length', 'size', 'stock'].map(field => (
                                        <div key={field}>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase">
                                                {field}
                                            </label>

                                            <input
                                                value={dimension[field]}
                                                onChange={(e) =>
                                                    handleDimensionChange(index, field, e.target.value)
                                                }
                                                type={field === 'stock' ? 'number' : 'text'}
                                                min={field === 'stock' ? 0 : undefined}
                                                step={field === 'stock' ? 1 : undefined}
                                                placeholder={
                                                    field === 'stock'
                                                        ? 'Quantity'
                                                        : field === 'size'
                                                            ? 'e.g. 7'
                                                            : 'e.g. 0.5 in'
                                                }
                                                className="w-full bg-[#F3F3F3] rounded-[8px] px-3 py-2 mt-1 outline-none text-[12px]"
                                            />
                                        </div>
                                    ))}

                                    {productData.dimensions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeDimension(index)}
                                            aria-label={`Remove dimension ${index + 1}`}
                                            className="absolute -top-2 -right-2 text-red-500 bg-white shadow-sm rounded-full p-1 border border-gray-100"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

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