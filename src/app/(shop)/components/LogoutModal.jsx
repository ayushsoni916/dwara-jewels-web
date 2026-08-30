import React from 'react';

export default function LogoutModal({ isOpen, onClose, onLogout }) {
    if (!isOpen) return null;

    return (
        // Backdrop with dim and blur effect
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            
            {/* Modal Container with Custom Shadow */}
            <div className="bg-[#FFFFFF] shadow-[0px_4px_22.3px_0px_#BF8F5F63] w-full max-w-[560px] p-8 md:p-12 relative animate-in fade-in zoom-in-95 duration-200">
                
                {/* Close Button (X) */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center border border-[#BF8F5F] text-[#BF8F5F] hover:bg-[#F9F1E7] transition-colors"
                    aria-label="Close"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* Content */}
                <div className="pr-8 sm:pr-0">
                    <h2 className="font-serif text-2xl md:text-[32px] leading-tight text-[#222222] mb-4">
                        Are you sure you want to logout?
                    </h2>
                    <p className="text-gray-500 text-[13px] md:text-sm leading-relaxed mb-10 md:mb-12 max-w-[420px]">
                        Lorem ipsum is a simple dummy Yes, all of our products are crafted with the highest quality materials
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <button 
                        onClick={onLogout}
                        className="w-full sm:w-1/2 border border-[#BF8F5F] text-[#BF8F5F] font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-[#F9F1E7] transition-colors rounded-sm"
                    >
                        Logout
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full sm:w-1/2 bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-widest py-3.5 hover:bg-black transition-colors rounded-sm"
                    >
                        Back To Home
                    </button>
                </div>

            </div>
        </div>
    );
}