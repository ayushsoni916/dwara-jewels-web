import apiClient from './client';

export const placeOrderApi = async (shippingAddress, paymentType) => {
    const res = await apiClient.post('/orders/place', {
        shippingAddress,
        paymentType,
    });

    return res.data;
};

export const getMyOrdersApi = async () => {
    const res = await apiClient.get('/orders/my-orders', {
        cache: 'no-store',
    });

    return res.data;
};

export const getOrderDetailsApi = async orderId => {
    const response = await getMyOrdersApi();

    if (!response.success || !Array.isArray(response.orders)) {
        throw new Error('Unable to load your order.');
    }

    const order = response.orders.find(
        item => String(item._id) === String(orderId)
    );

    if (!order) {
        throw new Error('Order not found.');
    }

    return { success: true, order };
};

export const createOrderApi = async (shippingAddress, requestId) => {
    const res = await apiClient.post('/orders/create', {
        shippingAddress,
        paymentType: 'Online',
        requestId,
    });

    return res.data;
};

export const getCheckoutStatusApi = async (checkoutId) => {
    const res = await apiClient.get(
        `/orders/checkout/${encodeURIComponent(checkoutId)}/status`
    );

    return res.data;
};