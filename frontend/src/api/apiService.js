const BASE_URL = import.meta.env.VITE_BASE_URL;

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    console.log('=== API REQUEST ===');
    console.log('Endpoint:', endpoint);
    console.log('Payload:', body);

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    console.log('=== RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Content-Length:', response.headers.get('content-length'));

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return null;
    }


    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    
    if (contentLength === '0' || response.status === 204) {
        console.warn('Empty response body received');
        return {
            ok: response.ok,
            status: response.status,
            data: null
        };
    }

    // Try to parse JSON
    if (contentType && contentType.includes('application/json')) {
        try {
            const data = await response.json();
            console.log('Parsed data:', data);
            return {
                ok: response.ok,
                status: response.status,
                data: data
            };
        } catch (err) {
            console.error('JSON parse error:', err);
            return {
                ok: response.ok,
                status: response.status,
                data: null,
                error: 'Failed to parse JSON'
            };
        }
    }


    const text = await response.text();
    return {
        ok: response.ok,
        status: response.status,
        data: text
    };
};