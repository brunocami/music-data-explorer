import { Insights } from '@/app/api/spotify/artist-insights/route';

export default function ArtistStats({ insights }: { insights: Insights }) {
    const avgDurationMin = Math.round(insights.avgDurationMs / 60000);

    const stats = [
        { label: 'Albums', value: insights.albumsCount },
        { label: 'Avg. Popularity', value: insights.avgPopularity },
        { label: 'Avg. Track Duration', value: `${avgDurationMin} min` },
        { label: 'Top Track', value: insights.topTrack },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white/5 border border-white/10 rounded-xl py-4 px-3 text-center hover:bg-white/10 transition"
                >
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-lg font-semibold text-white mt-1">
                        {stat.value}
                    </p>
                </div>
            ))}
        </div>
    );
}
