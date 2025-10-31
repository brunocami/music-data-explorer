'use client';

import { AlbumDetailResponse } from '@/lib/albumDetails';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';

export default function ArtistCharts({
    albums,
}: {
    albums: AlbumDetailResponse[];
}) {
    const popularityByYear = albums.map((a) => ({
        year: a.releaseDate,
        popularity: a.popularity,
    }));
    const durationByAlbum = albums.map((a) => ({
        album: a.name.slice(0, 15) + '...',
        duration: Math.round(a.duration_avg_ms || 0 / 1000 / 60),
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">
                    Popularity by Year
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={popularityByYear}>
                        <XAxis dataKey="year" stroke="#ccc" />
                        <YAxis stroke="#ccc" />
                        <Tooltip />
                        <Bar
                            dataKey="popularity"
                            fill="#D6F379"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3">
                    Avg Track Duration per Album
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={durationByAlbum}>
                        <XAxis
                            dataKey="album"
                            stroke="#ccc"
                            tick={{ fontSize: 10 }}
                        />
                        <YAxis stroke="#ccc" />
                        <Tooltip />
                        <Bar
                            dataKey="duration"
                            fill="#D6F379"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
