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
    getOrderShippingRatesApi,
    createOrderShipmentApi,
    assignOrderAwbApi,
    checkOrderAwbStatusApi,
    recoverOrderAwbApi,
    generateOrderLabelApi,
    requestOrderPickupApi,
    generateOrderManifestApi,
    getOrderShippingTrackingApi,
    cancelOrderShipmentApi
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

    const [checkingAwb, setCheckingAwb] = useState(false);
    const [awbCheckResult, setAwbCheckResult] = useState(null);


    const [packageDetails, setPackageDetails] = useState({
        weightKg: '',
        lengthCm: '',
        breadthCm: '',
        heightCm: '',
    });

    const [packingVerified, setPackingVerified] = useState(false);
    const [checkingRates, setCheckingRates] = useState(false);
    const [shippingRates, setShippingRates] = useState(null);
    const [shippingError, setShippingError] = useState('');

    const [creatingShipment, setCreatingShipment] = useState(false);
    const shipmentLock = useRef(false);

    const [selectedCourierId, setSelectedCourierId] = useState('');
    const [assigningAwb, setAssigningAwb] = useState(false);
    const [recoveringAwb, setRecoveringAwb] = useState(false);

    const [generatingLabel, setGeneratingLabel] = useState(false);
    const labelLock = useRef(false);

    const [requestingPickup, setRequestingPickup] = useState(false);
    const pickupLock = useRef(false);

    const [generatingManifest, setGeneratingManifest] = useState(false);
    const manifestLock = useRef(false);
    const [trackingData, setTrackingData] = useState(null);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [trackingError, setTrackingError] = useState('');


    const awbLock = useRef(false);

    const updateLock = useRef(false);

    const allowedNextStatus = {
        Pending: 'Processing',
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
                console.log("res", response)

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

    const handleCheckShippingRates = async () => {
        if (!order || checkingRates || !packingVerified) return;

        const details = {
            weightKg: Number(packageDetails.weightKg),
            lengthCm: Number(packageDetails.lengthCm),
            breadthCm: Number(packageDetails.breadthCm),
            heightCm: Number(packageDetails.heightCm),
        };

        if (
            !Object.values(details).every(
                value => Number.isFinite(value) && value > 0
            )
        ) {
            setShippingError(
                'Enter valid package weight and dimensions.'
            );
            return;
        }

        setCheckingRates(true);
        setShippingError('');
        setShippingRates(null);

        try {
            const response = await getOrderShippingRatesApi(
                order._id,
                details
            );

            if (!response.success) {
                throw new Error(
                    response.error || 'Unable to check shipping rates'
                );
            }

            setShippingRates(response);

        } catch (error) {
            setShippingError(getErrorMessage(error));
        } finally {
            setCheckingRates(false);
        }
    };

    const handleCreateShipment = async () => {
        if (
            !order ||
            !packingVerified ||
            !shippingRates?.serviceable ||
            shipmentLock.current ||
            order.paymentStatus !== 'Paid' ||
            !['Pending', 'Processing'].includes(order.status) ||
            order.shipping?.bookingStatus === 'Creating' ||
            order.shipping?.bookingStatus === 'NeedsReview' ||
            order.shipping?.shipmentId
        ) {
            return;
        }

        shipmentLock.current = true;
        setCreatingShipment(true);
        setShippingError('');

        try {
            const response = await createOrderShipmentApi(
                order._id,
                shippingRates.packageDetails
            );

            if (!response.success) {
                throw new Error(
                    response.error || 'Unable to create shipment'
                );
            }

            setOrder(previous => ({
                ...previous,
                shipping: response.shipping,
            }));

            setMessage('Shiprocket shipment created successfully.');
            onUpdated?.();

        } catch (error) {
            setShippingError(getErrorMessage(error));

            // Refresh to reflect Created or NeedsReview states.
            try {
                const refreshed = await getAdminOrderDetailsApi(order._id);
                if (refreshed.success && refreshed.order) {
                    setOrder(refreshed.order);
                }
            } catch {
                // Preserve the original error.
            }
        } finally {
            shipmentLock.current = false;
            setCreatingShipment(false);
        }
    };


    const handleAssignAwb = async () => {
        if (
            !order ||
            !order.shipping?.shipmentId ||
            !selectedCourierId ||
            assigningAwb ||
            awbLock.current ||
            order.shipping?.awbCode ||
            order.shipping?.bookingStatus !== 'Created'
        ) {
            return;
        }

        const courierId = Number(selectedCourierId);

        if (!Number.isSafeInteger(courierId) || courierId <= 0) {
            setShippingError('Please select a valid courier.');
            return;
        }

        awbLock.current = true;
        setAssigningAwb(true);
        setShippingError('');
        setMessage('');

        try {
            const response = await assignOrderAwbApi(
                order._id,
                courierId
            );

            if (!response.success || !response.shipping) {
                throw new Error(
                    response.error || 'Unable to assign AWB'
                );
            }

            setOrder(previous => ({
                ...previous,
                shipping: response.shipping,
            }));

            setMessage(
                response.message || 'Courier and AWB assigned successfully.'
            );

            onUpdated?.();
        } catch (error) {
            setShippingError(getErrorMessage(error));

            // The request may have reached Shiprocket even if
            // the response failed. Refresh before attempting again.
            try {
                const refreshed = await getAdminOrderDetailsApi(order._id);

                if (refreshed.success && refreshed.order) {
                    setOrder(refreshed.order);
                }
            } catch {
                // Preserve the original error.
            }
        } finally {
            awbLock.current = false;
            setAssigningAwb(false);
        }
    };


    const handleCheckAwbStatus = async () => {
        if (!order?.shipping?.shipmentId || checkingAwb) return;

        setCheckingAwb(true);
        setShippingError('');
        setAwbCheckResult(null);

        try {
            const response = await checkOrderAwbStatusApi(order._id);

            if (!response.success) {
                throw new Error(
                    response.error || 'Unable to check AWB status'
                );
            }

            setAwbCheckResult(response);

            console.log('AWB status check result:', {
                awbAssigned: response.awbAssigned,
                bookingStatus: response.bookingStatus,
                remote: response.remote,
            });
        } catch (error) {
            setShippingError(getErrorMessage(error));
        } finally {
            setCheckingAwb(false);
        }
    };

    const handleRecoverAwb = async () => {
        if (!order || recoveringAwb) return;

        const confirmed = window.confirm(
            'Shiprocket currently shows no AWB. Have you confirmed the previous assignment has stopped and want to unlock a retry?'
        );

        if (!confirmed) return;

        setRecoveringAwb(true);
        setShippingError('');

        try {
            const response = await recoverOrderAwbApi(order._id);

            if (!response.success || !response.shipping) {
                throw new Error(
                    response.error || 'Unable to recover AWB assignment'
                );
            }

            setOrder(previous => ({
                ...previous,
                shipping: response.shipping,
            }));

            setAwbCheckResult(null);
            setMessage('Shipment ready for another AWB attempt.');

            console.log('AWB recovery result:', response);
            onUpdated?.();
        } catch (error) {
            setShippingError(getErrorMessage(error));
        } finally {
            setRecoveringAwb(false);
        }
    };


    const handleGenerateLabel = async () => {
        if (
            !order?.shipping?.awbCode ||
            generatingLabel ||
            labelLock.current ||
            order.shipping.bookingStatus !== 'Created'
        ) return;

        labelLock.current = true;
        setGeneratingLabel(true);
        setShippingError('');
        setMessage('');

        try {
            const response = await generateOrderLabelApi(order._id);

            console.log('Shiprocket Label Response:', response);

            if (!response.success || !response.labelUrl) {
                throw new Error(
                    response.error || 'Unable to generate shipping label'
                );
            }

            setOrder(previous => ({
                ...previous,
                shipping: response.shipping
            }));

            setMessage('Shipping label generated successfully.');
            onUpdated?.();
        } catch (error) {
            setShippingError(getErrorMessage(error));
        } finally {
            labelLock.current = false;
            setGeneratingLabel(false);
        }
    };


    const handleRequestPickup = async () => {
        if (
            !order?.shipping?.awbCode ||
            !order?.shipping?.labelUrl ||
            order.shipping.pickupRequestedAt ||
            order.shipping.bookingStatus !== 'Created' ||
            requestingPickup ||
            pickupLock.current
        ) return;

        pickupLock.current = true;
        setRequestingPickup(true);
        setShippingError('');
        setMessage('');

        try {
            const response = await requestOrderPickupApi(order._id);

            console.log('Shiprocket Pickup Response:', response);

            if (!response.success || !response.shipping) {
                throw new Error(
                    response.error || 'Unable to request pickup'
                );
            }

            setOrder(previous => ({
                ...previous,
                shipping: response.shipping
            }));

            setMessage(
                response.message || 'Pickup requested successfully.'
            );

            onUpdated?.();
        } catch (error) {
            setShippingError(getErrorMessage(error));

            // Refresh because Shiprocket may have accepted
            // the request even if our API returned an error.
            try {
                const refreshed = await getAdminOrderDetailsApi(
                    order._id
                );

                if (refreshed.success && refreshed.order) {
                    setOrder(refreshed.order);
                }
            } catch {
                // Keep original error.
            }
        } finally {
            pickupLock.current = false;
            setRequestingPickup(false);
        }
    };


    const handleGenerateManifest = async () => {
        if (
            !order?.shipping?.pickupRequestedAt ||
            !order?.shipping?.awbCode ||
            order.shipping.bookingStatus !== 'Created' ||
            generatingManifest ||
            manifestLock.current
        ) return;

        manifestLock.current = true;
        setGeneratingManifest(true);
        setShippingError('');

        try {
            const response = await generateOrderManifestApi(order._id);

            console.log('Shiprocket Manifest Response:', response);

            if (!response.success || !response.manifestUrl) {
                throw new Error(
                    response.error || 'Unable to generate manifest'
                );
            }

            setOrder(previous => ({
                ...previous,
                shipping: response.shipping
            }));

            setMessage('Shipping manifest generated successfully.');
            onUpdated?.();
        } catch (error) {
            setShippingError(getErrorMessage(error));
        } finally {
            manifestLock.current = false;
            setGeneratingManifest(false);
        }
    };


    const handleRefreshTracking = async () => {
        if (!order?._id || !order.shipping?.awbCode || trackingLoading) {
            return;
        }

        setTrackingLoading(true);
        setTrackingError('');

        try {
            const response = await getOrderShippingTrackingApi(order._id);

            console.log('Shiprocket Tracking Response:', response);

            if (!response.success) {
                throw new Error(
                    response.error || 'Unable to fetch tracking'
                );
            }

            setTrackingData(response);
        } catch (error) {
            setTrackingError(getErrorMessage(error));
        } finally {
            setTrackingLoading(false);
        }
    };

    const handleCancelShipment = async () => {
        if (!order?.shipping?.awbCode) return;

        const confirmed = window.confirm(
            'Cancel this Shiprocket shipment?'
        );

        if (!confirmed) return;

        try {
            const response = await cancelOrderShipmentApi(order._id);

            console.log('SHIPROCKET CANCEL RESPONSE:', response);

            if (!response.success) {
                throw new Error(
                    response.error || 'Cancellation request failed'
                );
            }

            setMessage(
                'Cancellation requested. Awaiting Shiprocket confirmation.'
            );
        } catch (error) {
            setShippingError(getErrorMessage(error));
        }
    };


    const address = order?.shippingAddress || {};
    const nextStatus = allowedNextStatus[order?.status];
    const needsReview =
        order?.shipping?.bookingStatus === 'NeedsReview';

    const canAssignAwb =
        Boolean(selectedCourierId) &&
        !assigningAwb &&
        order?.shipping?.bookingStatus === 'Created' &&
        !order?.shipping?.awbCode;

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


                        {/* Shiprocket Fulfillment */}
                        {['Pending', 'Processing'].includes(order.status) && (
                            <section className="border-t border-gray-100 pt-6">

                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-base font-bold text-[#222222]">
                                            Shiprocket Fulfillment
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-400">
                                            Verify and pack the order before booking shipment.
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                        {order.shipping?.awbCode
                                            ? 'AWB Assigned'
                                            : order.shipping?.shipmentId
                                                ? 'Shipment Created'
                                                : 'Awaiting Packing'}
                                    </span>
                                </div>

                                <div className="rounded-2xl border border-[#BF8F5F]/20 bg-[#FCF6F2] p-5">

                                    {!order.shipping?.shipmentId && (
                                        <>
                                            {/* Payment Status */}
                                            <div className="mb-5 flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-600">
                                                    Payment Status
                                                </span>

                                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.paymentStatus === 'Paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {order.paymentStatus || 'Pending'}
                                                </span>
                                            </div>

                                            <h4 className="mb-4 text-sm font-bold text-[#222222]">
                                                Package Measurements
                                            </h4>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {[
                                                    { key: 'weightKg', label: 'Weight (kg)' },
                                                    { key: 'lengthCm', label: 'Length (cm)' },
                                                    { key: 'breadthCm', label: 'Breadth (cm)' },
                                                    { key: 'heightCm', label: 'Height (cm)' },
                                                ].map(field => (
                                                    <div key={field.key}>
                                                        <label className="mb-2 block text-xs font-medium text-gray-600">
                                                            {field.label}
                                                        </label>

                                                        <input
                                                            type="number"
                                                            min="0.01"
                                                            step="any"
                                                            value={packageDetails[field.key]}
                                                            onChange={event => {
                                                                setPackageDetails(previous => ({
                                                                    ...previous,
                                                                    [field.key]: event.target.value,
                                                                }));
                                                                setShippingRates(null);
                                                                setPackingVerified(false);
                                                                setShippingError('');
                                                            }}
                                                            placeholder="Enter measurement"
                                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#BF8F5F]"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Packing Confirmation */}
                                            <label className="mt-5 flex cursor-pointer items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={packingVerified}
                                                    onChange={event => {
                                                        setPackingVerified(event.target.checked);
                                                        setShippingRates(null);
                                                    }}
                                                    className="mt-1 accent-[#BF8F5F]"
                                                />

                                                <span className="text-xs leading-5 text-gray-600">
                                                    I have verified the ordered jewellery,
                                                    checked the packaging and entered the
                                                    correct parcel measurements.
                                                </span>
                                            </label>

                                            {shippingError && (
                                                <p className="mt-4 text-xs text-red-600">
                                                    {shippingError}
                                                </p>
                                            )}

                                            <button
                                                type="button"
                                                onClick={handleCheckShippingRates}
                                                disabled={
                                                    checkingRates ||
                                                    !packingVerified ||
                                                    !['Paid', 'TestPaid'].includes(
                                                        order.paymentStatus
                                                    )
                                                }
                                                className="mt-5 w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a87a45] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {checkingRates
                                                    ? 'Checking Available Couriers...'
                                                    : 'Check Shipping Rates'}
                                            </button>

                                            {order.paymentStatus === 'TestPaid' && (
                                                <p className="mt-3 text-xs text-amber-700">
                                                    Test payment: courier rates can be checked,
                                                    but actual shipment booking is disabled.
                                                </p>
                                            )}

                                            {/* Available Couriers */}
                                            {shippingRates && (
                                                <div className="mt-6 border-t border-[#BF8F5F]/20 pt-5">
                                                    <h4 className="mb-3 text-sm font-bold">
                                                        Available Couriers
                                                    </h4>

                                                    {!shippingRates.serviceable ? (
                                                        <p className="text-xs text-red-600">
                                                            No courier is currently available for
                                                            these package details and delivery pincode.
                                                        </p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {shippingRates.couriers.map(courier => (
                                                                <div
                                                                    key={courier.courier_company_id}
                                                                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4"
                                                                >
                                                                    <div className="min-w-0">
                                                                        <p className="text-sm font-semibold text-[#222222]">
                                                                            {courier.courier_name}
                                                                        </p>

                                                                        <p className="mt-1 text-xs text-gray-400">
                                                                            Estimated delivery:{' '}
                                                                            {courier.etd ||
                                                                                'Not available'}
                                                                        </p>
                                                                    </div>

                                                                    <p className="shrink-0 text-sm font-bold text-[#BF8F5F]">
                                                                        {formatPrice(courier.rate)}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>


                                {/* Shipment already created */}
                                {order.shipping?.shipmentId && (
                                    <div className="mt-5 space-y-5">

                                        {/* Shipment Information */}
                                        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                                            <h4 className="text-sm font-bold text-green-700">
                                                Shiprocket Shipment Created
                                            </h4>

                                            <p className="mt-3 text-xs text-gray-600">
                                                Order ID: {order.shipping.shiprocketOrderId}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-600">
                                                Shipment ID: {order.shipping.shipmentId}
                                            </p>

                                            <p className="mt-2 text-xs text-gray-600">
                                                Booking Status: {order.shipping.bookingStatus}
                                            </p>

                                            <div className="mt-4 border-t border-green-200 pt-3">
                                                <p className="text-xs font-semibold text-gray-700">
                                                    Saved Parcel Details
                                                </p>

                                                <p className="mt-2 text-xs text-gray-600">
                                                    Weight: {
                                                        order.shipping.packageDetails?.weightKg ?? '—'
                                                    } kg
                                                </p>

                                                <p className="mt-1 text-xs text-gray-600">
                                                    Dimensions:{' '}
                                                    {order.shipping.packageDetails?.lengthCm ?? '—'} ×{' '}
                                                    {order.shipping.packageDetails?.breadthCm ?? '—'} ×{' '}
                                                    {order.shipping.packageDetails?.heightCm ?? '—'} cm
                                                </p>
                                            </div>
                                        </div>

                                        {/* Courier Assignment */}
                                        {!order.shipping.awbCode &&
                                            ['Created', 'NeedsReview'].includes(
                                                order.shipping.bookingStatus
                                            ) && (
                                                <div className="rounded-xl border border-gray-200 bg-white p-5">

                                                    <h4 className="text-sm font-bold text-[#222222]">
                                                        Select Courier & Assign AWB
                                                    </h4>

                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Load available couriers for the saved package.
                                                    </p>

                                                    <button
                                                        type="button"
                                                        disabled={checkingRates || assigningAwb}
                                                        onClick={async () => {
                                                            setCheckingRates(true);
                                                            setShippingError('');

                                                            try {
                                                                const response =
                                                                    await getOrderShippingRatesApi(
                                                                        order._id,
                                                                        order.shipping.packageDetails
                                                                    );

                                                                if (!response.success) {
                                                                    throw new Error(
                                                                        response.error ||
                                                                        'Unable to load couriers'
                                                                    );
                                                                }

                                                                setShippingRates(response);
                                                                setSelectedCourierId('');
                                                            } catch (error) {
                                                                setShippingError(getErrorMessage(error));
                                                            } finally {
                                                                setCheckingRates(false);
                                                            }
                                                        }}
                                                        className="mt-4 rounded-xl border border-[#BF8F5F] px-4 py-2.5 text-xs font-bold text-[#BF8F5F] disabled:opacity-50"
                                                    >
                                                        {checkingRates
                                                            ? 'Loading Couriers...'
                                                            : 'Load Available Couriers'}
                                                    </button>

                                                    {shippingRates && (
                                                        <div className="mt-4 space-y-3">
                                                            {shippingRates.couriers.map(courier => (
                                                                <label
                                                                    key={courier.courier_company_id}
                                                                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name="shiprocketCourier"
                                                                        value={courier.courier_company_id}
                                                                        checked={
                                                                            selectedCourierId ===
                                                                            String(courier.courier_company_id)
                                                                        }
                                                                        onChange={event =>
                                                                            setSelectedCourierId(
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                        className="accent-[#BF8F5F]"
                                                                    />

                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-sm font-bold">
                                                                            {courier.courier_name}
                                                                        </p>

                                                                        <p className="mt-1 text-xs text-gray-400">
                                                                            ETA: {courier.etd || '—'}
                                                                        </p>
                                                                    </div>

                                                                    <p className="text-sm font-bold text-[#BF8F5F]">
                                                                        {formatPrice(courier.rate)}
                                                                    </p>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* <button
                                                        type="button"
                                                        onClick={() => {
                                                            console.log('AWB Assignment Check:', {
                                                                orderId: order._id,
                                                                shipmentId: order.shipping?.shipmentId,
                                                                selectedCourierId,
                                                                bookingStatus: order.shipping?.bookingStatus,
                                                                awbCode: order.shipping?.awbCode,
                                                                assigningAwb,
                                                                canAssignAwb,
                                                            });

                                                            handleAssignAwb();
                                                        }}
                                                        disabled={!canAssignAwb}
                                                        className="mt-5 w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {assigningAwb
                                                            ? 'Assigning AWB...'
                                                            : needsReview
                                                                ? 'AWB Assignment Requires Review'
                                                                : 'Assign Courier & Generate AWB'}
                                                    </button> */}

                                                    {needsReview ? (
                                                        <button
                                                            type="button"
                                                            onClick={handleCheckAwbStatus}
                                                            disabled={checkingAwb}
                                                            className="mt-5 w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                                                        >
                                                            {checkingAwb
                                                                ? 'Checking Shiprocket...'
                                                                : 'Check AWB Status'}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={handleAssignAwb}
                                                            disabled={
                                                                !selectedCourierId ||
                                                                assigningAwb ||
                                                                order.shipping?.bookingStatus !== 'Created'
                                                            }
                                                            className="mt-5 w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                                                        >
                                                            {assigningAwb
                                                                ? 'Assigning AWB...'
                                                                : 'Assign Courier & Generate AWB'}
                                                        </button>
                                                    )}
                                                    {needsReview && awbCheckResult?.awbAssigned === false && (
                                                        <button
                                                            type="button"
                                                            onClick={handleRecoverAwb}
                                                            disabled={recoveringAwb}
                                                            className="mt-3 w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                                                        >
                                                            {recoveringAwb
                                                                ? 'Recovering...'
                                                                : 'Resolve Issue & Enable AWB Retry'}
                                                        </button>
                                                    )}
                                                    {awbCheckResult && (
                                                        <p className="mt-3 text-xs font-medium text-gray-700">
                                                            {awbCheckResult.awbAssigned
                                                                ? `Existing AWB: ${awbCheckResult.remote?.awbCode}`
                                                                : 'No AWB returned. The shipment still requires reconciliation before retrying.'}
                                                        </p>
                                                    )}

                                                    {needsReview ? (
                                                        <button
                                                            type="button"
                                                            onClick={async () => {
                                                                try {
                                                                    const response = await getAdminOrderDetailsApi(order._id);

                                                                    if (!response.success || !response.order) {
                                                                        throw new Error('Unable to refresh order');
                                                                    }

                                                                    setOrder(response.order);
                                                                    setShippingError('');
                                                                } catch (error) {
                                                                    setShippingError(getErrorMessage(error));
                                                                }
                                                            }}
                                                            className="mt-5 w-full rounded-xl border border-[#BF8F5F] px-5 py-3 text-sm font-bold text-[#BF8F5F]"
                                                        >
                                                            Refresh Shipment Status
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={handleAssignAwb}
                                                            disabled={!selectedCourierId || assigningAwb}
                                                            className="mt-5 w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                                                        >
                                                            {assigningAwb
                                                                ? 'Assigning AWB...'
                                                                : 'Assign Courier & Generate AWB'}
                                                        </button>
                                                    )}
                                                </div>
                                            )}


                                        {order.shipping?.awbCode &&
                                            order.shipping?.labelUrl && (
                                                <div className="rounded-xl border border-gray-200 bg-white p-5">

                                                    <h4 className="text-sm font-bold text-[#222222]">
                                                        Courier Pickup
                                                    </h4>

                                                    {order.shipping.pickupRequestedAt ? (
                                                        <div className="mt-3 space-y-2">
                                                            <p className="text-sm font-semibold text-green-700">
                                                                Pickup Requested Successfully
                                                            </p>

                                                            <p className="text-xs text-gray-600">
                                                                Requested on: {
                                                                    new Date(
                                                                        order.shipping.pickupRequestedAt
                                                                    ).toLocaleString('en-IN')
                                                                }
                                                            </p>

                                                            {order.shipping.pickupScheduledAt && (
                                                                <p className="text-xs text-gray-600">
                                                                    Scheduled for: {
                                                                        new Date(
                                                                            order.shipping.pickupScheduledAt
                                                                        ).toLocaleString('en-IN')
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className="mt-2 text-xs text-gray-500">
                                                                Ensure the package is packed and
                                                                its shipping label is attached.
                                                            </p>

                                                            <button
                                                                type="button"
                                                                onClick={handleRequestPickup}
                                                                disabled={
                                                                    requestingPickup ||
                                                                    order.shipping.bookingStatus !== 'Created'
                                                                }
                                                                className="mt-4 w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {requestingPickup
                                                                    ? 'Requesting Pickup...'
                                                                    : 'Request Courier Pickup'}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}


                                        {order.shipping?.pickupRequestedAt && (
                                            <div className="rounded-xl border border-gray-200 bg-white p-5">
                                                <h4 className="text-sm font-bold text-[#222222]">
                                                    Shipping Manifest
                                                </h4>

                                                {order.shipping.manifestUrl ? (
                                                    <div className="mt-4">
                                                        <p className="mb-3 text-xs font-medium text-green-700">
                                                            Manifest Generated Successfully
                                                        </p>

                                                        <a
                                                            href={order.shipping.manifestUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-center text-sm font-bold text-white"
                                                        >
                                                            View / Print Manifest
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateManifest}
                                                        disabled={
                                                            generatingManifest ||
                                                            order.shipping.bookingStatus !== 'Created'
                                                        }
                                                        className="mt-4 w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                                                    >
                                                        {generatingManifest
                                                            ? 'Generating Manifest...'
                                                            : 'Generate Shipping Manifest'}
                                                    </button>
                                                )}
                                            </div>
                                        )}



                                        {order.shipping?.awbCode && (
                                            <div className="rounded-xl border border-gray-200 bg-white p-5">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-[#222222]">
                                                            Shipment Tracking
                                                        </h4>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            AWB: {order.shipping.awbCode}
                                                        </p>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={handleRefreshTracking}
                                                        disabled={trackingLoading}
                                                        className="rounded-lg bg-[#BF8F5F] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                                                    >
                                                        {trackingLoading ? 'Checking...' : 'Refresh Tracking'}
                                                    </button>
                                                </div>

                                                {trackingError && (
                                                    <p className="mt-3 text-xs text-red-600">
                                                        {trackingError}
                                                    </p>
                                                )}

                                                {trackingData && (
                                                    <div className="mt-5 space-y-4">
                                                        <div className="rounded-xl bg-[#F9F6F2] p-4">
                                                            <p className="text-xs text-gray-500">
                                                                Current Status
                                                            </p>

                                                            <p className="mt-1 text-base font-bold text-[#222222]">
                                                                {trackingData.tracking?.shipmentStatus ||
                                                                    'Awaiting Courier Update'}
                                                            </p>

                                                            {trackingData.tracking?.courierName && (
                                                                <p className="mt-1 text-xs text-gray-600">
                                                                    {trackingData.tracking.courierName}
                                                                </p>
                                                            )}

                                                            {trackingData.tracking?.estimatedDeliveryAt && (
                                                                <p className="mt-2 text-xs text-gray-600">
                                                                    Estimated Delivery: {
                                                                        new Date(
                                                                            trackingData.tracking.estimatedDeliveryAt
                                                                        ).toLocaleString('en-IN')
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                        {trackingData.tracking?.trackingUrl &&
                                                            trackingData.tracking.trackingUrl.startsWith('https://') && (
                                                                <a
                                                                    href={trackingData.tracking.trackingUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block text-sm font-semibold text-[#BF8F5F] underline"
                                                                >
                                                                    Track on Courier Website
                                                                </a>
                                                            )}

                                                        <div>
                                                            <h5 className="mb-3 text-sm font-bold text-[#222222]">
                                                                Tracking History
                                                            </h5>

                                                            {trackingData.tracking?.events?.length > 0 ? (
                                                                <div className="space-y-4 border-l-2 border-[#BF8F5F] pl-4">
                                                                    {trackingData.tracking.events.map((event, index) => (
                                                                        <div key={index}>
                                                                            <p className="text-sm font-semibold text-[#222222]">
                                                                                {event.activity || event.status}
                                                                            </p>

                                                                            {event.location && (
                                                                                <p className="text-xs text-gray-500">
                                                                                    {event.location}
                                                                                </p>
                                                                            )}

                                                                            {event.date && (
                                                                                <p className="text-xs text-gray-400">
                                                                                    {new Date(event.date).toLocaleString('en-IN')}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-gray-500">
                                                                    {trackingData.message ||
                                                                        'No tracking events available yet.'}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={handleCancelShipment}
                                            className="rounded-xl border border-red-300 px-4 py-3 font-semibold text-red-600"
                                        >
                                            Cancel Shiprocket Shipment
                                        </button>


                                        {needsReview && (
                                            <p className="mt-2 text-xs text-amber-700">
                                                Previous AWB attempt needs verification.
                                                Refreshing courier rates does not clear this state.
                                            </p>
                                        )}
                                        {/* AWB Information */}
                                        {order.shipping.awbCode && (
                                            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                                                <h4 className="text-sm font-bold text-green-700">
                                                    Courier Assigned
                                                </h4>

                                                <p className="mt-3 text-xs text-gray-600">
                                                    Courier: {order.shipping.courierName || '—'}
                                                </p>

                                                <p className="mt-2 text-xs font-semibold text-gray-700">
                                                    AWB: {order.shipping.awbCode}
                                                </p>


                                                <div className="mt-5 border-t border-green-200 pt-4">
                                                    {order.shipping.labelUrl ? (
                                                        <div className="space-y-3">
                                                            <p className="text-sm font-bold text-green-700">
                                                                Shipping Label Ready
                                                            </p>

                                                            <a
                                                                href={order.shipping.labelUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-center text-sm font-bold text-white"
                                                            >
                                                                View / Print Shipping Label
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={handleGenerateLabel}
                                                            disabled={
                                                                generatingLabel ||
                                                                order.shipping.bookingStatus !== 'Created'
                                                            }
                                                            className="w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {generatingLabel
                                                                ? 'Generating Shipping Label...'
                                                                : 'Generate Shipping Label'}
                                                        </button>
                                                    )}
                                                </div>

                                            </div>
                                        )}

                                        {order.shipping?.bookingStatus === 'NeedsReview' && (
                                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                                <p className="text-sm font-bold text-amber-800">
                                                    AWB Assignment Requires Review
                                                </p>

                                                <p className="mt-2 text-xs text-amber-700">
                                                    Shiprocket has not yet been confirmed to have
                                                    assigned an AWB. Check the existing shipment
                                                    before attempting another assignment.
                                                </p>

                                                {order.shipping.lastError && (
                                                    <p className="mt-2 text-xs text-amber-700">
                                                        {order.shipping.lastError}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {shippingError && (
                                            <p role="alert" className="text-xs text-red-600">
                                                {shippingError}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Create Shipment Button - Only before booking */}
                                {shippingRates?.serviceable &&
                                    !order.shipping?.shiprocketOrderId &&
                                    !order.shipping?.shipmentId && (
                                        <div className="mt-5">
                                            <button
                                                type="button"
                                                onClick={handleCreateShipment}
                                                disabled={
                                                    creatingShipment ||
                                                    !packingVerified ||
                                                    order.paymentStatus !== 'Paid' ||
                                                    !['Pending', 'Processing'].includes(order.status) ||
                                                    ![undefined, 'NotCreated'].includes(
                                                        order.shipping?.bookingStatus
                                                    )
                                                }
                                                className="w-full rounded-xl bg-[#BF8F5F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#a87a45] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {creatingShipment
                                                    ? 'Creating Shipment...'
                                                    : 'Create Shiprocket Shipment'}
                                            </button>
                                        </div>
                                    )}


                                {/* ADD THIS HERE */}
                                {/* {order.shipping?.shipmentId && (
                                    <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                                        <p className="text-sm font-bold text-green-700">
                                            Shiprocket Shipment Created
                                        </p>

                                        <p className="mt-2 text-xs text-gray-600">
                                            Shiprocket Order ID: {order.shipping.shiprocketOrderId}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-600">
                                            Shipment ID: {order.shipping.shipmentId}
                                        </p>

                                        <p className="mt-2 text-xs font-medium text-green-700">
                                            Next: Select Courier & Assign AWB
                                        </p>
                                    </div>
                                )} */}
                            </section>
                        )}


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