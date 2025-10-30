import { getSpotifyAccessToken } from "@/lib/spotify";
import { Artist } from "./artistas";

export interface Track {
    id: string;
    name: string;
    album: { name: string; images: { url: string; width: number; height: number }[]; release_date: string; };
    duration_ms: number;
    popularity: number;
    preview_url: string | null;
    external_urls: { spotify: string };
    artists: Artist[];
}

export async function getTopTracksByArtist(
  artistId: string,
  market: string = "US"
): Promise<Track[]> {
  if (!artistId) {
    throw new Error("El parámetro artistId es obligatorio.");
  }

  const token = await getSpotifyAccessToken();

  const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al obtener top tracks de Spotify: ${res.status} ${errText}`);
  }

  const data = await res.json();

  return (data.tracks || []).map((t: Track) => ({
    id: t.id,
    name: t.name,
    album: t.album?.name || "",
    albumImage: t.album?.images?.[0]?.url || "",
    releaseDate: t.album?.release_date || "",
    duration_ms: t.duration_ms || 0,
    popularity: t.popularity || 0,
    previewUrl: t.preview_url || null,
    externalUrl: t.external_urls?.spotify || "",
    artists: (t.artists || []).map((a: Artist) => a.name),
  }));
}
