'use client';

import ArtistSearchSection from '@/components/search/ArtistSearchSection';
import ArtistSearchResults from '@/components/search/ArtistSerachResults';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import { Artist } from '@/lib/artistas';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function Home() {
    const [artists, setArtists] = useState<Artist[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [query, setQuery] = useState('');
    const [total, setTotal] = useState<number | undefined>(undefined);

    const router = useRouter();

    const limit = 9;

    useEffect(() => {
        if (!query) return;

        if (query.trim().length < 2) {
            toast('Please enter at least 2 characters.');
            return;
        }

        const controller = new AbortController();

        const fetchArtists = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/spotify/search?q=${encodeURIComponent(
                        query,
                    )}&limit=${limit}&offset=${offset}`,
                    { signal: controller.signal },
                );
                const data = await res.json();

                if (Array.isArray(data.items) === false) {
                    setLoading(false);
                    return;
                }

                setArtists((prev) =>
                    offset === 0
                        ? data.items
                        : [...(prev ?? []), ...data.items],
                );

                setTotal(data.paging?.total || undefined);
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    return;
                }
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
        return () => controller.abort();
    }, [query, offset]);

    const handleSelect = (artistId: string) => {
        router.push(`/artist/${artistId}`);
    };
    return (
        <main className="min-h-screen bg-[#222222] text-white">
            <div className="container mx-auto px-4 pb-16">
                <Toaster position="top-center" visibleToasts={3} />
                <ArtistSearchSection
                    onSearch={(q) => {
                        setQuery(q);
                        setOffset(0);
                    }}
                    isLoading={loading}
                />
                {artists && (
                    <ArtistSearchResults
                        artists={artists}
                        onSelect={handleSelect}
                    />
                )}
                {artists && artists.length > 0 && (
                    <InfiniteScroll
                        offset={offset}
                        limit={limit}
                        total={total}
                        loading={loading}
                        onChange={setOffset}
                    />
                )}
            </div>
        </main>
    );
}
