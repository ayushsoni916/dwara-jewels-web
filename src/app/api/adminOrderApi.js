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