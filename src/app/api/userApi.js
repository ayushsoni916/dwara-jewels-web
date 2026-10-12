import apiClient from './client';

export const getAllUsersApi = async (params = {}) => {
    const response = await apiClient.get('/admin/users', {
        params,
        cache: 'no-store',
    });

    return response.data;
};