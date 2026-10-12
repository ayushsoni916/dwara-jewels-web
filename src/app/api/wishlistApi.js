import apiClient from './client';

export const fetchWishlistApi = async () => {
    const response = await apiClient.get('/wishlist', {
        cache: 'no-store',
    });

    return response.data;
};

export const toggleWishlistApi = async productId => {
    const response = await apiClient.post('/wishlist/toggle', {
        productId,
    });

    return response.data;
};

export const moveWishlistToCartApi = async (
    productId,
    dimensionId,
    quantity = 1
) => {
    const response = await apiClient.post('/wishlist/move-to-cart', {
        productId,
        dimensionId,
        quantity,
    });

    return response.data;
};