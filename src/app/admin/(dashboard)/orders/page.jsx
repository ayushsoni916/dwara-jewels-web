'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    Search,
    Eye,
    X,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
} from 'lucide-react';
import { createPortal } from 'react-dom';

import {
    getAllOrdersApi,
    getAdminOrderDetailsApi,
    updateOrderStatusApi,
} from '../../../api/adminOrderApi';

const statuses = [
    'All',
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
];

const nextStatuses = {
    Pending: 'Processing',
    Processing: 'Shipped',
    Shipped: 'Delivered',
};

const statusColors = {
    Pending: 'bg-yellow-50 text-yellow-700',
    Processing: 'bg-blue-50 text-blue-600',
    Shipped: 'bg-purple-50 text-purple-600',
    Delivered: 'bg-green-50 text-green-600',
    Cancelled: 'bg-red-50 text-red-600',
};

const formatPrice = value => {
    if (value === undefined || value === null) return '—';

    const amount = Number(value);

    return Number.isFinite(amount)
        ? `Rs. ${amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`
        : '—';
};

const formatDate = value => {
    if (!value) return '—';

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? '—'
        : date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
};

const customerName = order =>
    [
        order.user?.firstName,
        order.user?.lastName,
    ].filter(Boolean).join(' ') ||
    order.shippingAddress?.fullName ||
    [
        order.shippingAddress?.firstName,
        order.shippingAddress?.lastName,
    ].filter(Boolean).join(' ') ||
    'Customer';

const getErrorMessage = error =>
    error.data?.error ||
    error.response?.data?.error ||
    error.message ||
    'Unable to complete the request';

