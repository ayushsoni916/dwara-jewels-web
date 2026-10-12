// collectionApi.js
import apiClient from './client';

export const fetchCollectionApi = async () => {
    const response = await apiClient.get('/collection', {
        cache: 'no-store',
    });

    return response.data;
};

export const saveCollectionApi = async (formData, collectionId) => {
    const response = await fetch(
        `/api/backend/collection${collectionId ? `/${collectionId}` : ''}`,
        {
            method: collectionId ? 'PUT' : 'POST',
            body: formData,
            credentials: 'same-origin',
            signal: AbortSignal.timeout(120000),
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw Object.assign(
            new Error(data.error || data.message || 'Unable to save collection'),
            {
                status: response.status,
                data,
            }
        );
    }

    return data;
};