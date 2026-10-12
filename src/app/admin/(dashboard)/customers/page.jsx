'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    Search,
    Users,
    Eye,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
} from 'lucide-react';

import { getAllUsersApi } from '../../../api/userApi';

const getFullName = user =>
    [user.firstName, user.lastName]
        .filter(Boolean)
        .join(' ')
        .trim() || 'Unnamed Customer';

const getInitials = user => {
    const initials = [user.firstName, user.lastName]
        .filter(Boolean)
        .map(name => name.trim().charAt(0))
        .join('');

    return initials.toUpperCase() || 'U';
};

const formatDate = value => {
    if (!value) return '—';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const CustomerDetailsModal = ({ customer, onClose }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!customer || !dialog) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        dialog.showModal();

        return () => {
            if (dialog.open) dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, [customer]);

    if (!customer) return null;

    const details = [
        ['Customer ID', customer._id],
        ['First Name', customer.firstName],
        ['Last Name', customer.lastName],
        ['Phone', customer.phone],
        ['Email', customer.email],
        ['Gender', customer.gender],
        ['Joined On', formatDate(customer.createdAt)],
        ['Last Updated', formatDate(customer.updatedAt)],
    ];

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={event => {
                if (event.target === event.currentTarget) {
                    dialogRef.current?.close();
                }
            }}
            aria-labelledby="customer-details-title"
            className="m-auto w-[calc(100%-32px)] max-w-lg rounded-[20px] border border-gray-100 bg-white p-0 text-[#222222] shadow-xl backdrop:bg-black/40"
        >
            <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <h2
                        id="customer-details-title"
                        className="font-serif text-xl font-bold"
                    >
                        Customer Details
                    </h2>

                    <button
                        type="button"
                        onClick={() => dialogRef.current?.close()}
                        aria-label="Close customer details"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#B58E58]"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F9F4EF] text-lg font-bold text-[#B58E58]">
                        {getInitials(customer)}
                    </div>

                    <div className="min-w-0">
                        <p className="break-words text-base font-bold">
                            {getFullName(customer)}
                        </p>

                        <p className="text-xs text-gray-400">
                            Dwara Jewels Customer
                        </p>
                    </div>
                </div>

                <dl className="divide-y divide-gray-100">
                    {details.map(([label, value]) => (
                        <div
                            key={label}
                            className="grid grid-cols-[110px_1fr] gap-4 py-3 text-sm"
                        >
                            <dt className="text-gray-400">
                                {label}
                            </dt>

                            <dd className="break-words font-medium">
                                {value || '—'}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </dialog>
    );
};

export default function CustomersPage() {
    const [users, setUsers] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        search: '',
    });

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Search across all customers through the backend.
    useEffect(() => {
        const timer = setTimeout(() => {
            const search = searchInput.trim();

            setFilters(previous =>
                previous.search === search
                    ? previous
                    : { ...previous, page: 1, search }
            );
        }, 350);

        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        let active = true;

        const loadCustomers = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await getAllUsersApi(filters);

                if (
                    !response.success ||
                    !Array.isArray(response.users)
                ) {
                    throw new Error(
                        response.error ||
                        response.message ||
                        'Unable to fetch customers'
                    );
                }

                if (!active) return;

                const totalPages = Number(response.totalPages) || 0;

                // Handle the last page becoming empty after data changes.
                if (
                    filters.page > 1 &&
                    filters.page > Math.max(totalPages, 1)
                ) {
                    setFilters(previous => ({
                        ...previous,
                        page: Math.max(totalPages, 1),
                    }));

                    return;
                }

                setUsers(response.users);

                setPagination({
                    total: Number(response.total) || 0,
                    totalPages,
                });
            } catch (err) {
                if (!active) return;

                setUsers([]);
                setPagination({ total: 0, totalPages: 0 });

                setError(
                    err.status === 403
                        ? 'You do not have permission to view customers.'
                        : err.status === 401
                            ? 'Your admin session has expired. Please sign in again.'
                            : err.data?.error ||
                              err.response?.data?.error ||
                              err.message ||
                              'Unable to fetch customers'
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCustomers();

        return () => {
            active = false;
        };
    }, [filters, refreshKey]);

    const firstRecord = users.length
        ? (filters.page - 1) * filters.limit + 1
        : 0;

    const lastRecord = users.length
        ? firstRecord + users.length - 1
        : 0;

    return (
        <div className="min-h-screen bg-[#FDFBF9] px-4 py-6 sm:px-8">
            {/* Header */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-serif text-2xl font-bold text-[#222222]">
                    Customers
                </h1>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-xl border border-[#BF8F5F]/20 bg-[#FCF6F2] px-4 py-2.5 text-sm font-bold text-[#B58E58]">
                        <Users size={18} />

                        <span>
                            {loading ? 'Loading…' : `${pagination.total} Customers`}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setRefreshKey(previous => previous + 1)}
                        disabled={loading}
                        aria-label="Refresh customers"
                        className="rounded-xl border border-gray-100 bg-white p-3 text-gray-400 shadow-sm transition-colors hover:text-[#B58E58] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={18}
                            className={loading ? 'animate-spin' : ''}
                        />
                    </button>
                </div>
            </div>

            {/* Search and page size */}
            <div className="mb-8 flex flex-wrap items-center gap-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3 top-3 text-gray-400"
                    />

                    <input
                        type="search"
                        value={searchInput}
                        onChange={event =>
                            setSearchInput(event.target.value)
                        }
                        placeholder="Search name, phone or email..."
                        aria-label="Search customers"
                        className="w-full rounded-xl border border-gray-100 bg-white py-2.5 pl-10 pr-4 text-sm text-[#222222] shadow-sm outline-none focus:border-[#B58E58]"
                    />
                </div>

                <div className="relative">
                    <select
                        value={filters.limit}
                        disabled={loading}
                        onChange={event =>
                            setFilters(previous => ({
                                ...previous,
                                page: 1,
                                limit: Number(event.target.value),
                            }))
                        }
                        aria-label="Customers per page"
                        className="min-w-[150px] cursor-pointer appearance-none rounded-xl border border-gray-100 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-500 shadow-sm outline-none focus:border-[#B58E58] disabled:opacity-50"
                    >
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>

                    <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-3 text-gray-400"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-[20px] border border-gray-50 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                        <thead className="border-b border-gray-100 bg-[#FCFAF8]">
                            <tr>
                                {[
                                    'Customer',
                                    'Phone',
                                    'Email',
                                    'Gender',
                                    'Joined On',
                                    'Action',
                                ].map(title => (
                                    <th
                                        key={title}
                                        scope="col"
                                        className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 ${
                                            title === 'Action'
                                                ? 'text-center'
                                                : ''
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
                                    <td
                                        colSpan={6}
                                        className="py-20 text-center text-sm text-gray-400"
                                    >
                                        Loading customers...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-16 text-center"
                                    >
                                        <p
                                            role="alert"
                                            className="mb-4 text-sm text-red-500"
                                        >
                                            {error}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setRefreshKey(previous => previous + 1)
                                            }
                                            className="text-sm font-bold text-[#B58E58] hover:underline"
                                        >
                                            Try Again
                                        </button>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-20 text-center text-sm text-gray-400"
                                    >
                                        {filters.search
                                            ? 'No customers match your search.'
                                            : 'No customers found.'}
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr
                                        key={user._id}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#F9F4EF] text-sm font-bold text-[#B58E58]">
                                                    {getInitials(user)}
                                                </div>

                                                <div>
                                                    <p className="text-sm font-bold text-[#222222]">
                                                        {getFullName(user)}
                                                    </p>

                                                    <p
                                                        title={user._id}
                                                        className="mt-1 font-mono text-[10px] text-gray-400"
                                                    >
                                                        #{user._id.slice(-8).toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-gray-600">
                                            {user.phone || '—'}
                                        </td>

                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {user.email || '—'}
                                        </td>

                                        <td className="px-6 py-4 text-xs capitalize text-gray-500">
                                            {user.gender || '—'}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                                            {formatDate(user.createdAt)}
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedCustomer(user)
                                                }
                                                aria-label={`View ${getFullName(user)}`}
                                                title="View Customer"
                                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#FCF6F2] hover:text-[#B58E58]"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && !error && pagination.total > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-6 py-4">
                        <p className="text-xs text-gray-400">
                            Showing {firstRecord}–{lastRecord} of{' '}
                            {pagination.total} customers
                        </p>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                disabled={filters.page <= 1}
                                onClick={() =>
                                    setFilters(previous => ({
                                        ...previous,
                                        page: previous.page - 1,
                                    }))
                                }
                                aria-label="Previous page"
                                className="rounded-lg border border-gray-100 p-2 text-gray-500 transition-colors hover:border-[#B58E58] hover:text-[#B58E58] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <span className="text-xs font-medium text-gray-500">
                                Page {filters.page} of {pagination.totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={
                                    filters.page >= pagination.totalPages
                                }
                                onClick={() =>
                                    setFilters(previous => ({
                                        ...previous,
                                        page: previous.page + 1,
                                    }))
                                }
                                aria-label="Next page"
                                className="rounded-lg border border-gray-100 p-2 text-gray-500 transition-colors hover:border-[#B58E58] hover:text-[#B58E58] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <CustomerDetailsModal
                customer={selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
            />
        </div>
    );
}