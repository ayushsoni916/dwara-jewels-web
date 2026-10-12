'use client';

import { useState } from 'react';
import ProductHeader from './ProductHeader';
import ProductAccordions from './ProductAccordions';

export default function ProductDetails({ product }) {
    const dimensions = (
        Array.isArray(product.dimensions) ? product.dimensions : []
    )
        .filter(option => option?._id)
        .slice()
        .sort((a, b) =>
            String(a.size || '').localeCompare(
                String(b.size || ''),
                undefined,
                { numeric: true }
            )
        );

    const [selectedId, setSelectedId] = useState(() =>
        dimensions.find(option => Number(option.stock) > 0)?._id ||
        dimensions[0]?._id ||
        null
    );

    const selectedDimension =
        dimensions.find(option => option._id === selectedId) ||
        dimensions.find(option => Number(option.stock) > 0) ||
        dimensions[0];

    return (
        <>
            <ProductHeader
                product={product}
                dimensions={dimensions}
                selectedDimension={selectedDimension}
                onSelectDimension={setSelectedId}
            />

            <ProductAccordions
                product={product}
                selectedDimension={selectedDimension}
            />
        </>
    );
}