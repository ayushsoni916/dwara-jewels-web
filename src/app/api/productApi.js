import apiClient from './client';

export const fetchCategoryApi = async (
    type = 'normal',
    client = apiClient
) => {
    const res = await client.get('/category', {
        params: { type },
    });

    return res.data;
};

export const fetchNewArrivalApi = async (
    luxe = false,
    client = apiClient
) => {
    const res = await client.get('/product', {
        params: {
            isNewArrival: true,
            sort: 'newest',
            luxe,
        },
    });

    return res.data;
};

export const fetchHomeProductsApi = async (
    page = 1,
    limit = 8,
    luxe = false,
    client = apiClient
) => {
    const res = await client.get('/product', {
        params: {
            page,
            limit,
            luxe,
        },
    });

    return res.data;
};

export const fetchProductDetailApi = async (
    id,
    client = apiClient
) => {
    const res = await client.get(
        `/product/${encodeURIComponent(id)}`,
        {
            cache: 'no-store',
        }
    );

    return res.data;
};

export const fetchSimilarProductsApi = async (
    id,
    client = apiClient
) => {
    const res = await client.get(
        `/product/${encodeURIComponent(id)}/similar`
    );

    return res.data;
};

export const fetchProductApi = async (
    params = {},
    client = apiClient,
    options = {}
) => {
    const res = await client.get('/product', {
        ...options,
        params,
    });

    return res.data;
};