'use client';

import Image from 'next/image';

interface Artist {
    id: string;
    name: string;
    image?: string;
}

interface ArtistSearchResultsProps {
    artists: Artist[];
    onSelect: (artistId: string) => void;
}

export default function ArtistSearchResults({
    artists,
    onSelect,
}: ArtistSearchResultsProps) {
    if (!artists || artists.length === 0) {
        return (
            <p className="text-center text-gray-400 mt-10">
                No artists found. Try another search.
            </p>
        );
    }

    return (
        <section className="w-full mt-12 px-4">
            <div
                className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-8
          justify-items-center
        "
            >
                {artists.map((artist) => (
                    <div
                        key={artist.id}
                        onClick={() => onSelect(artist.id)}
                        className="
              group
              cursor-pointer
              flex flex-col items-center text-center
              transition-all
              rounded-2xl
              w-full
              max-w-xs
            "
                    >
                        {/* Imagen del artista */}
                        <div className="w-full aspect-square relative mb-4 overflow-hidden rounded-xl">
                            {artist.image ? (
                                <Image
                                    src={
                                        artist.image ||
                                        '/placeholder-artist.png'
                                    }
                                    alt={artist.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                    <span className="text-gray-400">
                                        No Image
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Nombre del artista */}
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#1DB954] transition-colors">
                            {artist.name}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
}
