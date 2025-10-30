'use client';
import ArtistSearchSection from '@/components/search/ArtistSearchSection';
import ArtistSearchResults from '@/components/search/ArtistSerachResults';
import Paginator from '@/components/ui/Paginator';
import { Artist } from '@/lib/artistas';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function Home() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [query, setQuery] = useState('');

    const limit = 9;

    useEffect(() => {
        if (!query || query.trim().length < 2) {
            toast('Please enter at least 2 characters.');
            return;
        }

        // Cancel request pendiente si callo otra.
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
                setArtists(
                    data.items.map((a: Artist) => ({
                        id: a.id,
                        name: a.name,
                        image: a.images?.[0]?.url,
                    })),
                );
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
        return () => controller.abort();
    }, [query, offset]);

    const handleSelect = (artistId: string) => {
        console.log('Selected artist:', artistId);
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
                <ArtistSearchResults
                    artists={artists}
                    onSelect={handleSelect}
                />
                {artists.length > 0 && (
                    <Paginator
                        offset={offset}
                        limit={limit}
                        onChange={setOffset}
                    />
                )}
            </div>
        </main>
    );
}
