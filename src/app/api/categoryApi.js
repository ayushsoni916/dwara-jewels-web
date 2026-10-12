// categoryApi.js
import apiClient from './client';

export const fetchCategoryApi = async (type = 'normal') => {
    const response = await apiClient.get('/category', {
        params: { type },
        cache: 'no-store',
    });

    return response.data;
};

export const fetchAllCategoriesApi = async () => {
    const [normal, luxury] = await Promise.all([
        fetchCategoryApi('normal'),
        fetchCategoryApi('luxury'),
    ]);

    if (
        !normal.success ||
        !luxury.success ||
        !Array.isArray(normal.categories) ||
        !Array.isArray(luxury.categories)
    ) {
        throw new Error('Unable to fetch categories');
    }

    const categories = new Map(
        [...normal.categories, ...luxury.categories]
            .map(category => [category._id, category])
    );

    return {
        success: true,
        categories: [...categories.values()],
    };
};

export const saveCategoryApi = async (formData, categoryId) => {
    const response = await fetch(
        `/api/backend/category${categoryId ? `/${categoryId}` : ''}`,
        {
            method: categoryId ? 'PUT' : 'POST',
            body: formData,
            credentials: 'same-origin',
            signal: AbortSignal.timeout(120000),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw Object.assign(
            new Error(data.error || data.message || 'Unable to save category'),
            {
                status: response.status,
                data,
            }
        );
    }

    return data;
};