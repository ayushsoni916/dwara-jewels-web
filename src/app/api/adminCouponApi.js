import apiClient from './client';

export const getAdminCouponsApi = async () => {
    const response = await apiClient.get('/admin/coupons', {
        cache: 'no-store',
    });

    return response.data;
};

export const createAdminCouponApi = async payload => {
    const response = await apiClient.post('/admin/coupons', payload);
    return response.data;
};

export const updateAdminCouponApi = async (couponId, payload) => {
    const response = await apiClient.put(
        `/admin/coupons/${couponId}`,
        payload
    );

    return response.data;
};

export const deleteAdminCouponApi = async couponId => {
    const response = await apiClient.delete(
        `/admin/coupons/${couponId}`
    );

    return response.data;
};