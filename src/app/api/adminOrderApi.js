import apiClient from './client';

export const getAllOrdersApi = async (params = {}) => {
    const response = await apiClient.get('/admin/orders', {
        params,
        cache: 'no-store',
    });

    return response.data;
};

export const getAdminOrderDetailsApi = async orderId => {
    const response = await apiClient.get(
        `/admin/orders/${orderId}`,
        { cache: 'no-store' }
    );

    return response.data;
};

export const updateOrderStatusApi = async (orderId, status) => {
    const response = await apiClient.put(
        `/admin/orders/${orderId}/status`,
        { status }
    );

    return response.data;
};


export const getOrderShippingRatesApi = async (
    orderId,
    packageDetails
) => {
    const response = await apiClient.post(
        `/admin/orders/${orderId}/shipping/rates`,
        { packageDetails }
    );

    return response.data;
};

export const createOrderShipmentApi = async (
    orderId,
    packageDetails
) => {
    const response = await apiClient.post(
        `/admin/orders/${orderId}/shipping/create`,
        { packageDetails }
    );

    return response.data;
};

export const assignOrderAwbApi = async (
    orderId,
    courierId
) => {
    const response = await apiClient.post(
        `/admin/orders/${orderId}/shipping/awb`,
        { courierId }
    );

    return response.data;
};

export const requestOrderPickupApi = async orderId => {
    const response = await apiClient.post(
        `/admin/orders/${orderId}/shipping/pickup`,
        {}
    );

    return response.data;
};

export const generateOrderLabelApi = async orderId => {
    const response = await apiClient.post(
        `/admin/orders/${orderId}/shipping/label`,
        {}
    );

    return response.data;
};

export const generateOrderManifestApi = async orderId => {
    const response = await apiClient.post(
        `/admin/orders/${orderId}/shipping/manifest`,
        {}
    );

    return response.data;
};

export const getAdminOrderTrackingApi = async orderId => {
    const response = await apiClient.get(
        `/admin/orders/${orderId}/shipping/tracking`,
        { cache: 'no-store' }
    );

    return response.data;
};
export const checkOrderAwbStatusApi = async orderId => {
    const response = await apiClient.get(
        `/admin/orders/${orderId}/shipping/awb-status`,
        { cache: 'no-store' }
    );

    return response.data;
};
export const recoverOrderAwbApi = async orderId => {
    const response = await apiClient.post(
        `/admin/orders/${orderId}/shipping/awb-recover`,
        {}
    );

    return response.data;
};

export const getOrderShippingTrackingApi = async orderId => {
    const response = await apiClient.get(
        `/admin/orders/${orderId}/shipping/tracking`,
        { cache: 'no-store' }
    );

    return response.data;
};
export const cancelOrderShipmentApi = async orderId => {
    const response = await apiClient.post(
        `/admin/orders/${orderId}/shipping/cancel`,
        {}
    );

    return response.data;
};