const StatusBadge = ({ status }) => (
    <span
        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${statusColors[status] || 'bg-gray-50 text-gray-500'
            }`}
    >
        {status || '—'}
    </span>
);

function OrderDetailsModal({ orderId, onClose, onUpdated }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const updateLock = useRef(false);

    const allowedNextStatus = {
        Pending: 'Processing',
        Processing: 'Shipped',
        Shipped: 'Delivered',
    };

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = event => {
            if (event.key === 'Escape' && !updateLock.current) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    useEffect(() => {
        let active = true;

        const fetchOrder = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await getAdminOrderDetailsApi(orderId);

                if (!response.success || !response.order) {
                    throw new Error(
                        response.error || 'Unable to fetch order details'
                    );
                }

                if (active) {
                    setOrder(response.order);
                    setSelectedStatus('');
                }
            } catch (err) {
                if (active) setError(getErrorMessage(err));
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchOrder();

        return () => {
            active = false;
        };
    }, [orderId]);

    const handleClose = () => {
        if (!updateLock.current) onClose();
    };

    const handleUpdateStatus = async () => {
        if (
            !order ||
            !selectedStatus ||
            updateLock.current
        ) {
            return;
        }

        updateLock.current = true;
        setUpdating(true);
        setError('');
        setMessage('');

        try {
            const response = await updateOrderStatusApi(
                order._id,
                selectedStatus
            );

            if (!response.success || !response.order) {
                throw new Error(
                    response.error || 'Unable to update order status'
                );
            }

            setOrder(response.order);
            setSelectedStatus('');
            setMessage(
                response.message || 'Order status updated successfully'
            );

            onUpdated?.();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            updateLock.current = false;
            setUpdating(false);
        }
    };

    const address = order?.shippingAddress || {};
    const nextStatus = allowedNextStatus[order?.status];

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="order-details-heading"
                onClick={event => event.stopPropagation()}
                className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[20px] border border-gray-100 bg-white p-6 text-[#222222] shadow-xl sm:p-8"
            >
                <div className="mb-6 flex items-center justify-between gap-4">
                    <h2
                        id="order-details-heading"
                        className="font-serif text-xl font-bold"
                    >
                        Order Details
                    </h2>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={updating}
                        aria-label="Close order details"
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 disabled:opacity-40"
                    >
                        <X size={20} />
                    </button>
                </div>

                {loading && (
                    <p className="py-12 text-center text-sm text-gray-400">
                        Loading order details...
                    </p>
                )}

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

                {!loading && order && (
                    <div className="space-y-7">
                        {/* Order information */}
                        <div className="flex flex-wrap justify-between gap-4">
                            <div>
                                <p className="break-all font-mono text-xs text-gray-400">
                                    #{order._id.toUpperCase()}
                                </p>

                                <p className="mt-2 text-sm font-bold">
                                    {customerName(order)}
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Placed on:{' '}
                                    {formatDate(order.orderDate || order.createdAt)}
                                </p>

                                {order.deliveredAt && (
                                    <p className="mt-1 text-xs text-gray-400">
                                        Delivered on: {formatDate(order.deliveredAt)}
                                    </p>
                                )}
                            </div>

                            <div>
                                <StatusBadge status={order.status} />
                            </div>
                        </div>

                        {/* Admin status update */}
                        {nextStatus && (
                            <div className="rounded-xl border border-[#B58E58]/20 bg-[#FCF6F2] p-4">
                                <p className="mb-3 text-sm font-bold">
                                    Update Order Status
                                </p>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <select
                                        value={selectedStatus}
                                        onChange={event =>
                                            setSelectedStatus(event.target.value)
                                        }
                                        disabled={updating}
                                        aria-label="New order status"
                                        className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#B58E58] disabled:opacity-50"
                                    >
                                        <option value="">Select next status</option>
                                        <option value={nextStatus}>
                                            {nextStatus}
                                        </option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={handleUpdateStatus}
                                        disabled={!selectedStatus || updating}
                                        className="rounded-xl bg-[#B58E58] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#9a7645] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {updating ? 'Updating...' : 'Update Status'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {order.status === 'Cancelled' && (
                            <div className="rounded-xl bg-red-50 p-4 text-sm">
                                <p className="font-semibold text-red-600">
                                    Cancelled on: {formatDate(order.cancelledAt)}
                                </p>

                                {order.cancellationReason && (
                                    <p className="mt-2 text-gray-600">
                                        {order.cancellationReason}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Shipping address */}
                        <section>
                            <h3 className="mb-3 text-sm font-bold">
                                Shipping Address
                            </h3>

                            <div className="rounded-xl bg-[#FCF6F2] p-4 text-sm">
                                <p className="mb-2 font-semibold">
                                    {address.fullName ||
                                        [address.firstName, address.lastName]
                                            .filter(Boolean).join(' ') ||
                                        '—'}
                                </p>

                                <p className="leading-6 text-gray-500">
                                    {[
                                        address.addressLine1,
                                        address.addressLine2,
                                        address.area,
                                        address.city,
                                        address.dist,
                                        address.state,
                                        address.pincode,
                                        address.country,
                                    ].filter(Boolean).join(', ') || '—'}
                                </p>

                                {address.phone && (
                                    <p className="mt-2 text-gray-600">
                                        Mobile: {address.phone}
                                    </p>
                                )}
                            </div>
                        </section>

                        {/* Products */}
                        <section>
                            <h3 className="mb-4 text-sm font-bold">
                                Ordered Products
                            </h3>

                            <div className="space-y-4">
                                {(order.items || []).map(item => (
                                    <div key={item._id} className="flex items-start gap-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F9F4EF]">
                                            {item.product?.thumbnail && (
                                                <img
                                                    src={item.product.thumbnail}
                                                    alt={item.product.title || 'Product'}
                                                    className="h-full w-full object-contain"
                                                />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold">
                                                {item.product?.title || 'Product unavailable'}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {item.size ? `Size: ${item.size} · ` : ''}
                                                Qty: {item.quantity}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                Unit price: {formatPrice(item.priceAtPurchase)}
                                            </p>
                                        </div>

                                        <p className="text-sm font-bold text-[#B58E58]">
                                            {formatPrice(
                                                item.priceAtPurchase * item.quantity
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Summary */}
                        <section className="border-t border-gray-100 pt-5">
                            <h3 className="mb-4 text-sm font-bold">
                                Order Summary
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>{formatPrice(order.summary?.subtotal)}</span>
                                </div>

                                {Number(order.summary?.discount) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Discount</span>
                                        <span className="text-green-600">
                                            −{formatPrice(order.summary.discount)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Shipping</span>
                                    <span>{formatPrice(order.summary?.shipping)}</span>
                                </div>

                                <div className="flex justify-between border-t border-gray-100 pt-3 font-bold">
                                    <span>Total Amount</span>
                                    <span className="text-[#B58E58]">
                                        {formatPrice(order.summary?.totalCost)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
                                {order.paymentType && (
                                    <span>Payment method: {order.paymentType}</span>
                                )}

                                {order.paymentStatus && (
                                    <span>Payment status: {order.paymentStatus}</span>
                                )}
                            </div>
                        </section>

                        {/* Return and exchange requests */}
                        {order.serviceRequests?.length > 0 && (
                            <section className="border-t border-gray-100 pt-5">
                                <h3 className="mb-4 text-sm font-bold">
                                    Return / Exchange Requests
                                </h3>

                                <div className="space-y-3">
                                    {order.serviceRequests.map(request => {
                                        const item = (order.items || []).find(
                                            item =>
                                                String(item._id) === String(request.itemId)
                                        );

                                        const replacement = request.targetDimensions;

                                        return (
                                            <div
                                                key={request._id}
                                                className="rounded-xl border border-gray-100 p-4"
                                            >
                                                <div className="flex justify-between gap-3 text-sm">
                                                    <span className="font-bold">
                                                        {request.type}
                                                    </span>
                                                    <span className="font-semibold text-[#B58E58]">
                                                        {request.status}
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-xs text-gray-500">
                                                    {item?.product?.title || 'Ordered item'} · Qty: {request.quantity}
                                                </p>

                                                <p className="mt-2 text-sm text-gray-600">
                                                    {request.reason}
                                                </p>

                                                {request.type === 'Exchange' && replacement && (
                                                    <p className="mt-2 text-xs text-[#B58E58]">
                                                        Replacement:{' '}
                                                        {[
                                                            replacement.size && `Size: ${replacement.size}`,
                                                            replacement.width && `W: ${replacement.width}`,
                                                            replacement.length && `L: ${replacement.length}`,
                                                        ].filter(Boolean).join(' | ') || 'Standard'}
                                                    </p>
                                                )}

                                                <p className="mt-2 text-xs text-gray-400">
                                                    Requested on: {formatDate(request.requestedAt)}
                                                </p>

                                                {request.adminNote && (
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Admin note: {request.adminNote}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

export default function OrderManagementPage() {
    const [orders, setOrders] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        status: 'All',
        search: '',
    });

    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

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

        const loadOrders = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await getAllOrdersApi(filters);

                if (!response.success || !Array.isArray(response.orders)) {
                    throw new Error(response.error || 'Unable to fetch orders');
                }

                if (!active) return;

                const totalPages = Number(response.totalPages) || 0;

                if (filters.page > Math.max(totalPages, 1)) {
                    setFilters(previous => ({
                        ...previous,
                        page: Math.max(totalPages, 1),
                    }));
                    return;
                }

                setOrders(response.orders);
                setPagination({
                    total: Number(response.total) || 0,
                    totalPages,
                });
            } catch (err) {
                if (!active) return;

                setOrders([]);
                setPagination({ total: 0, totalPages: 0 });

                setError(
                    err.status === 403
                        ? 'You do not have permission to view orders.'
                        : err.status === 401
                            ? 'Your admin session has expired. Please sign in again.'
                            : getErrorMessage(err)
                );
            } finally {
                if (active) setLoading(false);
            }
        };

        loadOrders();

        return () => {
            active = false;
        };
    }, [filters, refreshKey]);

    const firstRecord = orders.length
        ? (filters.page - 1) * filters.limit + 1
        : 0;

    const lastRecord = orders.length
        ? firstRecord + orders.length - 1
        : 0;

    return (
        <div className="min-h-screen bg-[#FDFBF9] px-4 py-6 sm:px-8">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-serif text-2xl font-bold text-[#222222]">
                    Order Management
                </h1>

                <div className="flex items-center gap-3">
                    <div className="rounded-xl border border-[#BF8F5F]/20 bg-[#FCF6F2] px-4 py-2.5 text-sm font-bold text-[#B58E58]">
                        {loading ? 'Loading…' : `${pagination.total} Orders`}
                    </div>

                    <button
                        type="button"
                        onClick={() => setRefreshKey(previous => previous + 1)}
                        disabled={loading}
                        aria-label="Refresh orders"
                        className="rounded-xl border border-gray-100 bg-white p-3 text-gray-400 shadow-sm hover:text-[#B58E58] disabled:opacity-50"
                    >
                        <RefreshCw
                            size={18}
                            className={loading ? 'animate-spin' : ''}
                        />
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
                        value={searchInput}
                        onChange={event => setSearchInput(event.target.value)}
                        placeholder="Search full order ID, recipient or phone..."
                        aria-label="Search orders"
                        className="w-full rounded-xl border border-gray-100 bg-white py-2.5 pl-10 pr-4 text-sm text-[#222222] shadow-sm outline-none focus:border-[#B58E58]"
                    />
                </div>

                <div className="relative">
                    <select
                        value={filters.status}
                        onChange={event =>
                            setFilters(previous => ({
                                ...previous,
                                page: 1,
                                status: event.target.value,
                            }))
                        }
                        aria-label="Filter order status"
                        className="min-w-[170px] appearance-none rounded-xl border border-gray-100 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-500 shadow-sm outline-none focus:border-[#B58E58]"
                    >
                        {statuses.map(status => (
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

                <div className="relative">
                    <select
                        value={filters.limit}
                        onChange={event =>
                            setFilters(previous => ({
                                ...previous,
                                page: 1,
                                limit: Number(event.target.value),
                            }))
                        }
                        aria-label="Orders per page"
                        className="appearance-none rounded-xl border border-gray-100 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-500 shadow-sm outline-none focus:border-[#B58E58]"
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

            <div className="overflow-hidden rounded-[20px] border border-gray-50 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left">
                        <thead className="border-b border-gray-100 bg-[#FCFAF8]">
                            <tr>
                                {[
                                    'Order ID',
                                    'Customer',
                                    'Products',
                                    'Total',
                                    'Date',
                                    'Status',
                                    'Requests',
                                    'Action',
                                ].map(title => (
                                    <th
                                        key={title}
                                        scope="col"
                                        className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 ${title === 'Action' ? 'text-center' : ''
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
                                    <td colSpan={8} className="py-20 text-center text-sm text-gray-400">
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <p role="alert" className="mb-4 text-sm text-red-500">
                                            {error}
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => setRefreshKey(previous => previous + 1)}
                                            className="text-sm font-bold text-[#B58E58] hover:underline"
                                        >
                                            Try Again
                                        </button>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-20 text-center text-sm text-gray-400">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => {
                                    const firstItem = order.items?.[0];
                                    const totalQuantity = (order.items || []).reduce(
                                        (sum, item) => sum + Number(item.quantity || 0),
                                        0
                                    );

                                    const activeRequests = (order.serviceRequests || []).filter(
                                        request => ['Requested', 'Approved'].includes(request.status)
                                    ).length;

                                    return (
                                        <tr key={order._id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <span
                                                    title={order._id}
                                                    className="font-mono text-xs text-gray-500"
                                                >
                                                    #{order._id.slice(-10).toUpperCase()}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-[#222222]">
                                                    {customerName(order)}
                                                </p>
                                                <p className="mt-1 text-[11px] text-gray-400">
                                                    {order.user?.phone || order.shippingAddress?.phone || '—'}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F9F4EF]">
                                                        {firstItem?.product?.thumbnail && (
                                                            <img
                                                                src={firstItem.product.thumbnail}
                                                                alt={firstItem.product.title || 'Product'}
                                                                className="h-full w-full object-contain"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="max-w-[180px]">
                                                        <p className="truncate text-xs font-semibold text-[#222222]">
                                                            {firstItem?.product?.title || 'Product unavailable'}
                                                        </p>
                                                        <p className="mt-1 text-[10px] text-gray-400">
                                                            {order.items?.length || 0} product lines · {totalQuantity} units
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-[#222222]">
                                                {formatPrice(order.summary?.totalCost)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                                                {formatDate(order.orderDate || order.createdAt)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>

                                            <td className="px-6 py-4 text-xs">
                                                {activeRequests > 0 ? (
                                                    <span className="whitespace-nowrap font-semibold text-[#B58E58]">
                                                        {activeRequests} active
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedOrderId(order._id)}
                                                    aria-label={`View order ${order._id}`}
                                                    title="View Order"
                                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-[#FCF6F2] hover:text-[#B58E58]"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && !error && pagination.total > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 px-6 py-4">
                        <p className="text-xs text-gray-400">
                            Showing {firstRecord}–{lastRecord} of {pagination.total} orders
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
                                className="rounded-lg border border-gray-100 p-2 text-gray-500 hover:text-[#B58E58] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <span className="text-xs font-medium text-gray-500">
                                Page {filters.page} of {pagination.totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={filters.page >= pagination.totalPages}
                                onClick={() =>
                                    setFilters(previous => ({
                                        ...previous,
                                        page: previous.page + 1,
                                    }))
                                }
                                aria-label="Next page"
                                className="rounded-lg border border-gray-100 p-2 text-gray-500 hover:text-[#B58E58] disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {selectedOrderId && (
                <OrderDetailsModal
                    key={selectedOrderId}
                    orderId={selectedOrderId}
                    onClose={() => setSelectedOrderId(null)}
                    onUpdated={() => setRefreshKey(previous => previous + 1)}
                />
            )}
        </div>
    );
}