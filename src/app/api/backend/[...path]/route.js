import { NextResponse } from 'next/server';
import serverClient from '../../serverClient';
import {
    getWebSession,
    sessionIsValid,
} from '../../../../../lib/webSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const routes = [
    {
        method: 'GET',
        pattern: /^product(?:\/[a-f\d]{24}(?:\/similar)?)?$/i,
        requiresAuth: false,
    },
    {
        method: 'GET',
        pattern: /^(?:category|collection)$/,
        requiresAuth: false,
    },
    {
        method: 'GET',
        pattern: /^cart\/get$/,
        requiresAuth: true,
    },
    {
        method: 'POST',
        pattern: /^cart\/(?:add|apply-coupon)$/,
        requiresAuth: true,
    },
    {
        method: 'PUT',
        pattern: /^cart\/update-item$/,
        requiresAuth: true,
    },
    {
        method: 'DELETE',
        pattern: /^cart\/remove-item\/[a-f\d]{24}$/i,
        requiresAuth: true,
    },
    {
        method: 'GET',
        pattern: /^address\/(?:all|default)$/,
        requiresAuth: true,
    },
    {
        method: 'POST',
        pattern: /^address\/add$/,
        requiresAuth: true,
    },
    {
        method: 'PUT',
        pattern: /^address\/update\/[a-f\d]{24}$/i,
        requiresAuth: true,
    },
    {
        method: 'DELETE',
        pattern: /^address\/delete\/[a-f\d]{24}$/i,
        requiresAuth: true,
    },
    {
        method: 'POST',
        pattern: /^orders\/place$/,
        requiresAuth: true,
    },
    {
        method: 'GET',
        pattern: /^orders\/my-orders$/,
        requiresAuth: true,
    },
    {
        method: 'GET',
        pattern: /^wishlist$/,
        requiresAuth: true,
    },
    {
        method: 'POST',
        pattern: /^wishlist\/toggle$/,
        requiresAuth: true,
    },
    {
        method: 'POST',
        pattern: /^wishlist\/move-to-cart$/,
        requiresAuth: true,
    },

    {
        method: 'GET',
        pattern: /^admin\/users$/,
        requiresAuth: true,
    },

    {
        method: 'GET',
        pattern: /^admin\/orders(?:\/[a-f\d]{24})?$/i,
        requiresAuth: true,
    },
    {
        method: 'PUT',
        pattern: /^admin\/orders\/[a-f\d]{24}\/status$/i,
        requiresAuth: true,
    },

    {
        method: 'GET',
        pattern: /^admin\/coupons$/,
        requiresAuth: true,
    },
    {
        method: 'POST',
        pattern: /^admin\/coupons$/,
        requiresAuth: true,
    },
    {
        method: 'PUT',
        pattern: /^admin\/coupons\/[a-f\d]{24}$/i,
        requiresAuth: true,
    },
    {
        method: 'DELETE',
        pattern: /^admin\/coupons\/[a-f\d]{24}$/i,
        requiresAuth: true,
    },

    {
        method: 'GET',
        pattern: /^admin\/products(?:\/[a-f\d]{24})?$/i,
        requiresAuth: true,
    },
    {
        method: 'POST',
        pattern: /^admin\/products$/,
        requiresAuth: true,
    },
    {
        method: 'PUT',
        pattern: /^admin\/products\/[a-f\d]{24}$/i,
        requiresAuth: true,
    },
    {
        method: 'PUT',
        pattern: /^admin\/products\/[a-f\d]{24}\/status$/i,
        requiresAuth: true,
    },

    {
        method: 'POST',
        pattern: /^category$/,
        requiresAuth: true,
    },
    {
        method: 'PUT',
        pattern: /^category\/[a-f\d]{24}$/i,
        requiresAuth: true,
    },
    {
        method: 'POST',
        pattern: /^collection$/,
        requiresAuth: true,
    },
    {
        method: 'PUT',
        pattern: /^collection\/[a-f\d]{24}$/i,
        requiresAuth: true,
    },

    {
        method: 'POST',
        pattern:
            /^admin\/orders\/[a-f\d]{24}\/shipping\/(?:rates|create|awb|pickup|label|manifest)$/i,
        requiresAuth: true,
    },
    {
        method: 'GET',
        pattern:
            /^admin\/orders\/[a-f\d]{24}\/shipping\/tracking$/i,
        requiresAuth: true,
    },
    {
        method: 'GET',
        pattern: /^admin\/orders\/[a-f\d]{24}\/shipping\/awb-status$/i,
        requiresAuth: true
    },
    {
        method: 'POST',
        pattern: /^admin\/orders\/[a-f\d]{24}\/shipping\/awb-recover$/i,
        requiresAuth: true
    },
    {
        method: 'GET',
        pattern: /^admin\/orders\/[a-f\d]{24}\/shipping\/tracking$/i,
        requiresAuth: true
    },
    {
        method: 'POST',
        pattern: /^admin\/orders\/[a-f\d]{24}\/shipping\/cancel$/i,
        requiresAuth: true
    },


];

