'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
    getAddresses,
    addAddressApi,
    // updateAddress,
} from '../../../api/addressApi';

import { getCart } from '../../../api/cartApi';

export default function CheckoutAddress() {
    // State for toggle buttons & saved address view
    const router = useRouter();
    const submittingRef = useRef(false);

    const [addressType, setAddressType] = useState('Home');
    const [billingAddress, setBillingAddress] = useState('Same');

    const [savedAddress, setSavedAddress] = useState(null);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const addressDialogRef = useRef(null);
    const [addressError, setAddressError] = useState('');

    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const [error, setError] = useState('');

    const emptyForm = {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        area: '',
        landmark: '',
        dist: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
    };

    const [form, setForm] = useState(emptyForm);

    const normalizePhone = (value) => {
        const digits = String(value || '').replace(/\D/g, '');

        return digits.length === 12 && digits.startsWith('91')
            ? digits.slice(2)
            : digits;
    };

    const fillForm = (address) => {
        setForm({
            ...emptyForm,
            ...address,
            phone: normalizePhone(address?.phone),
            landmark: '',
            country: 'India',
        });

        setAddressType(address?.addressType || 'Home');
    };

    useEffect(() => {
        let active = true;

        const loadCheckout = async () => {
            setLoading(true);
            setLoaded(false);
            setError('');

            try {
                const [addressResponse, cartResponse] = await Promise.all([
                    getAddresses(),
                    getCart(),
                ]);

                if (
                    addressResponse?.success !== true ||
                    !Array.isArray(addressResponse.addresses) ||
                    cartResponse?.success !== true
                ) {
                    throw new Error('Unable to load checkout details.');
                }

                if (!active) return;

                const addresses = addressResponse.addresses;
                const address =
                    addresses.find(item => item.isDefault) ||
                    addresses[0] ||
                    null;

                setSavedAddress(address);
                setCartData(cartResponse.cart);
                fillForm(address);
                setIsEditingAddress(!address);
                setLoaded(true);
            } catch (err) {
                if (!active) return;

                if (err.status === 401) {
                    window.location.replace('/login');
                    return;
                }

                setError(err.message || 'Unable to load checkout details.');
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCheckout();

        return () => {
            active = false;
        };
    }, [retryKey]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value,
        }));
    };

    const bindInput = (name, options = {}) => ({
        name,
        value: form[name] ?? '',
        onChange: handleChange,
        disabled: loading || saving,
        ...options,
    });

    const handleEdit = () => {
        if (loading || saving || !loaded) return;

        setForm({ ...emptyForm });
        setAddressType('Home');
        setAddressError('');
        setError('');
        setIsEditingAddress(true);
    };

    const closeAddressPopup = () => {
        if (submittingRef.current) return;

        setIsEditingAddress(false);
        setAddressError('');
    };

    useEffect(() => {
        const dialog = addressDialogRef.current;

        if (!dialog) return;

        if (!isEditingAddress || !loaded || loading) {
            if (dialog.open) dialog.close();
            return;
        }

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        if (!dialog.open) dialog.showModal();

        return () => {
            if (dialog.open) dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, [isEditingAddress, loaded, loading]);

    const handleSaveAddress = async (event) => {
        event.preventDefault();

        if (submittingRef.current || loading || !loaded) return;

        setAddressError('');

        const payload = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            phone: normalizePhone(form.phone),
            email: form.email.trim(),
            addressLine1: form.addressLine1.trim(),
            addressLine2: form.addressLine2.trim(),
            area: form.area.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            dist: String(form.dist || '').trim(),
            pincode: form.pincode.trim(),
            addressType,
            isDefault: true,
        };

        if (
            !payload.firstName ||
            !payload.addressLine1 ||
            !payload.city ||
            !payload.state
        ) {
            setAddressError('Please fill all required fields.');
            return;
        }

        if (!/^\d{10}$/.test(payload.phone)) {
            setAddressError('Please enter a valid 10-digit phone number.');
            return;
        }

        if (!/^[1-9]\d{5}$/.test(payload.pincode)) {
            setAddressError('Please enter a valid 6-digit pincode.');
            return;
        }

        submittingRef.current = true;
        setSaving(true);

        try {
            const response = await addAddressApi(payload);

            if (response?.success !== true || !response.address?._id) {
                throw new Error(
                    response?.error || 'Unable to save this address.'
                );
            }

            // Use exactly the address returned by the backend.
            setSavedAddress(response.address);
            setIsEditingAddress(false);
            setAddressError('');
            setError('');
        } catch (err) {
            if (err.status === 401) {
                window.location.replace('/login');
                return;
            }

            setAddressError(err.message || 'Unable to save this address.');
        } finally {
            submittingRef.current = false;
            setSaving(false);
        }
    };

    const summary = cartData?.summary;

    const formatPrice = (value) =>
        loading || !loaded
            ? '…'
            : `Rs. ${Number(value || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;

    const handleSaveAndContinue = async () => {
        if (submittingRef.current || loading || isEditingAddress) return;

        if (!loaded) {
            setRetryKey(previous => previous + 1);
            return;
        }

        setError('');

        if (billingAddress === 'Different') {
            setError('A separate billing address is not connected yet.');
            return;
        }

        if (!savedAddress?._id) {
            handleEdit();
            return;
        }

        submittingRef.current = true;
        setSaving(true);

        try {
            const response = await getCart();

            if (response?.success !== true) {
                throw new Error('Unable to check your cart.');
            }

            setCartData(response.cart);

            if (!response.cart?.items?.length) {
                throw new Error('Your cart is empty.');
            }

            router.replace(
                `/account/payment?addressId=${encodeURIComponent(savedAddress._id)}`
            );
        } catch (err) {
            if (err.status === 401) {
                window.location.replace('/login');
                return;
            }

            setError(err.message || 'Unable to continue.');
        } finally {
            submittingRef.current = false;
            setSaving(false);
        }
    };

    return (
        <main className="bg-white min-h-screen pb-16 overflow-hidden flex flex-col">
            {/* Checkout Progress Stepper */}
            <div className="w-full flex justify-center mt-8 md:mt-12 lg:mt-16 px-4">
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 text-[10px] sm:text-sm md:text-base font-medium">
                    <div className="text-[#BF8F5F] font-bold pb-1">
                        Cart
                    </div>

                    <div className="w-8 sm:w-16 md:w-24 border-t-2 border-dashed border-[#BF8F5F]" />

                    <div className="text-[#BF8F5F] font-bold border-b-2 border-[#BF8F5F] pb-1">
                        Address
                    </div>

                    <div className="w-8 sm:w-16 md:w-24 border-t-2 border-dashed border-gray-300" />

                    <div className="text-gray-400 pb-1">
                        Payment
                    </div>
                </div>
            </div>

            {/* Main Checkout Section */}
            <section className="px-4 sm:px-8 lg:px-20 max-w-[1440px] mx-auto w-full mt-10 md:mt-12 lg:mt-[60px] flex-grow">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                    {/* Left Column */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-10">
                        {/* Shipping Address */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif text-2xl text-[#222222]">
                                    Shopping Address
                                </h2>

                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    disabled={loading || saving || !loaded}
                                    className="text-[#BF8F5F] text-xs font-bold uppercase tracking-wider hover:underline"
                                >
                                    {savedAddress ? 'Change Address' : 'Add Address'}
                                </button>
                            </div>

                            {savedAddress ? (
                                <div className="border border-[#BF8F5F]/40 bg-white rounded-sm overflow-hidden">
                                    <div className="bg-[#FCF6F2] px-6 py-4 flex justify-between items-center border-b border-[#BF8F5F]/20">
                                        <span className="text-xs font-medium text-[#222222]">
                                            Est. Delivery{' '}
                                            <strong className="font-bold">
                                                {savedAddress.estDelivery || '—'}
                                            </strong>
                                        </span>
                                    </div>

                                    <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                                        <div>
                                            <h3 className="font-bold text-[#222222] text-base mb-2">
                                                {[
                                                    savedAddress.firstName,
                                                    savedAddress.lastName,
                                                ].filter(Boolean).join(' ')}
                                            </h3>

                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md">
                                                {[
                                                    savedAddress.addressLine1,
                                                    savedAddress.addressLine2,
                                                    savedAddress.area,
                                                    savedAddress.city,
                                                    savedAddress.dist,
                                                    savedAddress.state,
                                                    savedAddress.country || 'India',
                                                ].filter(Boolean).join(', ')}
                                                {' - '}
                                                {savedAddress.pincode}
                                            </p>
                                        </div>

                                        <div className="text-xs font-medium text-[#222222] shrink-0">
                                            Mobile:
                                            <span className="font-bold ml-1">
                                                {savedAddress.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="border border-[#BF8F5F]/40 bg-white rounded-sm overflow-hidden">
                                    <div className="bg-[#FCF6F2] px-6 py-4">
                                        <p className="text-xs sm:text-sm text-gray-600">
                                            {loading
                                                ? 'Loading your address…'
                                                : 'Add your shipping address to continue.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Billing Address */}
                        <div className="pt-4 border-t border-gray-100">
                            <h2 className="font-serif text-2xl text-[#222222] mb-1">
                                Billing Address
                            </h2>

                            <p className="text-[10px] sm:text-xs text-gray-400 mb-4">
                                We will not send an invoice to the shipping address
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setBillingAddress('Same')}
                                    disabled={loading || saving}
                                    aria-pressed={billingAddress === 'Same'}
                                    className={`py-3 w-full text-xs font-bold rounded-sm border transition-colors ${billingAddress === 'Same'
                                        ? 'border-[#BF8F5F] text-[#BF8F5F]'
                                        : 'border-gray-300 text-gray-500 hover:border-gray-400'
                                        }`}
                                >
                                    Same as Shipping Address
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setBillingAddress('Different')}
                                    disabled={loading || saving}
                                    aria-pressed={billingAddress === 'Different'}
                                    className={`py-3 w-full text-xs font-bold rounded-sm border transition-colors ${billingAddress === 'Different'
                                        ? 'border-[#BF8F5F] text-[#BF8F5F]'
                                        : 'border-gray-300 text-gray-500 hover:border-gray-400'
                                        }`}
                                >
                                    Use a Different Billing Address
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden lg:block w-px bg-gray-200" />

                    {/* Order Summary */}
                    <div className="w-full lg:w-[30%] flex flex-col pt-8 lg:pt-0 border-t lg:border-t-0 border-gray-200">
                        <div>
                            <h2 className="font-serif text-2xl text-[#222222] mb-6">
                                Order Summary
                            </h2>

                            <div className="flex flex-col gap-4 text-sm mb-6">
                                <div className="flex justify-between items-center text-[#222222]">
                                    <span>Subtotal</span>
                                    <span className="font-bold">
                                        {formatPrice(summary?.subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-[#222222]">
                                        You Saved
                                    </span>
                                    <span className="font-bold text-green-500">
                                        −{formatPrice(summary?.discount)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-[#222222]">
                                        Coupon Discount
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => router.replace('/account/cart')}
                                        disabled={loading || saving}
                                        className="font-bold text-[#BF8F5F] hover:underline"
                                    >
                                        {cartData?.coupon?.code || 'Apply Discount'}
                                    </button>
                                </div>

                                {Number(summary?.tax) > 0 && (
                                    <div className="flex justify-between items-center text-[#222222]">
                                        <span>Tax</span>
                                        <span className="font-bold">
                                            {formatPrice(summary.tax)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-[#222222]">
                                    <span>Shipping (Standard)</span>
                                    <span className="font-bold">
                                        {loading || !loaded
                                            ? '…'
                                            : Number(summary?.shipping) === 0
                                                ? 'Free'
                                                : formatPrice(summary?.shipping)}
                                    </span>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gray-200 mb-6" />

                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-lg text-[#222222]">
                                    Total Cost
                                </span>
                                <span className="font-bold text-xl sm:text-2xl text-[#BF8F5F]">
                                    {formatPrice(summary?.totalCost)}
                                </span>
                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="text-sm text-red-500 mb-4"
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={handleSaveAndContinue}
                                disabled={loading || saving}
                                className="w-full bg-[#BF8F5F] text-white font-bold tracking-[0.2em] uppercase py-4 hover:bg-black transition-colors rounded-sm text-sm sm:text-base"
                            >
                                {loading
                                    ? 'Loading…'
                                    : saving
                                        ? 'Please Wait…'
                                        : !loaded
                                            ? 'Retry'
                                            : 'Save & Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <div className="w-full max-w-[1440px] mx-auto mt-20 lg:mt-32 pt-10 border-t border-gray-100">
                <div className="px-4 sm:px-8 lg:px-20 grid grid-cols-2 lg:flex lg:justify-between gap-y-8 gap-x-4 lg:gap-6 relative z-10 pb-6 lg:pb-0">
                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image
                            src="/icons/Certified.svg"
                            alt="Certified"
                            width={40}
                            height={40}
                            className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                        />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                                Certified
                            </h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                                Available certificates of authenticity
                            </p>
                        </div>
                    </div>

                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image
                            src="/icons/Secure.svg"
                            alt="Secure"
                            width={40}
                            height={40}
                            className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                        />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                                Secure
                            </h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                                Certified marketplace since 2017
                            </p>
                        </div>
                    </div>

                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image
                            src="/icons/Ship.svg"
                            alt="Shipping"
                            width={40}
                            height={40}
                            className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                        />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                                Shipping
                            </h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                                Free, fast, and reliable worldwide
                            </p>
                        </div>
                    </div>

                    <div className="gap-3 lg:gap-6 flex items-start sm:items-center lg:items-start">
                        <Image
                            src="/icons/Transparent.svg"
                            alt="Transparent"
                            width={40}
                            height={40}
                            className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 shrink-0"
                        />
                        <div>
                            <h3 className="text-[#222222] font-sans font-bold text-[12px] lg:text-[16px] leading-snug lg:leading-6 mb-0.5 lg:mb-0">
                                Transparent
                            </h3>
                            <p className="text-[#222222] font-sans text-[10px] lg:text-[14px] leading-tight lg:leading-5 opacity-50">
                                Hassle-free return policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <dialog
                ref={addressDialogRef}
                aria-labelledby="change-address-title"
                onCancel={(event) => {
                    event.preventDefault();
                    closeAddressPopup();
                }}
                onClick={(event) => {
                    if (event.target !== event.currentTarget) return;

                    const bounds = event.currentTarget.getBoundingClientRect();

                    if (
                        event.clientX < bounds.left ||
                        event.clientX > bounds.right ||
                        event.clientY < bounds.top ||
                        event.clientY > bounds.bottom
                    ) {
                        closeAddressPopup();
                    }
                }}
                className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-[640px] max-h-[85dvh] overflow-y-auto bg-white p-0 border-0 rounded-sm shadow-xl [&::backdrop]:bg-black/40"
            >
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start gap-4 mb-6">
                        <h2
                            id="change-address-title"
                            className="font-serif text-2xl text-[#222222]"
                        >
                            Shipping Address
                        </h2>

                        <button
                            type="button"
                            onClick={closeAddressPopup}
                            disabled={saving}
                            aria-label="Close address popup"
                            className="w-8 h-8 flex items-center justify-center border border-[#BF8F5F] text-[#BF8F5F] hover:bg-[#F9F1E7] transition-colors"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                aria-hidden="true"
                            >
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSaveAddress}>
                        <fieldset
                            disabled={saving}
                            className="min-w-0 flex flex-col gap-6"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {[
                                    {
                                        name: 'firstName',
                                        label: 'First Name',
                                        placeholder: 'First Name',
                                        required: true,
                                        autoComplete: 'given-name',
                                    },
                                    {
                                        name: 'lastName',
                                        label: 'Last Name',
                                        placeholder: 'Last Name',
                                        autoComplete: 'family-name',
                                    },
                                    {
                                        name: 'phone',
                                        label: 'Phone Number',
                                        placeholder: '10-digit number',
                                        type: 'tel',
                                        inputMode: 'numeric',
                                        maxLength: 10,
                                        pattern: '[0-9]{10}',
                                        required: true,
                                        autoComplete: 'tel-national',
                                        fullWidth: true,
                                    },
                                    {
                                        name: 'addressLine1',
                                        label: 'Address Line 1',
                                        placeholder: 'House No / Street',
                                        required: true,
                                        autoComplete: 'address-line1',
                                        fullWidth: true,
                                    },
                                    {
                                        name: 'addressLine2',
                                        label: 'Address Line 2 (Optional)',
                                        placeholder: 'Landmark / Apartment',
                                        autoComplete: 'address-line2',
                                        fullWidth: true,
                                    },
                                    {
                                        name: 'area',
                                        label: 'Area',
                                        placeholder: 'Locality',
                                        fullWidth: true,
                                    },
                                    {
                                        name: 'city',
                                        label: 'City',
                                        placeholder: 'City',
                                        required: true,
                                        autoComplete: 'address-level2',
                                    },
                                    {
                                        name: 'state',
                                        label: 'State',
                                        placeholder: 'State',
                                        required: true,
                                        autoComplete: 'address-level1',
                                    },
                                    {
                                        name: 'dist',
                                        label: 'District',
                                        placeholder: 'District',
                                    },
                                    {
                                        name: 'pincode',
                                        label: 'Pincode',
                                        placeholder: '6-digit pincode',
                                        inputMode: 'numeric',
                                        maxLength: 6,
                                        pattern: '[1-9][0-9]{5}',
                                        required: true,
                                        autoComplete: 'postal-code',
                                    },
                                    {
                                        name: 'email',
                                        label: 'Email (Optional)',
                                        placeholder: 'Email',
                                        type: 'email',
                                        autoComplete: 'email',
                                        fullWidth: true,
                                    },
                                ].map(field => (
                                    <div
                                        key={field.name}
                                        className={`flex flex-col gap-2 ${field.fullWidth ? 'sm:col-span-2' : ''
                                            }`}
                                    >
                                        <label
                                            htmlFor={`popup-${field.name}`}
                                            className="text-xs text-[#222222] font-medium"
                                        >
                                            {field.label}
                                        </label>

                                        <input
                                            id={`popup-${field.name}`}
                                            {...bindInput(field.name)}
                                            type={field.type || 'text'}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            inputMode={field.inputMode}
                                            maxLength={field.maxLength}
                                            pattern={field.pattern}
                                            autoComplete={field.autoComplete}
                                            autoFocus={field.name === 'firstName'}
                                            className="bg-[#FCF6F2] px-4 py-3 text-sm focus:outline-none placeholder-[#BF8F5F]/50 rounded-sm"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 className="font-serif text-xl text-[#222222] mb-4">
                                    Address Type
                                </h3>

                                <div className="flex gap-4">
                                    {['Home', 'Office'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setAddressType(type)}
                                            aria-pressed={addressType === type}
                                            className={`py-3 px-6 text-xs font-bold rounded-sm border transition-colors ${addressType === type
                                                    ? 'border-[#BF8F5F] text-[#BF8F5F]'
                                                    : 'border-gray-300 text-gray-500 hover:border-gray-400'
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {addressError && (
                                <p
                                    role="alert"
                                    className="text-sm text-red-500"
                                >
                                    {addressError}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-[#BF8F5F] text-white font-bold tracking-[0.2em] uppercase py-4 hover:bg-black transition-colors rounded-sm text-sm sm:text-base"
                            >
                                {saving ? 'Saving…' : 'Save & Proceed'}
                            </button>
                        </fieldset>
                    </form>
                </div>
            </dialog>
        </main>
    );
}