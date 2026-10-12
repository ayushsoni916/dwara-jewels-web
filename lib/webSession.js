import 'server-only';

import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';

export const sessionOptions = {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'dwara_session',
    ttl: 60 * 60 * 24 * 7,
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    },
};

export const getWebSession = async () =>
    getIronSession(await cookies(), sessionOptions);

export const sessionIsValid = session =>
    !!session.user?._id &&
    !!session.accessToken &&
    Number(session.expiresAt) > Date.now();