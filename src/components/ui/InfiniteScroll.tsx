'use client';

import { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
    offset: number;
    limit: number;
    total?: number;
    loading?: boolean;
    onChange: (newOffset: number) => void;
}

export default function InfiniteScroll({
    offset,
    limit,
    total,
    loading,
    onChange,
}: InfiniteScrollProps) {
    const observerRef = useRef<HTMLDivElement | null>(null);
    const fetchingRef = useRef(false);

    useEffect(() => {
        const target = observerRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                if (total && offset + limit >= total) return;

                if (entry.isIntersecting && !loading && !fetchingRef.current) {
                    fetchingRef.current = true;
                    onChange(offset + limit);
                }
            },
            {
                root: null,
                rootMargin: '200px',
                threshold: 0.3,
            },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [offset, limit, total, loading, onChange]);

    useEffect(() => {
        if (!loading) fetchingRef.current = false;
    }, [loading]);

    return (
        <div ref={observerRef} className="flex justify-center py-10">
            {loading ? (
                <div className="flex items-center gap-2 text-gray-400 text-sm animate-pulse">
                    <span>Loading more...</span>
                    <svg
                        className="animate-spin h-4 w-4 text-[#D6F379]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                </div>
            ) : (
                <span className="text-gray-500 text-xs">
                    Scroll to load more...
                </span>
            )}
        </div>
    );
}
