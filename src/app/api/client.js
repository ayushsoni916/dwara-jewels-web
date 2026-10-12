export function createApiClient(baseURL) {
    const base = baseURL.replace(/\/$/, '');

    async function request(endpoint, method, options = {}) {
        const {
            params,
            body,
            headers,
            timeout = 15000,
            ...fetchOptions
        } = options;

        let url = `${base}${endpoint}`;

        const query = new URLSearchParams();

        Object.entries(params || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.set(key, String(value));
            }
        });

        if (query.size > 0) {
            url += `${url.includes('?') ? '&' : '?'}${query.toString()}`;
        }

        const isFormData =
            typeof FormData !== 'undefined' &&
            body instanceof FormData;

        const requestHeaders = new Headers(headers);

        if (!requestHeaders.has('Accept')) {
            requestHeaders.set('Accept', 'application/json');
        }

        if (body !== undefined && !isFormData) {
            requestHeaders.set('Content-Type', 'application/json');
        }

        const response = await fetch(url, {
            ...fetchOptions,
            method,
            headers: requestHeaders,
            ...(body !== undefined && {
                body: isFormData ? body : JSON.stringify(body),
            }),
            signal:
                fetchOptions.signal ||
                AbortSignal.timeout(timeout),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data || data.success === false) {
            const error = new Error(
                data?.error || data?.message || 'Request failed'
            );

            error.status = response.status;
            error.data = data;

            throw error;
        }

        return {
            data,
            status: response.status,
        };
    }

    return {
        request: (endpoint, options = {}) =>
            request(endpoint, options.method || 'GET', options),

        get: (endpoint, options = {}) =>
            request(endpoint, 'GET', options),

        post: (endpoint, body, options = {}) =>
            request(endpoint, 'POST', { ...options, body }),

        put: (endpoint, body, options = {}) =>
            request(endpoint, 'PUT', { ...options, body }),

        delete: (endpoint, options = {}) =>
            request(endpoint, 'DELETE', options),
    };
}

// Browser requests use the website's shared API route.
const apiClient = createApiClient('/api/backend');

export default apiClient;