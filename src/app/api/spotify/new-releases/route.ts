import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const token = await getSpotifyAccessToken();

    const res = await fetch("https://api.spotify.com/v1/browse/new-releases?limit=9", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Error desde Spotify", status: res.status, detail: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Fallo en el servidor al consultar Spotify", detail: (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
