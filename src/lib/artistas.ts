import { getSpotifyAccessToken } from "@/lib/spotify";

export interface Artist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: { href: string | null; total: number };
  images: { url: string; width: number; height: number }[];
  external_urls: { spotify: string };
  uri: string;
}

export async function getArtistsByName(
  query: string,
  limit: number = 10,
  market?: string
): Promise<Artist[]> {
  if (!query || query.trim().length < 2) {
    throw new Error("Artist name is required and must be at least 2 characters.");
  }

  const token = await getSpotifyAccessToken();

  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", query.trim());
  url.searchParams.set("type", "artist");
  url.searchParams.set("limit", limit.toString());
  if (market) url.searchParams.set("market", market);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Spotify search failed: ${res.status} ${errText}`);
  }

  const data = await res.json();

  return (data.artists?.items || []).map((a: Artist) => ({
    id: a.id,
    name: a.name,
    genres: a.genres || [],
    popularity: a.popularity || 0,
    followers: a.followers?.total || 0,
    images: a.images || [],
    externalUrl: a.external_urls?.spotify || "",
    uri: a.uri || "",
  }));
}
