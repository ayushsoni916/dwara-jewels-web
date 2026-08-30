'use client';
import { useEffect } from 'react';

export default function RecentlyViewedTracker({ product }) {
    useEffect(() => {
        if (!product || !product._id) return;

        try {
            // 1. Get existing history from local storage
            const storedHistory = localStorage.getItem('recentlyViewed');
            let history = storedHistory ? JSON.parse(storedHistory) : [];

            // 2. Remove this product if it's already in the list (so we can move it to the front)
            history = history.filter((p) => p._id !== product._id);

            // 3. Add the current product to the very beginning of the array
            history.unshift(product);

            // 4. Limit the array to the last 4 products (adjust number if you want more)
            history = history.slice(0, 4);

            // 5. Save it back to local storage
            localStorage.setItem('recentlyViewed', JSON.stringify(history));
        } catch (error) {
            console.error("Error saving recently viewed product:", error);
        }
    }, [product]); // This runs every time the product prop changes

    return null; // This component is completely invisible
}