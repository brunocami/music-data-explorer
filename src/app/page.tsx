'use client';
import ArtistSearchSection from '@/components/search/ArtistSearchSection';
import ArtistSearchResults from '@/components/search/ArtistSerachResults';
import { Artist } from '@/lib/artistas';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

export default function Home() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (query: string) => {
        setLoading(true);
        try {
            if (!query || query.trim().length < 2) {
                toast('Please enter at least 2 characters.');
                return;
            }
            const res = await fetch(
                `/api/spotify/search?q=${encodeURIComponent(query)}`,
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
            toast('Failed to fetch artists. Please try again.');
            console.log('Error fetching artists:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (artistId: string) => {
        console.log('Selected artist:', artistId);
    };
    return (
        <main className="min-h-screen bg-[#222222] text-white">
            <div className="container mx-auto px-4">
                <Toaster position="top-center" visibleToasts={3} />
                <ArtistSearchSection
                    onSearch={handleSearch}
                    isLoading={loading}
                />
                <ArtistSearchResults
                    artists={artists}
                    onSelect={handleSelect}
                />
            </div>
        </main>
    );
}
