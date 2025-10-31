'use client';

import { useEffect, useState } from 'react';
import ArtistHeader from '@/components/artist/ArtistHeader';
import ArtistStats from '@/components/artist/ArtistStats';
import ArtistTopTracks from '@/components/artist/ArtistTopTracks';
import ArtistAlbumsGrid from '@/components/artist/ArtistAlbumsGrid';
import ArtistCharts from '@/components/artist/ArtistCharts';
import Loader from '@/components/ui/Loader';
import { ArtistInsightsResponse } from '@/app/api/spotify/artist-insights/route';

export default function ArtistViewClient({ artistId }: { artistId: string }) {
    const [data, setData] = useState<ArtistInsightsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `/api/spotify/artist-insights?artistId=${artistId}`,
                );
                const json = await res.json();
                setData(json);
                console.log('Artist data loaded:', json);
            } catch (err) {
                console.error('Error loading artist:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [artistId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-300">
                Failed to load artist data.
            </div>
        );
    }

    const { artist, insights, topTracks, albums } = data;

    return (
        <main className="min-h-screen bg-[#121212] text-white pb-20">
            <ArtistHeader artist={artist} />
            <section className="container mx-auto px-4">
                <ArtistStats insights={insights} />
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Top Tracks</h2>
                    <ArtistTopTracks tracks={topTracks} />
                </div>
                {albums && albums.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-semibold mb-4">
                            Discography
                        </h2>
                        <ArtistAlbumsGrid albums={albums} />
                    </div>
                )}
                {albums && albums.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-semibold mb-4">
                            Artist Insights
                        </h2>
                        <ArtistCharts albums={albums} />
                    </div>
                )}
            </section>
        </main>
    );
}
