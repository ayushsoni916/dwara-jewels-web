"use client";
import React, { useState, useEffect } from 'react';
import { Plus, X, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import heic2any from "heic2any";

const CollectionManagement = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [collections, setCollections] = useState([]);
    
    const [isConverting, setIsConverting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '' });

    // --- Fetch Collections ---
    const fetchCollections = async () => {
        try {
            const res = await fetch('http://localhost:4500/api/collection');
            const data = await res.json();
            if (data.success) setCollections(data.collections);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchCollections(); }, []);

    // --- Universal WebP Image Handler ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsConverting(true);
        try {
            let fileToProcess = file;
            if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
                const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
                fileToProcess = new File([Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob], 
                    file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg" });
            }
            const compressedFile = await imageCompression(fileToProcess, { maxSizeMB: 1, fileType: "image/webp" });
            const webpBlob = new File([compressedFile], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: "image/webp" });
            setImage({ url: URL.createObjectURL(webpBlob), file: webpBlob });
        } catch (err) { console.error(err); } finally { setIsConverting(false); }
    };

    // --- Submit Logic ---
    const handleSubmit = async () => {
        if (!name || !image) return alert("Name and Image are required");
        setIsLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image.file);

        try {
            const res = await fetch('http://localhost:4500/api/collection', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setToast({ show: true, message: "Collection Created!" });
                setTimeout(() => setToast({ show: false }), 3000);
                setName(''); setImage(null);
                fetchCollections();
            }
        } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-[#f4f0ea] to-[#fafafa] px-6.5 pt-5 pb-10">
            {toast.show && (
                <div className="fixed top-10 right-10 bg-black text-white px-6 py-3 rounded-xl z-50 shadow-2xl">
                    {toast.message}
                </div>
            )}

            <h1 className="text-[#222222] text-[24px] font-bold mb-8">Collection Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[63px]">
                {/* LEFT: Add Collection */}
                <div className="bg-white rounded-[16px] p-8 shadow-sm h-fit">
                    <h2 className="text-[18px] font-semibold mb-6">Create Collection</h2>
                    
                    <div className="mb-6">
                        <label className="block text-[12px] font-medium mb-3">Collection Name</label>
                        <input 
                            type="text" value={name} onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Bridal Collection, Summer Special"
                            className="w-full bg-[#F3F3F3] text-[12px] rounded-[8px] px-4 py-3 outline-none focus:ring-1 focus:ring-[#B58E58]"
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-3">Collection Image</label>
                        <div className="relative h-[250px] border-2 border-dashed border-gray-200 rounded-[15px] bg-gray-50 flex items-center justify-center overflow-hidden">
                            {isConverting ? <Loader2 className="animate-spin text-[#B58E58]" /> : 
                             image ? (
                                <>
                                    <img src={image.url} className="w-full h-full object-contain p-4" alt="preview" />
                                    <button onClick={() => setImage(null)} className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full shadow-md"><X size={16}/></button>
                                </>
                             ) : (
                                <label className="cursor-pointer text-center flex flex-col items-center">
                                    <ImageIcon className="text-[#B58E58] mb-2" size={32} />
                                    <p className="text-sm font-semibold">Upload Banner</p>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                             )}
                        </div>
                    </div>

                    <button 
                        disabled={isLoading} onClick={handleSubmit}
                        className={`w-full py-4 rounded-[12px] font-bold text-white flex items-center justify-center gap-2
                        ${isLoading ? 'bg-gray-400' : 'bg-[#B58E58] hover:bg-[#9a7645] shadow-lg shadow-[#B58E58]/20'}`}
                    >
                        {isLoading && <Loader2 className="animate-spin" size={18} />}
                        {isLoading ? 'Creating...' : 'Save Collection'}
                    </button>
                </div>

                {/* RIGHT: Collection List */}
                <div className="bg-white rounded-[16px] p-8 shadow-sm h-fit">
                    <h2 className="text-[18px] font-semibold mb-6">Available Collections</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {collections.map((col) => (
                            <div key={col._id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 group transition-all">
                                <div className="w-16 h-16 rounded-lg bg-[#F9F4EF] overflow-hidden flex-shrink-0">
                                    <img src={col.image.url} alt={col.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-[#222222]">{col.name}</p>
                                    <p className="text-[10px] text-gray-400">ID: {col._id.slice(-6).toUpperCase()}</p>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionManagement;