'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../../../../context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { loading, isLoggedIn } = useAuth();

    useEffect(() => {
        if (!loading && isLoggedIn) {
            router.replace('/');
        }
    }, [loading, isLoggedIn, router]);

    if (loading) {
        return <p className="p-8 text-center">Loading…</p>;
    }

    return (
        <LoginModal
            isOpen={!isLoggedIn}
            onClose={() => router.replace('/')}
        />
    );
}