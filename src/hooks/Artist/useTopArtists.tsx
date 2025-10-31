import { useState, useEffect } from 'react';

export interface TopArtistsResponse {
    id: string;
    name: string;
    image?: string;
}

export function useTopArtists() {
    const [newRelease, setNewReleases] = useState<TopArtistsResponse[] | null>(
        null,
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/spotify/new-releases`);
                if (res?.status !== 200) {
                    setNewReleases(null);
                    throw new Error(
                        `Failed to fetch artist data: ${res.status}`,
                    );
                }

                const json = await res.json();

                if (!json.albums || !json.albums.items) {
                    setNewReleases(null);
                    throw new Error('Invalid data format from Spotify API');
                }

                json.albums.items.map((album: any) => {
                    setNewReleases((prev) => [
                        ...(prev || []),
                        {
                            id: album.artists[0].id,
                            name: album.artists[0].name,
                            image:
                                album.images?.[0]?.url ||
                                '/placeholder-artist.png',
                        },
                    ]);
                });
            } catch (err) {
                console.error('Error loading artist:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return { newRelease, loading };
}
