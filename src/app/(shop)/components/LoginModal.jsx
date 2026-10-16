'use client';

import React, { useState, useEffect, useRef } from 'react';
import { authRequest } from '../../../../lib/authApi';
import { useAuth } from '../../../../context/AuthContext';

export default function LoginModal({ isOpen, onClose, onSuccess }) {
    const { login } = useAuth();

    const [step, setStep] = useState('PHONE');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(0);
    const [signupToken, setSignupToken] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const pendingRef = useRef(false);
    const otpRefs = useRef([]);

    useEffect(() => {
        if (!isOpen) return;

        setStep('PHONE');
        setPhoneNumber('');
        setOtp(['', '', '', '', '', '']);
        setTimer(0);
        setSignupToken('');
        setError('');
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || step !== 'OTP' || timer <= 0) return;

        const timeout = setTimeout(() => setTimer(value => value - 1), 1000);
        return () => clearTimeout(timeout);
    }, [isOpen, step, timer]);

    const run = async action => {
        if (pendingRef.current) return;

        pendingRef.current = true;
        setBusy(true);
        setError('');

        try {
            await action();
        } catch (err) {
            setError(err.message || 'Please try again.');

            if (err.status === 401 && step === 'DETAILS') {
                setSignupToken('');
                setStep('PHONE');
            }
        } finally {
            pendingRef.current = false;
            setBusy(false);
        }
    };

    const finishLogin = data => {
        if (!data.user?._id || !data.expiresAt) {
            throw new Error('Invalid login response');
        }

        login(data.user, data.expiresAt);
        onClose();
        onSuccess?.(data.user);
    };

    const handlePhoneSubmit = async event => {
        event.preventDefault();

        await run(async () => {
            const phone = phoneNumber.trim();

            if (!/^\d{10}$/.test(phone)) {
                throw new Error('Enter a valid 10-digit mobile number.');
            }

            await authRequest('send-otp', { phone });

            setPhoneNumber(phone);
            setOtp(['', '', '', '', '', '']);
            setSignupToken('');
            setTimer(50);
            setStep('OTP');
        });
    };

    const handleOtpSubmit = async event => {
        event.preventDefault();

        await run(async () => {
            const code = otp.join('');

            if (!/^\d{6}$/.test(code)) {
                throw new Error('Enter the complete 6-digit OTP.');
            }

            const data = await authRequest('verify-otp', {
                phone: phoneNumber,
                code,
            });

            if (data.isNewUser) {
                setSignupToken(data.signupToken);
                setStep('DETAILS');
                return;
            }

            finishLogin(data);
        });
    };

    const handleResendOtp = async () => {
        if (timer > 0 || step !== 'OTP') return;

        await run(async () => {
            await authRequest('send-otp', { phone: phoneNumber });
            setOtp(['', '', '', '', '', '']);
            setTimer(50);
            otpRefs.current[0]?.focus();
        });
    };

    const handleDetailsSubmit = async event => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);

        await run(async () => {
            const payload = {
                signupToken,
                firstName: String(form.get('firstName') || '').trim(),
                lastName: String(form.get('lastName') || '').trim(),
                gender: String(form.get('gender') || ''),
                email: String(form.get('email') || '').trim().toLowerCase(),
            };

            if (!payload.firstName || !payload.lastName || !payload.gender) {
                throw new Error('Please fill all required details.');
            }

            if (
                payload.email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
            ) {
                throw new Error('Enter a valid email address.');
            }

            finishLogin(await authRequest('signup', payload));
        });
    };

    const handleOtpChange = (index, value) => { 
        const digits = value.replace(/\D/g, '').slice(0, 6);
        const start = digits.length === 6 ? 0 : index;

        setOtp(previous => {
            const next = [...previous];
            next[start] = '';

            for (let i = 0; i < digits.length && start + i < 6; i++) {
                next[start + i] = digits[i];
            }

            return next;
        });

        if (digits.length) {
            otpRefs.current[Math.min(start + digits.length, 5)]?.focus();
        }
    };

    if (!isOpen) return null;

    // Keep your existing JSX return here.
    return (
        // Backdrop with dim and blur effect
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            {/* Modal Container */}
            <div className="bg-[#FFFFFF] shadow-[0px_4px_22.3px_0px_#BF8F5F63] w-full max-w-[640px] p-8 sm:p-12 md:p-16 relative animate-in fade-in zoom-in-95 duration-200">

                {/* Close Button (X) */}
                <button
                    onClick={onClose}
                    disabled={busy}
                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center border border-[#BF8F5F] text-[#BF8F5F] hover:bg-[#F9F1E7] transition-colors rounded-none"
                    aria-label="Close"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {error && (
                    <p role="alert" className="mb-5 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* ================= STEP 1: PHONE NUMBER ================= */}
                {step === 'PHONE' && (
                    <div className="flex flex-col">
                        <h2 className="font-serif text-[28px] lg:text-[32px] text-[#222222] mb-3 leading-tight">
                            Login/Sign Up
                        </h2>
                        <p className="text-[#999999] text-[13px] md:text-[14px] leading-relaxed mb-8 max-w-md">
                            Lorem ipsum is a simple dummy Yes, all of our products are crafted with the highest quality materials and undergo thorough quality checks.
                        </p>
                        <fieldset disabled={busy} className="contents">
                            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[13px] text-[#222222]">Phone No.</label>
                                    <input
                                        inputMode="numeric"
                                        autoComplete="tel-national"
                                        maxLength={10}
                                        disabled={busy}
                                        value={phoneNumber}
                                        onChange={event =>
                                            setPhoneNumber(event.target.value.replace(/\D/g, '').slice(0, 10))
                                        }
                                        required
                                        placeholder="Phone No."
                                        className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-none border-0 w-full"
                                    />
                                </div>

                                <button type="submit" className="bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-widest py-4 px-12 hover:bg-black transition-colors rounded-none border-0 w-max mx-auto mt-2">
                                    {busy ? 'Sending OTP…' : 'Continue'}
                                </button>
                            </form>
                        </fieldset>
                    </div>
                )}

                {/* ================= STEP 2: VERIFY OTP ================= */}
                {step === 'OTP' && (
                    <div className="flex flex-col">
                        <h2 className="font-serif text-[28px] lg:text-[32px] text-[#222222] mb-3 leading-tight">
                            Verify OTP
                        </h2>
                        <p className="text-[#999999] text-[13px] md:text-[14px] leading-relaxed mb-8 max-w-md">
                            Lorem ipsum is a simple dummy Yes, all of our products are crafted with the highest quality materials and <span className="text-[#BF8F5F] font-bold">+91 {phoneNumber || '8765642310'}</span>
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => {
                                    setError('');
                                    setSignupToken('');
                                    setOtp(['', '', '', '', '', '']);
                                    setStep('PHONE');
                                }}
                                className="text-[#BF8F5F] underline ml-1"
                            >
                                Edit
                            </button>
                        </p>
                        <fieldset disabled={busy} className="contents">

                            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[13px] text-[#222222]">OTP</label>
                                    <div className="flex gap-2 sm:gap-4">
                                        {otp.map((digit, idx) => (
                                            <input
                                                key={idx}
                                                ref={element => { otpRefs.current[idx] = element; }}
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                                                aria-label={`OTP digit ${idx + 1}`}
                                                maxLength={1}
                                                required
                                                disabled={busy}
                                                value={digit}
                                                onChange={event => handleOtpChange(idx, event.target.value)}
                                                onPaste={event => {
                                                    event.preventDefault();
                                                    handleOtpChange(idx, event.clipboardData.getData('text'));
                                                }}
                                                onKeyDown={event => {
                                                    if (event.key === 'Backspace' && !digit && idx > 0) {
                                                        otpRefs.current[idx - 1]?.focus();
                                                    }
                                                }}
                                                placeholder="X"
                                                className="bg-[#FCF6F2] flex-1 min-w-0 h-12 sm:h-14 text-center text-lg focus:outline-none placeholder-[#BF8F5F]/40 rounded-none border-0 text-[#BF8F5F] font-bold"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-end w-full mt-2">
                                        <p className="text-[12px] text-[#999999]">
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={timer > 0 || busy}
                                                className="font-bold text-[#BF8F5F] disabled:opacity-50"
                                            >
                                                Resend Code
                                            </button>

                                            {timer > 0 && ` in 00:${String(timer).padStart(2, '0')}`}
                                        </p>
                                    </div>
                                </div>

                                <button type="submit" className="bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-widest py-4 px-12 hover:bg-black transition-colors rounded-none border-0 w-max mx-auto mt-2">
                                    {busy ? 'Verifying…' : 'Verify OTP'}
                                </button>
                            </form>
                        </fieldset>
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
                        <fieldset disabled={busy} className="contents">

                            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-6">

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[13px] text-[#222222]">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            required
                                            placeholder="First Name"
                                            className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none rounded-none border-0 w-full text-[#222222]"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[13px] text-[#222222]">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            required
                                            placeholder="Last Name"
                                            className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none rounded-none border-0 w-full text-[#222222]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[13px] text-[#222222]">Gender</label>
                                        <div className="relative">
                                            <select
                                                name="gender"
                                                defaultValue=""
                                                required
                                                className="w-full bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none text-[#BF8F5F] appearance-none cursor-pointer rounded-none border-0"
                                            >
                                                <option value="" disabled>Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BF8F5F] pointer-events-none text-xs">▼</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[13px] text-[#222222]">Email <span className="text-[#999999]">(Optional)</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            className="bg-[#FCF6F2] px-5 py-4 text-sm focus:outline-none rounded-none border-0 w-full text-[#222222]"
                                        />

                                    </div>
                                </div>

                                <button type="submit" className="bg-[#BF8F5F] text-white font-bold text-xs uppercase tracking-widest py-4 px-12 hover:bg-black transition-colors rounded-none border-0 w-max mx-auto mt-6">
                                    {busy ? 'Saving…' : 'Continue'}
                                </button>
                            </form>
                        </fieldset>
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