
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchCollectionApi } from '../../../api/collectionApi';

const DIL_KI_BAAT_ID = '6acd0c56b2210243220ab681';

export default function DilKiBaatBanner() {
    const [collection, setCollection] = useState(null);

    useEffect(() => {
        let active = true;

        const loadCollection = async () => {
            try {
                const data = await fetchCollectionApi();

                const dilKiBaat = data?.collections?.find(
                    item => item._id === DIL_KI_BAAT_ID
                );

                if (active) {
                    setCollection(dilKiBaat || null);
                }
            } catch (error) {
                console.error('Dil Ki Baat banner error:', error);
            }
        };

        loadCollection();

        return () => {
            active = false;
        };
    }, []);

    if (!collection?.image?.url) return null;

    return (
        <section className="w-full mt-8 lg:mt-[200px]">
            <Link
                href={`/category?collectionId=${collection._id}`}
                aria-label={`Explore ${collection.name} collection`}
                className="block w-full overflow-hidden group"
            >
                <div className="relative w-full aspect-[1983/793]">
                    <Image
                        src={collection.image.url}
                        alt={`${collection.name} - Dwara Jewels`}
                        fill
                        sizes="100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                </div>
            </Link>
        </section>
    );
}
