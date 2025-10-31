import { AlbumDetail } from '@/lib/albumDetails';
import Image from 'next/image';

export default function ArtistAlbumsGrid({
    albums,
}: {
    albums: AlbumDetail[];
}) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {albums.map((album) => (
                <div
                    key={album.id}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 text-center transition"
                >
                    <Image
                        src={album.images[0].url || '/placeholder-album.png'}
                        alt={album.name}
                        width={180}
                        height={180}
                        className="rounded-md mx-auto mb-3"
                    />
                    <p className="font-medium text-sm mb-1 truncate">
                        {album.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                        {album.release_date_precision}
                    </p>
                </div>
            ))}
        </div>
    );
}
