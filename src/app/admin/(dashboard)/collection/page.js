"use client";
import React, { useState, useEffect, useRef } from 'react';

import {
    Plus,
    X,
    Image as ImageIcon,
    Loader2,
    Trash2,
    Edit2,
} from 'lucide-react';

import {
    fetchCollectionApi,
    saveCollectionApi,
} from '../../../api/collectionApi';
// import imageCompression from 'browser-image-compression';
// import heic2any from "heic2any";

const CollectionManagement = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [collections, setCollections] = useState([]);

    const [isConverting, setIsConverting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '' });

    const [editingId, setEditingId] = useState(null);

    const saveLock = useRef(false);
    const listRequest = useRef(0);

    const isEdit = Boolean(editingId);

    const showToast = message => {
        setToast({ show: true, message });

        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 3000);
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setImage(null);
    };

    const handleEdit = collection => {
        if (saveLock.current || isLoading || isConverting) return;

        const imageUrl = typeof collection.image === 'string'
            ? collection.image
            : collection.image?.url;

        setEditingId(collection._id);
        setName(collection.name || '');

        setImage(
            imageUrl
                ? { url: imageUrl, file: null }
                : null
        );

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- Fetch Collections ---
    const fetchCollections = async () => {
        const requestId = ++listRequest.current;

        try {
            const data = await fetchCollectionApi();

            if (!data.success || !Array.isArray(data.collections)) {
                throw new Error(data.error || 'Unable to fetch collections');
            }

            if (requestId === listRequest.current) {
                setCollections(data.collections);
            }
        } catch (error) {
            if (requestId === listRequest.current) {
                showToast(error.data?.error || error.message);
            }
        }
    };

    useEffect(() => { fetchCollections(); }, []);

    useEffect(() => {
        const url = image?.url;

        return () => {
            if (url?.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        };
    }, [image?.url]);

    // --- Universal WebP Image Handler ---
    const handleImageUpload = async (e) => {
        const input = e.target;
        const file = input.files?.[0];

        input.value = '';

        if (!file || isLoading || isConverting) return;

        setIsConverting(true);
        try {
            const imageCompression = (await import('browser-image-compression')).default;
            const heic2any = (await import('heic2any')).default;
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
        if (saveLock.current || isLoading || isConverting) return;

        if (!name.trim()) {
            return showToast('Collection name is required');
        }

        if (!image?.url || (!editingId && !image.file)) {
            return showToast('Collection image is required');
        }

        saveLock.current = true;
        setIsLoading(true);

        try {
            const formData = new FormData();

            formData.append('name', name.trim());

            // Existing image stays when no replacement file is selected.
            if (image.file) {
                formData.append('image', image.file);
            }

            await saveCollectionApi(formData, editingId || undefined);

            showToast(
                editingId
                    ? 'Collection Updated!'
                    : 'Collection Created!'
            );

            resetForm();
            await fetchCollections();
        } catch (error) {
            showToast(
                error.data?.error ||
                error.message ||
                'Unable to save collection'
            );
        } finally {
            saveLock.current = false;
            setIsLoading(false);
        }
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
                <fieldset
                    disabled={isLoading || isConverting}
                    className="bg-white rounded-[16px] p-8 shadow-sm h-fit min-w-0 border-0"
                >
                    <h2 className="text-[18px] font-semibold mb-6">
                        {isEdit ? 'Edit Collection' : 'Create Collection'}
                    </h2>

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
                                        <button onClick={() => setImage(null)} className="absolute top-3 right-3 bg-red-500 text-white p-1.5 rounded-full shadow-md"><X size={16} /></button>
                                    </>
                                ) : (
                                    <label className="cursor-pointer text-center flex flex-col items-center">
                                        <ImageIcon className="text-[#B58E58] mb-2" size={32} />
                                        <p className="text-sm font-semibold">Upload Banner</p>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                )}
                        </div>
                        {image && (
                            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-[#B58E58] hover:underline">
                                <ImageIcon size={16} />
                                Change Image

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={isLoading || isConverting}
                                    onChange={handleImageUpload}
                                />
                            </label>
                        )}
                    </div>

                    <button
                        type="button"
                        disabled={isLoading || isConverting}
                        onClick={handleSubmit}
                        className={`w-full py-4 rounded-[12px] font-bold text-white flex items-center justify-center gap-2 ${isLoading || isConverting
                            ? 'bg-gray-400'
                            : 'bg-[#B58E58] hover:bg-[#9a7645] shadow-lg shadow-[#B58E58]/20'
                            }`}
                    >
                        {isLoading && (
                            <Loader2 className="animate-spin" size={18} />
                        )}

                        {isLoading
                            ? isEdit
                                ? 'Updating...'
                                : 'Creating...'
                            : isEdit
                                ? 'Update Collection'
                                : 'Save Collection'}
                    </button>

                    {isEdit && (
                        <button
                            type="button"
                            disabled={isLoading || isConverting}
                            onClick={resetForm}
                            className="w-full mt-3 py-2 text-sm font-medium text-gray-500 hover:text-[#B58E58] transition-colors"
                        >
                            Cancel Edit
                        </button>
                    )}
                </fieldset>

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
                                <button
                                    type="button"
                                    onClick={() => handleEdit(col)}
                                    disabled={isLoading || isConverting}
                                    title="Edit collection"
                                    aria-label={`Edit ${col.name}`}
                                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all disabled:cursor-not-allowed"
                                >
                                    <Edit2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CollectionManagement;