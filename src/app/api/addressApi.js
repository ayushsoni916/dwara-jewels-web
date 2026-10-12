import apiClient from './client';

export const addAddressApi = async (addressData) => {
    const res = await apiClient.post('/address/add', addressData);
    return res.data;
};

export const getAddresses = async () => {
    const res = await apiClient.get('/address/all', {
        cache: 'no-store',
    });
    return res.data;
};

export const getDefaultAddress = async () => {
    const res = await apiClient.get('/address/default', {
        cache: 'no-store',
    });
    return res.data;
};

export const updateAddress = async (addressId, updates) => {
    const res = await apiClient.put(
        `/address/update/${encodeURIComponent(addressId)}`,
        updates
    );
    return res.data;
};

export const deleteAddress = async (addressId) => {
    const res = await apiClient.delete(
        `/address/delete/${encodeURIComponent(addressId)}`
    );
    return res.data;
};