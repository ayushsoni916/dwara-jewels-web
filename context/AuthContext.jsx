'use client';

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { authRequest } from '../lib/authApi';

// import { authRequest } from '@/lib/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({ user: null, expiresAt: 0 });
    const [loading, setLoading] = useState(true);
    const versionRef = useRef(0);

    useEffect(() => {
        let active = true;

        const restore = async () => {
            const version = ++versionRef.current;

            try {
                const data = await authRequest('session');

                if (active && version === versionRef.current) {
                    setAuth({
                        user: data.user,
                        expiresAt: data.expiresAt,
                    });
                }
            } catch {
                // Keep the current state if a refresh temporarily fails.
            } finally {
                if (active) setLoading(false);
            }
        };

        restore();
        window.addEventListener('focus', restore);

        return () => {
            active = false;
            window.removeEventListener('focus', restore);
        };
    }, []);

    useEffect(() => {
        if (!auth.expiresAt) return;

        const timer = setTimeout(() => {
            versionRef.current++;
            setAuth({ user: null, expiresAt: 0 });
        }, Math.max(auth.expiresAt - Date.now(), 0));

        return () => clearTimeout(timer);
    }, [auth.expiresAt]);

    const login = (user, expiresAt) => {
        versionRef.current++;
        setAuth({ user, expiresAt });
        setLoading(false);
    };

    const logout = async () => {
        versionRef.current++;
        await authRequest('logout');

        // Ignore any restore request started while logging out.
        versionRef.current++;
        setAuth({ user: null, expiresAt: 0 });
        setLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user: auth.user,
                isLoggedIn: !!auth.user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be inside AuthProvider');
    }

    return context;
}