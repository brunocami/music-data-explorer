'use client';

import ArtistSearchSection from '@/components/search/ArtistSearchSection';
import ArtistSearchResults from '@/components/search/ArtistSerachResults';
import InfiniteScroll from '@/components/ui/InfiniteScroll';
import { useSearch } from '@/hooks/Search/useSearch';
import { useRouter } from 'next/navigation';
import { Toaster } from 'sonner';

export default function Home() {
    const router = useRouter();

    const limit = 9;

    const { artists, offset, setOffset, setQuery, total, loading } =
        useSearch();

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
