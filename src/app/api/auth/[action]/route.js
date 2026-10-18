
import { NextResponse } from 'next/server';
import {
    getWebSession,
    sessionIsValid,
    sessionOptions,
} from '../../../../../lib/webSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const reply = (data, status = 200) =>
    NextResponse.json(data, {
        status,
        headers: {
            'Cache-Control': 'private, no-store',
        },
    });

function isAllowedOrigin(request) {
    const origin = request.headers.get('origin');

    if (!origin) return false;

    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map(url => url.trim().replace(/\/+$/, ''))
        .filter(Boolean);

    return allowedOrigins.includes(origin);
}

export async function GET(request, { params }) {
    const { action } = await params;

    if (action !== 'session') {
        return reply({ success: false, error: 'Not found' }, 404);
    }

    try {
        const session = await getWebSession();
        const valid = sessionIsValid(session);

        return reply({
            success: true,
            user: valid ? session.user : null,
            expiresAt: valid ? session.expiresAt : 0,
        });
    } catch (error) {
        console.error('Session error:', error.message);

        return reply(
            { success: false, error: 'Unable to restore login' },
            500
        );
    }
}

export async function POST(request, { params }) {
    const { action } = await params;

    const allowedActions = [
        'send-otp',
        'verify-otp',
        'signup',
        'logout',
    ];

    if (!allowedActions.includes(action)) {
        return reply({ success: false, error: 'Not found' }, 404);
    }


    const origin = request.headers.get('origin');

    // React Native may not send an Origin header.
    // Temporary launch exception for OTP requests only.
    const allowMobileOtp =
        !origin &&
        !request.headers.get('cookie') &&
        ['send-otp', 'verify-otp'].includes(action);

    // if (!isAllowedOrigin(request) && !allowMobileOtp) {
    //     console.error('AUTH ORIGIN REJECTED:', {
    //         origin,
    //         host: request.headers.get('host'),
    //     });

    //     return reply({
    //         success: false,
    //         error: 'Invalid request origin',
    //     }, 403);
    // }


    try {
        // Logout
        if (action === 'logout') {
            const session = await getWebSession();
            session.destroy();

            return reply({ success: true });
        }

        // Read request body
        const body = await request.json().catch(() => null);

        if (
            !body ||
            typeof body !== 'object' ||
            Array.isArray(body)
        ) {
            return reply({
                success: false,
                error: 'Invalid request body',
            }, 400);
        }

        // Backend URL
        const base = process.env.BACKEND_API_URL?.replace(/\/+$/, '');

        if (!base) {
            console.error('BACKEND_API_URL missing');

            return reply({
                success: false,
                error: 'Backend URL is not configured',
            }, 500);
        }

        // Call backend
        const upstream = await fetch(`${base}/auth/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
        });

        const data = await upstream.json().catch(() => null);

        if (!upstream.ok || data?.success !== true) {
            console.error('AUTH BACKEND FAILED:', {
                action,
                status: upstream.status,
                message: data?.message || data?.error,
            });

            return reply({
                success: false,
                error:
                    data?.message ||
                    data?.error ||
                    'Backend authentication failed',
            }, upstream.ok ? 400 : upstream.status);
        }

        // OTP sent successfully
        if (action === 'send-otp') {
            return reply({
                success: true,
                message: data.message || 'OTP sent successfully',
            });
        }

        // New user signup flow
        if (action === 'verify-otp' && data.isNewUser === true) {
            if (!data.signupToken) {
                throw new Error('Missing signup token');
            }

            return reply({
                success: true,
                isNewUser: true,
                signupToken: data.signupToken,
            });
        }

        // Validate login response
        if (!data.token || !data.user?._id) {
            throw new Error('Invalid backend login response');
        }

        // Read JWT expiry
        const claims = JSON.parse(
            Buffer.from(
                data.token.split('.')[1],
                'base64url'
            ).toString('utf8')
        );

        const maxExpiry =
            Date.now() + sessionOptions.ttl * 1000;

        const expiresAt = Number.isFinite(claims.exp)
            ? Math.min(maxExpiry, claims.exp * 1000)
            : maxExpiry;

        if (expiresAt <= Date.now()) {
            throw new Error('Backend token expired');
        }

        // Create session only after successful login
        const session = await getWebSession();

        const {
            _id,
            firstName,
            lastName,
            phone,
            email,
            gender,
        } = data.user;

        session.user = {
            _id,
            firstName,
            lastName,
            phone,
            email,
            gender,
        };

        session.accessToken = data.token;
        session.expiresAt = expiresAt;

        await session.save();

        return reply({
            success: true,
            isNewUser: false,
            token: data.token,
            user: session.user,
            expiresAt,
        });

    } catch (error) {
        console.error('AUTH ERROR:', error.message);

        return reply({
            success: false,
            error: 'Unable to complete authentication. Please try again.',
        }, 502);
    }
}
