'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface ArtistSearchSectionProps {
    onSearch: (query: string) => void;
    isLoading?: boolean;
}

export default function ArtistSearchSection({
    onSearch,
    isLoading,
}: ArtistSearchSectionProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        onSearch(query.trim());
    };

    return (
        <section className="flex flex-col sm:items-center text-left md:text-center py-16 px-4 md:py-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3">
                Find your favorite <br />
                <span className="text-[#D6F379] drop-shadow-md">artists</span>
            </h1>

            <p className="text-gray-300 max-w-xl mb-8 text-sm sm:text-base">
                Search for your favorite artists and explore their albums and
                release history.
            </p>

            <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-md items-center bg-white rounded-full overflow-hidden border border-white/20 focus-within:ring-2 focus-within:ring-[#D6F379] transition p-1"
            >
                <input
                    type="text"
                    placeholder="Nirvana"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-[80%] sm:w-[70%] bg-transparent text-black placeholder-gray-400 px-4 py-3 outline-none text-sm sm:text-base"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex min-w-[60px] w-[20%] sm:w-[30%] items-center justify-center gap-2 bg-[#D6F379] text-black font-semibold px-5 py-3 rounded-full hover:bg-[#D6F37980] transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <span className="animate-pulse">Searching...</span>
                    ) : (
                        <>
                            <Search className="w-4 h-5" />
                            <span className="hidden sm:inline">Search</span>
                        </>
                    )}
                </button>
            </form>
        </section>
    );
}
