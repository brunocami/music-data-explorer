import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify";
import { getTopTracksByArtist,  TrackResponse } from "@/lib/tracks";
import { getAlbumsByArtist } from "@/lib/albums";
import { AlbumDetailResponse, getAlbumsDetailsByIds } from "@/lib/albumDetails";
import { Artist } from "@/lib/artistas";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export interface Insights {
    avgPopularity: number;
    avgDurationMs: number;
    albumsCount: number;
    topTrack: string;
}


export interface ArtistInsightsResponse {
    artist: Artist;
    insights: Insights;
    topTracks: TrackResponse[];
    albums: Array<AlbumDetailResponse> | undefined;
}

export async function GET(request: Request): Promise<NextResponse<ArtistInsightsResponse | { error: string; detail: string }>> {
  const { searchParams } = new URL(request.url);
  const artistId = searchParams.get("artistId");
  const market = searchParams.get("market") || "US";

  if (!artistId) {
    return NextResponse.json(
      { error: "INVALID_PARAMS", detail: "El parámetro 'artistId' es obligatorio." },
      { status: 400 }
    );
  }

  try {
    const token = await getSpotifyAccessToken();

    const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!artistRes.ok) {
      const text = await artistRes.text();
      throw new Error(`Error obteniendo datos del artista: ${artistRes.status} ${text}`);
    }

    const artistData = await artistRes.json();

    const topTracks = await getTopTracksByArtist(artistId, market);

    const albumsBasic = await getAlbumsByArtist(artistId, market);
    const albumIds = albumsBasic.map((a) => a.id).slice(0, 20);

    let albumsDetails: AlbumDetailResponse[] = [];
    if (albumIds.length > 0) {
      albumsDetails = await getAlbumsDetailsByIds(albumIds);
    }

    const albums: AlbumDetailResponse[] = albumsBasic
      .map((album) => albumsDetails.find((d) => d.id === album.id))
      .filter((detail): detail is AlbumDetailResponse => detail !== undefined);

    const avgPopularity = topTracks.reduce((sum, t) => sum + t.popularity, 0) / (topTracks.length || 1);
    const avgDurationMs =
      topTracks.reduce((sum, t) => sum + (t.duration_ms || 0), 0) / (topTracks.length || 1);

    return NextResponse.json(
      {
        artist: artistData,
        insights: {
          avgPopularity: Math.round(avgPopularity),
          avgDurationMs,
          albumsCount: albums.length,
          topTrack: topTracks[0]?.name || "",
        },
        topTracks,
        albums,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error en /api/spotify/artist-insights:", err);

    return NextResponse.json(
      { error: "SPOTIFY_REQUEST_FAILED", detail: (err as Error).message || "Error inesperado al consultar Spotify." },
      { status: 502 }
    );
  }
}
