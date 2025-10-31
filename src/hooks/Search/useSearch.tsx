import { Artist } from '@/lib/artistas';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useSearch() {
    const [artists, setArtists] = useState<Artist[] | null>(null);
    const [offset, setOffset] = useState(0);
    const [query, setQuery] = useState('');
    const [total, setTotal] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [noMoreResults, setNoMoreResults] = useState(false);

    const limit = 9;

    useEffect(() => {
        if (!query) return;
        if (query.trim().length < 2) {
            toast('Please enter at least 2 characters.');
            return;
        }
        if (noMoreResults) return;

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

                // Si la respuesta es vacía, marcar que no hay más resultados
                if (data.items.length === 0) {
                    setNoMoreResults(true);
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
    }, [query, offset, noMoreResults]);
    // Reiniciar noMoreResults si cambia el query
    useEffect(() => {
        setNoMoreResults(false);
        setOffset(0);
    }, [query]);

    return {
        artists,
        setArtists,
        offset,
        setOffset,
        query,
        setQuery,
        total,
        setTotal,
        loading,
    };
}
