import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify";
import { getTopTracksByArtist } from "@/lib/tracks";
import { getAlbumsByArtist } from "@/lib/albums";
import { AlbumDetail, getAlbumsDetailsByIds } from "@/lib/albumDetails";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
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

    // 1️⃣ Obtener datos generales del artista
    const artistRes = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!artistRes.ok) {
      const text = await artistRes.text();
      throw new Error(`Error obteniendo datos del artista: ${artistRes.status} ${text}`);
    }

    const artistData = await artistRes.json();

    const artist = {
      id: artistData.id,
      name: artistData.name,
      genres: artistData.genres || [],
      followers: artistData.followers?.total || 0,
      popularity: artistData.popularity || 0,
      image: artistData.images?.[0]?.url || "",
      externalUrl: artistData.external_urls?.spotify || "",
    };

    // 2️⃣ Top Tracks del artista
    const topTracks = await getTopTracksByArtist(artistId, market);

    // 3️⃣ Álbumes básicos (con duración promedio y año)
    const albumsBasic = await getAlbumsByArtist(artistId, market);
    const albumIds = albumsBasic.map((a) => a.id).slice(0, 20); // Spotify permite máx. 20 IDs por batch

    // 4️⃣ Detalles de álbumes (label, copyrights, popularidad real)
    let albumsDetails: AlbumDetail[] = [];
    if (albumIds.length > 0) {
      albumsDetails = await getAlbumsDetailsByIds(albumIds);
    }

    // 5️⃣ Unificar datos de álbumes (básico + detalle)
    const albums = albumsBasic.map((album) => {
      const detail = albumsDetails.find((d) => d.id === album.id);
      return {
        ...album,
        label: detail?.label || "",
        popularity: detail?.popularity || album.popularity_avg || 0,
        copyrights: detail?.copyrights || [],
      };
    });

    // 6️⃣ Calcular insights simples
    const avgPopularity = topTracks.reduce((sum, t) => sum + t.popularity, 0) / (topTracks.length || 1);
    const avgDurationMs =
      topTracks.reduce((sum, t) => sum + (t.duration_ms || 0), 0) / (topTracks.length || 1);

    // 7️⃣ Respuesta final consolidada
    return NextResponse.json(
      {
        artist,
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
