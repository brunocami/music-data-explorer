import { TrackResponse } from '@/lib/tracks';
import Image from 'next/image';

export default function ArtistTopTracks({
    tracks,
}: {
    tracks: TrackResponse[];
}) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
                <div
                    key={track.id}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition"
                >
                    <Image
                        src={track.albumImage || '/placeholder-album.png'}
                        alt={track.name}
                        width={60}
                        height={60}
                        className="rounded-md"
                    />
                    <div className="flex-1">
                        <p className="font-semibold">{track.name}</p>
                        <p className="text-gray-400 text-sm">{track.album}</p>
                    </div>
                    <p className="text-sm text-gray-300">
                        {Math.round(track.duration_ms / 1000 / 60)} min
                    </p>
                </div>
            ))}
        </div>
    );
}
