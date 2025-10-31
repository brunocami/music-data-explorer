import { ArtistInsightsResponse } from '@/app/api/spotify/artist-insights/route';
import { useState, useEffect } from 'react';

export function useArtist(artistId: string) {
    const [data, setData] = useState<ArtistInsightsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `/api/spotify/artist-insights?artistId=${artistId}`,
                );
                if (res?.status !== 200) {
                    setData(null);
                    throw new Error(
                        `Failed to fetch artist data: ${res.status}`,
                    );
                }
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error('Error loading artist:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [artistId]);

    return { data, loading };
}
