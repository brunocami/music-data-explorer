'use client';
import ArtistSearchSection from '@/components/search/ArtistSearchSection';

export default function Home() {
    const handleSearch = async (query: string) => {
        console.log('Buscando artista:', query);
    };
    return (
        <main className="min-h-screen bg-[#222222] text-white">
            <div className="container mx-auto px-4">
                <ArtistSearchSection onSearch={handleSearch} />
            </div>
        </main>
    );
}
