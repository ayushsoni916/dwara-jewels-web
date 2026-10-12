import apiClient from './client';

export const addToCartApi = async (
    productId,
    quantity,
    dimensionId
) => {
    const res = await apiClient.post('/cart/add', {
        productId,
        quantity,
        dimensionId,
    });

    return res.data;
};

export const getCart = async () => {
    const res = await apiClient.get('/cart/get', {
        cache: 'no-store',
    });

    return res.data;
};

export const updateCart = async (
    itemId,
    type,
    dimensionId
) => {
    const res = await apiClient.put('/cart/update-item', {
        itemId,
        type,
        ...(dimensionId && { dimensionId }),
    });

    return res.data;
};

export const removeItem = async (itemId) => {
    const res = await apiClient.delete(
        `/cart/remove-item/${encodeURIComponent(itemId)}`
    );

    return res.data;
};

export const applyCoupon = async (couponCode) => {
    const res = await apiClient.post('/cart/apply-coupon', {
        couponCode,
    });

    return res.data;
};