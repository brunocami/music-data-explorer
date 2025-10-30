export async function getSpotifyAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const TOKEN_URL = process.env.SPOTIFY_TOKEN_URL || "https://accounts.spotify.com/api/token";

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }).toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error obteniendo token de Spotify: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { access_token: string; token_type: string; expires_in: number };
  return data.access_token;
}
