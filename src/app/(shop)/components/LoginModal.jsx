'use client';
import React, { useState, useEffect } from 'react';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
    // State to track the current step: 'PHONE', 'OTP', or 'DETAILS'
    const [step, setStep] = useState('PHONE');
    
    // Form States
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(32);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep('PHONE');
            setPhoneNumber('');
            setOtp(['', '', '', '', '', '']);
            setTimer(32);
        }
    }, [isOpen]);

    // Simple timer for OTP resend
    useEffect(() => {
        let interval;
        if (step === 'OTP' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    if (!isOpen) return null;

    // --- Handlers ---
    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        setStep('OTP');
        setTimer(32); // Reset timer
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        setStep('DETAILS');
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        // Trigger success callback (e.g., logging the user in, updating global state)
        if (onSuccess) onSuccess();
        onClose();
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Auto-focus next input logic can be added here
    };

    return (
        // Backdrop with dim and blur effect
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            
            {/* Modal Container */}
            <div className="bg-[#FFFFFF] shadow-[0px_4px_22.3px_0px_#BF8F5F63] w-full max-w-[640px] p-8 sm:p-12 md:p-16 relative animate-in fade-in zoom-in-95 duration-200">
                
                {/* Close Button (X) */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center border border-[#BF8F5F] text-[#BF8F5F] hover:bg-[#F9F1E7] transition-colors rounded-none"
                    aria-label="Close"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {/* ================= STEP 1: PHONE NUMBER ================= */}
                {step === 'PHONE' && (
                    <div className="flex flex-col">
                        <h2 className="font-serif text-[28px] lg:text-[32px] text-[#222222] mb-3 leading-tight">
                            Login/Sign Up
                        </h2>
                        <p className="text-[#999999] text-[13px] md:text-[14px] leading-relaxed mb-8 max-w-md">
                            Lorem ipsum is a simple dummy Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks.
                        </p>

                        <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-[13px] text-[#222222]">Phone No.</label>
                                <input 
                                    type="tel" 
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Phone No." 
                                    className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-none border-0 w-full" 
                                />
                            </div>

                            <button type="submit" className="bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-widest py-4 px-12 hover:bg-black transition-colors rounded-none border-0 w-max mx-auto mt-2">
                                Continue
                            </button>
                        </form>
                    </div>
                )}

                {/* ================= STEP 2: VERIFY OTP ================= */}
                {step === 'OTP' && (
                    <div className="flex flex-col">
                        <h2 className="font-serif text-[28px] lg:text-[32px] text-[#222222] mb-3 leading-tight">
                            Verify OTP
                        </h2>
                        <p className="text-[#999999] text-[13px] md:text-[14px] leading-relaxed mb-8 max-w-md">
                            Lorem ipsum is a simple dummy Yes, all of our products are crafted with the highest quality materials and <span className="text-[#BF8F5F] font-bold">+91 {phoneNumber || '8765642310'}</span> <button onClick={() => setStep('PHONE')} className="text-[#BF8F5F] underline ml-1">Edit</button>
                        </p>

                        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-[13px] text-[#222222]">OTP</label>
                                <div className="flex gap-3 sm:gap-4">
                                    {otp.map((digit, idx) => (
                                        <input 
                                            key={idx}
                                            type="text" 
                                            maxLength="1"
                                            required
                                            value={digit}
                                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                                            placeholder="X" 
                                            className="bg-[#FCF6F2] w-12 h-12 sm:w-14 sm:h-14 text-center text-lg focus:outline-none placeholder-[#BF8F5F]/40 rounded-none border-0 text-[#BF8F5F] font-bold" 
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-end w-full mt-2">
                                    <p className="text-[12px] text-[#999999]">
                                        <button type="button" disabled={timer > 0} className={`font-bold ${timer === 0 ? 'text-[#BF8F5F]' : 'text-[#BF8F5F]/50'}`}>Resend Code</button> in 00:{timer < 10 ? `0${timer}` : timer}
                                    </p>
                                </div>
                            </div>

                            <button type="submit" className="bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-widest py-4 px-12 hover:bg-black transition-colors rounded-none border-0 w-max mx-auto mt-2">
                                Verify OTP
                            </button>
                        </form>
                    </div>
                )}

                {/* ================= STEP 3: PERSONAL DETAILS ================= */}
                {step === 'DETAILS' && (
                    <div className="flex flex-col">
                        <h2 className="font-serif text-[28px] lg:text-[32px] text-[#222222] mb-3 leading-tight">
                            Personal Details
                        </h2>
                        <p className="text-[#999999] text-[13px] md:text-[14px] leading-relaxed mb-8 max-w-md">
                            Lorem ipsum is a simple dummy Yes, all of our products are crafted with the highest quality materials
                        </p>

                        <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-6">
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[13px] text-[#222222]">First Name</label>
                                    <input type="text" required placeholder="First Name" className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/40 rounded-none border-0 w-full text-[#222222]" />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[13px] text-[#222222]">Last Name</label>
                                    <input type="text" required placeholder="Last Name" className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/40 rounded-none border-0 w-full text-[#222222]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[13px] text-[#222222]">Gender</label>
                                    <div className="relative">
                                        <select required className="w-full bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none text-[#BF8F5F] appearance-none cursor-pointer rounded-none border-0">
                                            <option value="" disabled selected>Select</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BF8F5F] pointer-events-none text-xs">▼</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[13px] text-[#222222]">Email <span className="text-[#999999]">(Optional)</span></label>
                                    <input type="email" placeholder="Email" className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/40 rounded-none border-0 w-full text-[#222222]" />
                                </div>
                            </div>

                            <button type="submit" className="bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-widest py-4 px-12 hover:bg-black transition-colors rounded-none border-0 w-max mx-auto mt-6">
                                Continue
                            </button>
                        </form>
                    </div>
                )}

                {/* ================= COMMON FOOTER ================= */}
                <div className="mt-10 text-center flex flex-col items-center">
                    <p className="text-[12px] text-[#999999]">
                        By Continuing you agree with our
                    </p>
                    <p className="text-[12px] text-[#BF8F5F]">
                        Terms & Condition <span className="text-[#999999]">and</span> Privacy Policy
                    </p>
                </div>

            </div>
        </div>
    );
}