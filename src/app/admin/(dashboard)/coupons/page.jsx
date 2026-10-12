'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    Search,
    Plus,
    Edit3,
    Trash2,
    X,
    Power,
    RefreshCw,
    ChevronDown,
} from 'lucide-react';

import {
    getAdminCouponsApi,
    createAdminCouponApi,
    updateAdminCouponApi,
    deleteAdminCouponApi,
} from '../../../api/adminCouponApi';

const getError = error =>
    error.data?.error ||
    error.response?.data?.error ||
    error.message ||
    'Unable to complete request';

const money = value =>
    `Rs. ${Number(value || 0).toLocaleString('en-IN', {
        maximumFractionDigits: 2,
    })}`;

const formatDate = value => {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
};

const getStatus = coupon => {
    if (new Date(coupon.expiresAt).getTime() <= Date.now()) {
        return 'Expired';
    }

    return coupon.isActive ? 'Active' : 'Inactive';
};

const statusClasses = {
    Active: 'bg-green-50 text-green-600',
    Inactive: 'bg-gray-100 text-gray-500',
    Expired: 'bg-red-50 text-red-600',
};

const toLocalDateTime = value => {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    const local = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
    );

    return local.toISOString().slice(0, 16);
};

function CouponFormModal({ coupon, onClose, onSaved }) {
    const [form, setForm] = useState({
        code: coupon?.code || '',
        description: coupon?.description || '',
        discountType: coupon?.discountType || 'FLAT',
        value: coupon?.value ?? '',
        minOrderValue: coupon?.minOrderValue ?? 0,
        maxDiscountAmount: coupon?.maxDiscountAmount ?? '',
        expiresAt: toLocalDateTime(coupon?.expiresAt),
        isActive: coupon?.isActive ?? true,
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const saveLock = useRef(false);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = event => {
            if (event.key === 'Escape' && !saveLock.current) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const updateField = event => {
        const { name, value, type, checked } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleClose = () => {
        if (!saveLock.current) onClose();
    };

    const handleSubmit = async event => {
        event.preventDefault();

        if (saveLock.current) return;

        setError('');

        const expiry = new Date(form.expiresAt);

        if (Number.isNaN(expiry.getTime())) {
            setError('Select a valid expiry date');
            return;
        }

        saveLock.current = true;
        setSaving(true);

        try {
            const payload = {
                code: form.code.trim().toUpperCase(),
                description: form.description.trim(),
                discountType: form.discountType,
                value: Number(form.value),
                minOrderValue: Number(form.minOrderValue),
                maxDiscountAmount:
                    form.discountType === 'PERCENTAGE' &&
                    form.maxDiscountAmount !== ''
                        ? Number(form.maxDiscountAmount)
                        : null,
                expiresAt: expiry.toISOString(),
                isActive: form.isActive,
            };

            const response = coupon
                ? await updateAdminCouponApi(coupon._id, payload)
                : await createAdminCouponApi(payload);

            if (!response.success) {
                throw new Error(
                    response.error || 'Unable to save coupon'
                );
            }

            onSaved(response.message || 'Coupon saved successfully');
        } catch (err) {
            setError(getError(err));
        } finally {
            saveLock.current = false;
            setSaving(false);
        }
    };

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-[#222222] outline-none focus:border-[#B58E58]';

    return createPortal(
        <div
            onClick={handleClose}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="coupon-form-heading"
                onClick={event => event.stopPropagation()}
                className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[20px] bg-white p-6 shadow-xl sm:p-8"
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2
                        id="coupon-form-heading"
                        className="font-serif text-xl font-bold text-[#222222]"
                    >
                        {coupon ? 'Edit Coupon' : 'Create Coupon'}
                    </h2>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={saving}
                        aria-label="Close coupon form"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 disabled:opacity-40"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <fieldset disabled={saving} className="space-y-4">
                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold text-gray-500">
                                Coupon Code
                            </span>
                            <input
                                name="code"
                                value={form.code}
                                onChange={updateField}
                                placeholder="WELCOME10"
                                required
                                className={`${inputClass} uppercase`}
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold text-gray-500">
                                Description
                            </span>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={updateField}
                                rows={3}
                                required
                                className={`${inputClass} resize-none`}
                            />
                        </label>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold text-gray-500">
                                    Discount Type
                                </span>

                                <select
                                    name="discountType"
                                    value={form.discountType}
                                    onChange={updateField}
                                    className={inputClass}
                                >
                                    <option value="FLAT">Flat Amount</option>
                                    <option value="PERCENTAGE">Percentage</option>
                                </select>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold text-gray-500">
                                    {form.discountType === 'PERCENTAGE'
                                        ? 'Discount (%)'
                                        : 'Discount Amount (Rs.)'}
                                </span>

                                <input
                                    type="number"
                                    name="value"
                                    value={form.value}
                                    onChange={updateField}
                                    min="0.01"
                                    max={
                                        form.discountType === 'PERCENTAGE'
                                            ? 100
                                            : undefined
                                    }
                                    step="0.01"
                                    required
                                    className={inputClass}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold text-gray-500">
                                    Minimum Order Value (Rs.)
                                </span>

                                <input
                                    type="number"
                                    name="minOrderValue"
                                    value={form.minOrderValue}
                                    onChange={updateField}
                                    min="0"
                                    step="0.01"
                                    required
                                    className={inputClass}
                                />
                            </label>

                            {form.discountType === 'PERCENTAGE' && (
                                <label className="block">
                                    <span className="mb-2 block text-xs font-semibold text-gray-500">
                                        Maximum Discount (Optional)
                                    </span>

                                    <input
                                        type="number"
                                        name="maxDiscountAmount"
                                        value={form.maxDiscountAmount}
                                        onChange={updateField}
                                        min="0.01"
                                        step="0.01"
                                        placeholder="No maximum"
                                        className={inputClass}
                                    />
                                </label>
                            )}
                        </div>

                        <label className="block">
                            <span className="mb-2 block text-xs font-semibold text-gray-500">
                                Expiry Date & Time
                            </span>

                            <input
                                type="datetime-local"
                                name="expiresAt"
                                value={form.expiresAt}
                                onChange={updateField}
                                required
                                className={inputClass}
                            />
                        </label>

                        <label className="flex items-center gap-3 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={updateField}
                                className="h-4 w-4 accent-[#B58E58]"
                            />
                            Enable this coupon
                        </label>
                    </fieldset>

                    {error && (
                        <p role="alert" className="mt-4 text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={saving}
                            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-500 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-[#B58E58] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#9a7645] disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Coupon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [modal, setModal] = useState(null);

    const actionLock = useRef(false);

    useEffect(() => {
        let active = true;

        const loadCoupons = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await getAdminCouponsApi();

                if (
                    !response.success ||
                    !Array.isArray(response.coupons)
                ) {
                    throw new Error(
                        response.error || 'Unable to fetch coupons'
                    );
                }

                if (active) setCoupons(response.coupons);
            } catch (err) {
                if (active) {
                    setCoupons([]);
                    setError(getError(err));
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCoupons();

        return () => {
            active = false;
        };
    }, [refreshKey]);

    const handleAction = async (coupon, type) => {
        if (actionLock.current) return;

        if (
            type === 'delete' &&
            !window.confirm(`Delete coupon "${coupon.code}"?`)
        ) {
            return;
        }

        actionLock.current = true;
        setBusyId(coupon._id);
        setError('');
        setMessage('');

        try {
            const response = type === 'delete'
                ? await deleteAdminCouponApi(coupon._id)
                : await updateAdminCouponApi(coupon._id, {
                    isActive: !coupon.isActive,
                });

            if (!response.success) {
                throw new Error(response.error || 'Request failed');
            }

            setMessage(response.message);
            setRefreshKey(previous => previous + 1);
        } catch (err) {
            setError(getError(err));
        } finally {
            actionLock.current = false;
            setBusyId(null);
        }
    };

    const normalizedSearch = search.trim().toLowerCase();

    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = [
            coupon.code,
            coupon.description,
        ].some(value =>
            String(value || '').toLowerCase().includes(normalizedSearch)
        );

        return matchesSearch &&
            (statusFilter === 'All' || getStatus(coupon) === statusFilter);
    });

    const actionsDisabled = loading || Boolean(busyId);

    return (
        <div className="min-h-screen bg-[#FDFBF9] px-4 py-6 sm:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-serif text-2xl font-bold text-[#222222]">
                    Coupon Codes
                </h1>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setRefreshKey(previous => previous + 1)}
                        disabled={actionsDisabled}
                        aria-label="Refresh coupons"
                        className="rounded-xl border border-gray-100 bg-white p-3 text-gray-400 shadow-sm hover:text-[#B58E58] disabled:opacity-50"
                    >
                        <RefreshCw
                            size={18}
                            className={loading ? 'animate-spin' : ''}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMessage('');
                            setModal({ coupon: null });
                        }}
                        disabled={actionsDisabled}
                        className="flex items-center gap-2 rounded-xl bg-[#B58E58] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#9a7645] disabled:opacity-50"
                    >
                        <Plus size={18} />
                        New Coupon
                    </button>
                </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3 top-3 text-gray-400"
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={event => setSearch(event.target.value)}
                        placeholder="Search coupon code or description..."
                        aria-label="Search coupons"
                        className="w-full rounded-xl border border-gray-100 bg-white py-2.5 pl-10 pr-4 text-sm text-[#222222] shadow-sm outline-none focus:border-[#B58E58]"
                    />
                </div>

                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={event => setStatusFilter(event.target.value)}
                        aria-label="Filter coupon status"
                        className="appearance-none rounded-xl border border-gray-100 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-500 shadow-sm outline-none"
                    >
                        {['All', 'Active', 'Inactive', 'Expired'].map(status => (
                            <option key={status} value={status}>
                                {status === 'All' ? 'Status: All' : status}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-3 text-gray-400"
                    />
                </div>
            </div>

            {error && (
                <p role="alert" className="mb-5 text-sm text-red-500">
                    {error}
                </p>
            )}

            {message && (
                <p role="status" className="mb-5 text-sm text-green-600">
                    {message}
                </p>
            )}

            <div className="overflow-hidden rounded-[20px] border border-gray-50 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left">
                        <thead className="border-b border-gray-100 bg-[#FCFAF8]">
                            <tr>
                                {[
                                    'Coupon',
                                    'Discount',
                                    'Minimum Order',
                                    'Maximum Discount',
                                    'Expires On',
                                    'Status',
                                    'Action',
                                ].map(title => (
                                    <th
                                        key={title}
                                        scope="col"
                                        className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 ${
                                            title === 'Action' ? 'text-center' : ''
                                        }`}
                                    >
                                        {title}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center text-sm text-gray-400">
                                        Loading coupons...
                                    </td>
                                </tr>
                            ) : filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center text-sm text-gray-400">
                                        {error
                                            ? 'Coupons could not be loaded.'
                                            : 'No coupons found.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredCoupons.map(coupon => {
                                    const status = getStatus(coupon);

                                    return (
                                        <tr
                                            key={coupon._id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-[#B58E58]">
                                                    {coupon.code}
                                                </p>

                                                <p className="mt-1 max-w-[220px] text-xs text-gray-400">
                                                    {coupon.description}
                                                </p>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-[#222222]">
                                                {coupon.discountType === 'PERCENTAGE'
                                                    ? `${coupon.value}%`
                                                    : money(coupon.value)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                                                {money(coupon.minOrderValue)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                                                {coupon.discountType === 'PERCENTAGE' &&
                                                coupon.maxDiscountAmount != null
                                                    ? money(coupon.maxDiscountAmount)
                                                    : '—'}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                                                {formatDate(coupon.expiresAt)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusClasses[status]}`}
                                                >
                                                    {status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setModal({ coupon })
                                                        }
                                                        disabled={actionsDisabled}
                                                        aria-label={`Edit ${coupon.code}`}
                                                        title="Edit Coupon"
                                                        className="rounded-lg p-2 text-gray-400 hover:text-[#B58E58] disabled:opacity-40"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAction(coupon, 'toggle')
                                                        }
                                                        disabled={actionsDisabled}
                                                        aria-label={`${coupon.isActive ? 'Disable' : 'Enable'} ${coupon.code}`}
                                                        title={coupon.isActive ? 'Disable Coupon' : 'Enable Coupon'}
                                                        className={`rounded-lg p-2 disabled:opacity-40 ${
                                                            coupon.isActive
                                                                ? 'text-green-600 hover:text-gray-500'
                                                                : 'text-gray-400 hover:text-green-600'
                                                        }`}
                                                    >
                                                        <Power size={18} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleAction(coupon, 'delete')
                                                        }
                                                        disabled={actionsDisabled}
                                                        aria-label={`Delete ${coupon.code}`}
                                                        title="Delete Coupon"
                                                        className="rounded-lg p-2 text-gray-400 hover:text-red-500 disabled:opacity-40"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && !error && (
                    <div className="border-t border-gray-100 px-6 py-4 text-xs text-gray-400">
                        Showing {filteredCoupons.length} of {coupons.length} coupons
                    </div>
                )}
            </div>

            {modal && (
                <CouponFormModal
                    coupon={modal.coupon}
                    onClose={() => setModal(null)}
                    onSaved={successMessage => {
                        setModal(null);
                        setMessage(successMessage);
                        setRefreshKey(previous => previous + 1);
                    }}
                />
            )}
        </div>
    );
}