import { getSpotifyAccessToken } from "@/lib/spotify";
import { Artist } from "./artistas";
import { Track } from "./tracks";

export interface AlbumDetail {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: {
    reason: string;
  };
  type: string;
  uri: string;
  artists: Artist[];
  tracks: Track[];
  copyrights: Array<{
    text: string;
    type: string;
  }>;
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  genres: string[];
  label: string;
  popularity: number;
}

export interface AlbumDetailResponse {
    id: string;
    name: string;
    artists: Artist[];
    label: string;
    popularity: number;
    releaseDate: string;
    releaseYear: string;
    totalTracks: string;
    genres: string[];
    copyrights: string[];
    image: string;
    externalUrl: {
        spotify: string;
    };
    duration_avg_ms: number;
}

export async function getAlbumsDetailsByIds(albumIds: string[]): Promise<AlbumDetailResponse[]> {
  if (!albumIds || albumIds.length === 0) {
    throw new Error("Debes proporcionar al menos un ID de álbum.");
  }

  if (albumIds.length > 20) {
    throw new Error("Spotify solo permite hasta 20 IDs por request.");
  }

  const token = await getSpotifyAccessToken();

  const idsParam = albumIds.join(",");

  const res = await fetch(`https://api.spotify.com/v1/albums?ids=${idsParam}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error obteniendo detalles de álbumes: ${res.status} ${text}`);
  }

  const data = await res.json();

  return (data.albums || []).map((a: AlbumDetail) => ({
    id: a.id,
    name: a.name,
    artists: (a.artists || []).map((ar: Artist) => ar.name),
    label: a.label || "",
    popularity: a.popularity || 0,
    releaseDate: a.release_date,
    releaseYear: a.release_date ? parseInt(a.release_date.slice(0, 4)) : 0,
    totalTracks: a.total_tracks || 0,
    genres: a.genres || [],
    copyrights: (a.copyrights || []).map((c: { text: string; type: string }) => c.text),
    image: a.images?.[0]?.url || "",
    externalUrl: a.external_urls?.spotify || ""
  }));
}
