'use client';
import React, { useState } from 'react';
import Image from 'next/image';

// --- Custom Sub-Component for Cursor-Tracking Zoom (Desktop Only) ---
const ZoomableImage = ({ src, alt, priority }) => {
    const [position, setPosition] = useState({ x: '50%', y: '50%' });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        
        setPosition({ x: `${x}%`, y: `${y}%` });
    };

    return (
        <div 
            className="relative w-full h-full overflow-hidden bg-[#0C0E17] cursor-crosshair group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            <div 
                className="absolute inset-0 w-full h-full transition-transform duration-150 ease-out"
                style={{
                    transformOrigin: `${position.x} ${position.y}`,
                    transform: isHovered ? 'scale(2)' : 'scale(1)' 
                }}
            >
                <Image 
                    src={src} 
                    alt={alt} 
                    fill 
                    priority={priority}
                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                />
            </div>
        </div>
    );
};

// --- Main Gallery Component ---
export default function LuxeProductGallery({ images = [], thumbnail }) {
    const fallbackImage = thumbnail || "/placeholder.webp";
    
    let displayImages = images.length > 0 ? [...images] : [fallbackImage];

    // Auto-Pad Logic: Duplicate images if fewer than 4
    while (displayImages.length < 4) {
        displayImages.push(displayImages[0]);
    }

    const [activeMobileImage, setActiveMobileImage] = useState(displayImages[0]);

    return (
        <>
            {/* =========================================
                MOBILE LAYOUT
            ========================================= */}
            <div className="flex md:hidden flex-col relative w-full">
                {/* Luxe Gradient Border Wrapper */}
                <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#D6B693] to-transparent p-[0.5px]">
                    <div className="relative w-full h-full bg-[#0C0E17]">
                        <Image 
                            src={activeMobileImage} 
                            alt="Main Product View" 
                            fill 
                            priority 
                            className="object-cover transition-opacity duration-300" 
                        />
                        
                        {/* Floating Thumbnails */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4 z-10 overflow-x-auto no-scrollbar">
                            {displayImages.map((imgSrc, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveMobileImage(imgSrc)}
                                    className={`relative w-12 h-16 shrink-0 overflow-hidden transition-all duration-300 shadow-xl bg-[#0C0E17] ${
                                        activeMobileImage === imgSrc 
                                            ? 'border border-[#D6B693] scale-110 opacity-100' 
                                            : 'border border-white/20 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <Image 
                                        src={imgSrc} 
                                        alt={`Thumbnail ${idx + 1}`} 
                                        fill 
                                        className="object-cover" 
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================
                DESKTOP LAYOUT (2x2 Grid with Gradient Borders)
            ========================================= */}
            <div className="hidden md:grid md:grid-cols-2 gap-4">
                {displayImages.map((imgSrc, idx) => (
                    <div key={idx} className="relative w-full aspect-[3/4] bg-gradient-to-b from-[#D6B693] to-transparent p-[0.5px]">
                        <ZoomableImage 
                            src={imgSrc} 
                            alt={`Product View ${idx + 1}`} 
                            priority={idx === 0} 
                        />
                    </div>
                ))}
            </div>
        </>
    );
}