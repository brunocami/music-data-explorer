import { NextResponse } from "next/server";
import { getAlbumsByArtist } from "@/lib/albums";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const artistId = searchParams.get("artistId");
  const market = searchParams.get("market") || "US";
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  if (!artistId) {
    return NextResponse.json(
      { error: "INVALID_PARAMS", detail: "El parámetro 'artistId' es obligatorio." },
      { status: 400 }
    );
  }

  try {
    const albums = await getAlbumsByArtist(artistId, market, offset);

    return NextResponse.json(
      {
        artistId,
        market,
        count: albums.length,
        items: albums,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error en /api/spotify/albums:", err);

    return NextResponse.json(
      { error: "SPOTIFY_REQUEST_FAILED", detail: (err instanceof Error ? err.message : String(err)) },
      { status: 502 }
    );
  }
}
