import ArtistViewClient from '@/components/artist/ArtistViewClient';

export default async function ArtistPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <ArtistViewClient artistId={id} />;
}
