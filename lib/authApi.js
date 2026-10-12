export const authRequest = async (action, payload = {}) => {
    const isSessionRequest = action === 'session';

    const response = await fetch(`/api/auth/${action}`, {
        method: isSessionRequest ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
        body: isSessionRequest ? undefined : JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        const error = new Error(
            data.error || data.message || 'Authentication failed'
        );
        error.status = response.status;
        throw error;
    }

    return data;
};