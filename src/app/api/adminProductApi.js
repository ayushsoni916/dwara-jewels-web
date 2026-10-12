import apiClient from './client';

export const getAdminProductsApi = async (params = {}) => {
    const response = await apiClient.get('/admin/products', {
        params,
        cache: 'no-store',
    });

    return response.data;
};

export const getAdminProductApi = async productId => {
    const response = await apiClient.get(`/admin/products/${productId}`, {
        cache: 'no-store',
    });

    return response.data;
};

export const setProductActiveApi = async (productId, isActive) => {
    const response = await apiClient.put(
        `/admin/products/${productId}/status`,
        { isActive }
    );

    return response.data;
};

export const saveAdminProductApi = async (formData, productId) => {
    const response = await fetch(
        `/api/backend/admin/products${productId ? `/${productId}` : ''}`,
        {
            method: productId ? 'PUT' : 'POST',
            body: formData,
            credentials: 'same-origin',
            signal: AbortSignal.timeout(120000),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw Object.assign(
            new Error(data.error || 'Unable to save product'),
            {
                status: response.status,
                data,
            }
        );
    }

    return data;
};