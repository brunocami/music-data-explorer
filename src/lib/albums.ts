import { getSpotifyAccessToken } from "@/lib/spotify";

export interface AlbumStats {
id: string;
name: string;
release_date: string;
release_date_precision: number;
total_tracks: number;
type: string;
popularity: number;
popularity_avg: number;
duration_avg_ms: number;
images: { url: string; width: number; height: number }[];
}

export async function getAlbumsByArtist(artistId: string, market: string = "US", offset: number = 0): Promise<AlbumStats[]> {
  if (!artistId) throw new Error("artistId es obligatorio.");

  const token = await getSpotifyAccessToken();

  // 1️⃣ Obtener todos los álbumes del artista
  const albumsUrl = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation,appears_on&limit=50&offset=${offset}&market=${market}`;
  const res = await fetch(albumsUrl, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error obteniendo álbumes: ${res.status} ${text}`);
  }

  const data = await res.json();
  const albums: AlbumStats[] = data.items || [];

  // 2️⃣ Iterar sobre cada álbum y obtener tracks
  const albumsData: AlbumStats[] = [];

  for (const album of albums) {
    const albumId = album.id;
    const tracksRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!tracksRes.ok) continue; // saltar álbum si falla
    const tracksData = await tracksRes.json();

    const tracks = tracksData.items || [];

    // Calcular duración promedio
    const totalDuration = tracks.reduce((sum: number, t: { duration_ms?: number }) => sum + (t.duration_ms || 0), 0);
    const durationAvgMs = tracks.length ? totalDuration / tracks.length : 0;

    // No tenemos popularidad de los tracks directamente en este endpoint,
    // así que usamos la popularidad del álbum como aproximación.
    const popularityAvg = album.popularity ?? 0;

    const releaseYear = album.release_date ? parseInt(album.release_date.slice(0, 4)) : 0;

    albumsData.push({
      id: album.id,
      name: album.name,
      release_date: album.release_date,
      release_date_precision: releaseYear,
      total_tracks: album.total_tracks || tracks.length,
      type: album.type,
      popularity: album.popularity ?? 0,
      popularity_avg: popularityAvg,
      duration_avg_ms: durationAvgMs,
      images: album.images || [],
    });
  }

  return albumsData;
}
