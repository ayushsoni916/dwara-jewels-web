
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import {
    fetchWishlistApi,
    toggleWishlistApi,
} from '../../api/wishlistApi';

// Shared across all category product buttons.
let wishlistPromise = null;
let savedIds = new Set();
let listeners = new Set();

const notify = () => listeners.forEach(fn => fn());

export default function WishlistButton({ productId }) {
    const router = useRouter();
    const { isLoggedIn, loading: authLoading } = useAuth();

    const [wishlisted, setWishlisted] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        if (!isLoggedIn) {
            wishlistPromise = null;
            savedIds = new Set();
            setWishlisted(false);
            return;
        }

        const update = () => {
            setWishlisted(savedIds.has(String(productId)));
        };

        listeners.add(update);
        update();

        // Multiple buttons share the SAME API request.
        if (!wishlistPromise) {
            wishlistPromise = fetchWishlistApi()
                .then(res => {
                    if (!res.success) throw new Error('Wishlist load failed');

                    savedIds = new Set(
                        (res.products || []).map(p => String(p._id))
                    );

                    notify();
                })
                .catch(error => {
                    wishlistPromise = null;
                    console.error('Wishlist load error:', error);
                });
        }

        return () => listeners.delete(update);
    }, [productId, isLoggedIn, authLoading]);

    const handleClick = async () => {
        if (busy || authLoading) return;

        if (!isLoggedIn) {
            router.push('/login');
            return;
        }

        setBusy(true);

        try {
            if (wishlistPromise) await wishlistPromise;

            const res = await toggleWishlistApi(productId);

            if (!res.success) {
                throw new Error(res.error || 'Wishlist update failed');
            }

            const id = String(productId);
            const next = new Set(savedIds);

            if (res.isWishlisted) next.add(id);
            else next.delete(id);

            savedIds = next;
            notify();
        } catch (error) {
            if (error.status === 401) {
                router.push('/login');
            } else {
                alert(error.message || 'Unable to update wishlist');
            }
        } finally {
            setBusy(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={busy || authLoading}
            aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-pressed={wishlisted}
            className="text-[#BF8F5F] hover:scale-110 transition-transform disabled:opacity-50"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={wishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
}
