import Image from 'next/image';

export default function ArtistHeader({ artist }: { artist: any }) {
    return (
        <header className="relative bg-gradient-to-b from-[#D6F379]/20 to-transparent pt-12 pb-20 text-center">
            <div className="flex flex-col items-center">
                <div className="w-40 h-40 relative mb-4">
                    <Image
                        src={artist.image || '/placeholder-artist.png'}
                        alt={artist.name}
                        fill
                        className="object-cover rounded-full shadow-lg"
                    />
                </div>

                <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>

                <p className="text-gray-400 text-sm mb-2">
                    {artist.genres?.join(', ') || 'No genres available'}
                </p>

                <p className="text-gray-300 text-sm">
                    {artist.followers.toLocaleString()} followers · Popularity{' '}
                    {artist.popularity}/100
                </p>

                <a
                    href={artist.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-[#D6F379] hover:text-[#1ed760] transition"
                >
                    View on Spotify →
                </a>
            </div>
        </header>
    );
}
