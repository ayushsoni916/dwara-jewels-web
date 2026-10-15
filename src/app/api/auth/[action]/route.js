import { NextResponse } from 'next/server';
import { getWebSession, sessionIsValid, sessionOptions } from '../../../../../lib/webSession';
// import {
//     getWebSession,
//     sessionIsValid,
//     sessionOptions,
// } from '@/lib/webSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const reply = (data, status = 200) =>
    NextResponse.json(data, {
        status,
        headers: { 'Cache-Control': 'private, no-store' },
    });

export async function GET(request, { params }) {
    const { action } = await params;

    if (action !== 'session') {
        return reply({ error: 'Not found' }, 404);
    }

    try {
        const session = await getWebSession();
        const valid = sessionIsValid(session);

        return reply({
            success: true,
            user: valid ? session.user : null,
            expiresAt: valid ? session.expiresAt : 0,
        });
    } catch {
        return reply({ error: 'Unable to restore login' }, 500);
    }
}

export async function POST(request, { params }) {
    const { action } = await params;

    if (!['send-otp', 'verify-otp', 'signup', 'logout'].includes(action)) {
        return reply({ error: 'Not found' }, 404);
    }

    const requestOrigin = request.headers.get('origin');
    const requestHost = request.headers.get('host');

    let validOrigin = false;

    try {
        if (requestOrigin && requestHost) {
            const parsedOrigin = new URL(requestOrigin);

            validOrigin =
                ['http:', 'https:'].includes(parsedOrigin.protocol) &&
                parsedOrigin.host === requestHost;
        }
    } catch {
        validOrigin = false;
    }

    if (!validOrigin) {
        console.warn('Invalid auth request origin:', {
            requestOrigin,
            requestHost,
            nextUrlOrigin: request.nextUrl.origin,
        });

        return reply(
            { error: 'Invalid request origin' },
            403
        );
    }

    try {
        const session = await getWebSession();

        if (action === 'logout') {
            session.destroy();
            return reply({ success: true });
        }

        let body;

        try {
            body = await request.json();
        } catch {
            return reply({ error: 'Invalid request body' }, 400);
        }

        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return reply({ error: 'Invalid request body' }, 400);
        }

        const base = process.env.BACKEND_API_URL?.replace(/\/$/, '');

        if (!base) throw new Error('Missing BACKEND_API_URL');

        const upstream = await fetch(`${base}/auth/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
        });

        const data = await upstream.json();

        if (!upstream.ok || data.success !== true) {
            return reply(
                {
                    error:
                        data.message ||
                        data.error ||
                        'Authentication failed',
                },
                upstream.ok ? 400 : upstream.status
            );
        }

        if (action === 'send-otp') {
            return reply({ success: true, message: data.message });
        }

        // New users complete their profile before logging in.
        if (action === 'verify-otp' && data.isNewUser === true) {
            if (!data.signupToken) throw new Error('Missing signup token');

            return reply({
                success: true,
                isNewUser: true,
                signupToken: data.signupToken,
            });
        }

        if (!data.token || !data.user?._id) {
            throw new Error('Invalid login response');
        }

        // Read expiry only from the token returned by our backend.
        const claims = JSON.parse(
            Buffer.from(data.token.split('.')[1], 'base64url').toString()
        );

        const maxExpiry = Date.now() + sessionOptions.ttl * 1000;
        const expiresAt = Number.isFinite(claims.exp)
            ? Math.min(maxExpiry, claims.exp * 1000)
            : maxExpiry;

        if (expiresAt <= Date.now()) {
            throw new Error('Expired backend token');
        }

        const { _id, firstName, lastName, phone, email, gender } = data.user;

        session.user = { _id, firstName, lastName, phone, email, gender };
        session.accessToken = data.token;
        session.expiresAt = expiresAt;

        await session.save();

        return reply(
            {
                success: true,
                isNewUser: false,
                user: session.user,
                expiresAt,
            },
            upstream.status
        );
    } catch {
        return reply(
            { error: 'Unable to complete authentication. Please try again.' },
            502
        );
    }
}