const reply = (data, status = 200) =>
    NextResponse.json(data, {
        status,
        headers: {
            'Cache-Control': 'private, no-store',
        },
    });

async function handleRequest(request, { params }) {
    const { path } = await params;
    const endpoint = path?.join('/') || '';

    console.log('API proxy reached:', request.method, endpoint);

    const route = routes.find(
        item =>
            item.method === request.method &&
            item.pattern.test(endpoint)
    );

    if (!route) {
        return reply({ error: 'Not found' }, 404);
    }


    const requestOrigin = request.headers.get('origin');

    if (request.method !== 'GET') {
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
            .split(',')
            .map(origin => origin.trim().replace(/\/+$/, ''))
            .filter(Boolean);

        const host = request.headers.get('host');

        let validOrigin = false;

        try {
            validOrigin =
                !!requestOrigin &&
                allowedOrigins.includes(requestOrigin) &&
                new URL(requestOrigin).host === host;
        } catch {
            validOrigin = false;
        }

        if (!validOrigin) {
            return reply({ error: 'Invalid request origin' }, 403);
        }
    }


    let session;

    try {
        session = await getWebSession();
        const authenticated = sessionIsValid(session);

        if (route.requiresAuth && !authenticated) {
            return reply({ error: 'Please sign in to continue' }, 401);
        }
        if (
            ['POST', 'PUT'].includes(request.method) &&
            (
                /^admin\/products(?:\/[a-f\d]{24})?$/i.test(endpoint) ||
                /^(?:category|collection)(?:\/[a-f\d]{24})?$/i.test(endpoint)
            )
        ) {
            let formData;

            try {
                formData = await request.formData();
            } catch {
                return reply({ error: 'Invalid product form data' }, 400);
            }

            const baseURL = process.env.BACKEND_API_URL?.replace(/\/+$/, '');

            if (!baseURL) {
                return reply({ error: 'Backend URL is not configured' }, 500);
            }

            const response = await fetch(`${baseURL}/${endpoint}`, {
                method: request.method,
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                },
                body: formData,
                cache: 'no-store',
                signal: AbortSignal.timeout(120000),
            });

            if (response.status === 401) {
                session?.destroy();
            }

            const data = await response.json().catch(() => ({
                error: 'Unable to read backend response',
            }));

            return reply(data, response.status);
        }

        let body;

        if (request.method === 'POST' || request.method === 'PUT') {
            try {
                body = await request.json();
            } catch {
                return reply({ error: 'Invalid request body' }, 400);
            }

            if (
                !body ||
                typeof body !== 'object' ||
                Array.isArray(body)
            ) {
                return reply({ error: 'Invalid request body' }, 400);
            }
        }

        const { data, status } = await serverClient.request(
            `/${endpoint}${request.nextUrl.search}`,
            {
                method: request.method,
                headers: authenticated
                    ? {
                        Authorization: `Bearer ${session.accessToken}`,
                    }
                    : {},
                ...(body !== undefined && { body }),
                cache: 'no-store',
                timeout: 10000,
            }
        );

        return reply(data, status);
    } catch (error) {
        if (error.status === 401) {
            session?.destroy();
        }

        const isClientError =
            error.status >= 400 && error.status < 500;

        return reply(
            {
                error: isClientError
                    ? error.message
                    : 'Unable to complete request. Please try again.',
            },
            isClientError ? error.status : 502
        );
    }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;