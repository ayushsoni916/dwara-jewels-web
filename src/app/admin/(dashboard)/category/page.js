"use client";
import React, { useEffect, useState } from 'react';
import { Plus, X, Image as ImageIcon, Star, Crown, Loader2, Edit2, Trash2 } from 'lucide-react';
// import imageCompression from 'browser-image-compression';
// import heic2any from "heic2any";

const CategoryManagement = () => {
    // State management
    const [categoryName, setCategoryName] = useState('');
    const [subCategories, setSubCategories] = useState(['']); // Array of strings
    const [isFeatured, setIsFeatured] = useState(false);
    const [isLuxury, setIsLuxury] = useState(false);

    // Image State
    const [categoryImage, setCategoryImage] = useState(null); // Holds { url, file }
    const [isConverting, setIsConverting] = useState(false);

    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '' });

    // --- 1. Fetch Categories on Load ---
    const fetchCategories = async () => {
        try {
            const res = await fetch('https://dwarajewels.in/api/category');
            const data = await res.json();
            if (data.success) setCategories(data.categories);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // --- 2. Toast Handler ---
    const showToast = (msg) => {
        setToast({ show: true, message: msg });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    // --- Image Handling Logic ---
    // const handleImageUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     setIsConverting(true);
    //     const options = {
    //         maxSizeMB: 1,
    //         maxWidthOrHeight: 1920,
    //         useWebWorker: true,
    //         fileType: "image/webp"
    //     };

    //     try {
    //         let fileToCompress = file;
    //         const isHEIC = file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic");

    //         if (isHEIC) {
    //             const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
    //             const safeBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    //             fileToCompress = new File([safeBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
    //         }

    //         const compressedFile = await imageCompression(fileToCompress, options);
    //         const finalWebpName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    //         const webpBlob = new File([compressedFile], finalWebpName, { type: "image/webp" });

    //         setCategoryImage({
    //             url: URL.createObjectURL(webpBlob),
    //             file: webpBlob
    //         });
    //     } catch (error) {
    //         console.error("Conversion failed:", error);
    //     } finally {
    //         setIsConverting(false);
    //     }
    // };
    // --- Image Handling Logic ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsConverting(true);
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: "image/webp"
        };

        try {
            // Dynamically import browser-only libraries HERE
            const imageCompression = (await import('browser-image-compression')).default;
            const heic2any = (await import('heic2any')).default;

            let fileToCompress = file;
            const isHEIC = file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic");

            if (isHEIC) {
                const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
                const safeBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                fileToCompress = new File([safeBlob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
            }

            const compressedFile = await imageCompression(fileToCompress, options);
            const finalWebpName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const webpBlob = new File([compressedFile], finalWebpName, { type: "image/webp" });

            setCategoryImage({
                url: URL.createObjectURL(webpBlob),
                file: webpBlob
            });
        } catch (error) {
            console.error("Conversion failed:", error);
        } finally {
            setIsConverting(false);
        }
    };

    const removeImage = () => {
        setCategoryImage(null);
    };

    // Handlers for Sub Categories
    const addSubCategory = () => setSubCategories([...subCategories, '']);

    const updateSubCategory = (index, value) => {
        const updated = [...subCategories];
        updated[index] = value;
        setSubCategories(updated);
    };

    const removeSubCategory = (index) => {
        setSubCategories(subCategories.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!categoryName || !categoryImage) return alert("Name and Image are required");
        setIsLoading(true);

        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('image', categoryImage.file); // The WebP file blob
        formData.append('subCategories', subCategories.join(','));
        formData.append('isFeatured', isFeatured);
        formData.append('isLuxeCategory', isLuxury);

        try {
            const response = await fetch('https://dwarajewels.in/api/category', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                showToast("Category Created Successfully!");
                // Reset Form
                setCategoryName('');
                setSubCategories(['']);
                setCategoryImage(null);
                setIsFeatured(false);
                setIsLuxury(false);
                // Refresh List
                fetchCategories();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-[#f4f0ea] to-[#fafafa] px-6.5 pt-5 pb-10 relative">
            {/* TOAST NOTIFICATION */}
            {toast.show && (
                <div className="fixed top-10 right-10 bg-black text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce">
                    {toast.message}
                </div>
            )}
            <h1 className="text-[#222222] text-[24px] font-bold">Category Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[63px] mt-[30px]">

                {/* LEFT COLUMN: Basic Info & Sub Categories */}
                <div className="space-y-8">
                    <h2 className="text-[18px] font-semibold text-[#222222] mb-4">Category Details</h2>

                    <div className="bg-white rounded-[16px] p-6.5">

                        {/* Category Name */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-4">Category Name</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="e.g. Rings, Necklaces..."
                                className="w-full bg-[#F3F3F3] rounded-[8px] px-5 py-3 outline-none focus:ring-1 focus:ring-[#B58E58] text-[12px]"
                            />
                        </div>

                        {/* Sub Categories Array */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-medium text-gray-700">Sub Categories</label>
                                <button
                                    onClick={addSubCategory}
                                    className="text-[#B58E58] text-sm font-bold flex items-center gap-1 hover:underline"
                                >
                                    <Plus size={14} /> Add Sub
                                </button>
                            </div>
                            <div className="space-y-3">
                                {subCategories.map((sub, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={sub}
                                            onChange={(e) => updateSubCategory(index, e.target.value)}
                                            placeholder={`Sub Category ${index + 1}`}
                                            className="flex-1 bg-[#F3F3F3] rounded-[10px] px-4 py-2 text-sm outline-none"
                                        />
                                        {subCategories.length > 1 && (
                                            <button
                                                onClick={() => removeSubCategory(index)}
                                                className="p-2 text-gray-400 hover:text-red-500"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Toggles Box */}
                    <h2 className="text-[18px] font-semibold text-[#222222] mb-4">Display Settings</h2>
                    <div className="bg-white rounded-[16px] p-6.5">

                        <div className="flex gap-8">
                            {/* Is Featured */}
                            <button
                                onClick={() => setIsFeatured(!isFeatured)}
                                className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-xl border-2 transition-all
                                ${isFeatured ? 'border-[#B58E58] bg-[#F9F4EF] text-[#B58E58]' : 'border-gray-100 text-gray-400'}`}
                            >
                                <Star size={20} fill={isFeatured ? "#B58E58" : "none"} />
                                <span className="font-bold">Featured</span>
                            </button>

                            {/* Is Luxury */}
                            <button
                                onClick={() => setIsLuxury(!isLuxury)}
                                className={`flex-1 flex items-center justify-center gap-3 p-3 rounded-xl border-2 transition-all
                                ${isLuxury ? 'border-[#B58E58] bg-[#F9F4EF] text-[#B58E58]' : 'border-gray-100 text-gray-400'}`}
                            >
                                <Crown size={20} fill={isLuxury ? "#B58E58" : "none"} />
                                <span className="font-bold">Luxury</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Image Upload */}
                <div className="">
                    <h2 className="text-[18px] font-semibold text-[#222222] mb-4">Category Image</h2>

                    <div className='bg-white rounded-[16px] p-6.5 h-fit'>
                        <div className="relative group w-full h-[275px] border-2 border-dashed border-gray-200 rounded-[20px] bg-gray-50 overflow-hidden flex items-center justify-center">
                            {isConverting ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="animate-spin text-[#B58E58]" size={32} />
                                    <p className="text-xs text-gray-500">Converting to WebP...</p>
                                </div>
                            ) : categoryImage ? (
                                <>
                                    <img src={categoryImage.url} className="w-full h-full object-contain" alt="Preview" />
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </>
                            ) : (
                                <label className="cursor-pointer text-center flex flex-col items-center">
                                    <ImageIcon className="text-[#B58E58] mb-2" size={40} />
                                    <p className="font-semibold">Upload Category Image</p>
                                    <p className="text-gray-400 text-xs">PNG, JPG, HEIC supported</p>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            )}
                        </div>

                        <button
                            disabled={isLoading}
                            className={`w-full mt-8 text-white py-4 rounded-[15px] font-bold shadow-lg transition-all flex items-center justify-center gap-2 
                            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B58E58] hover:bg-[#9a7645]'}`}
                            onClick={handleSubmit}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : null}
                            {isLoading ? 'Creating...' : 'Create Category'}
                        </button>
                    </div>
                </div>



            </div>
            <div className="mt-[60px]">
                <h2 className="text-[18px] font-semibold text-[#222222] mb-6">Available Categories</h2>
                <div className="bg-white rounded-[16px] overflow-hidden shadow-sm border border-gray-50">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Image</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Sub Categories</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <img
                                            src={typeof cat.image === 'string' ? cat.image : cat.image?.url}
                                            className="w-12 h-12 rounded-lg object-contain bg-gray-50"
                                            alt={cat.name}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-[#222222]">{cat.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {cat.isFeatured && <span className="bg-yellow-50 text-yellow-600 text-[10px] px-2 py-1 rounded-md font-bold uppercase">Featured</span>}
                                            {cat.isLuxeCategory && <span className="bg-purple-50 text-purple-600 text-[10px] px-2 py-1 rounded-md font-bold uppercase">Luxe</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {cat.subCategories?.slice(0, 5).join(', ')}
                                        {cat.subCategories?.length > 5 && '...'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-blue-500 hover:text-blue-700"><Edit2 size={16} /></button>
                                            <button className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;