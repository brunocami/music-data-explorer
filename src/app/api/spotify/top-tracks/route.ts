import { getTopTracksByArtist } from "@/lib/tracks";
import { NextResponse } from "next/server";

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
    const tracks = await getTopTracksByArtist(artistId, market);

    return NextResponse.json(
      {
        artistId,
        market,
        count: tracks.length,
        items: tracks,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error en /api/spotify/top-tracks:", err);

    return NextResponse.json(
      { error: "SPOTIFY_REQUEST_FAILED", detail: err || "Error inesperado al consultar Spotify." },
      { status: 502 }
    );
  }
}
