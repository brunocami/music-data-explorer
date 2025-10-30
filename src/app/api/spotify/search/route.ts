import { NextResponse } from "next/server";
import { getArtistsByName } from "@/lib/artistas";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q");
  const limitParam = searchParams.get("limit");
  const market = searchParams.get("market");

  const limit = limitParam ? parseInt(limitParam, 10) : 10;

  if (!q || q.trim().length < 2) {
    return NextResponse.json(
      { error: "INVALID_PARAMS", detail: "El parámetro 'q' es obligatorio y debe tener al menos 2 caracteres." },
      { status: 400 }
    );
  }

  if (isNaN(limit) || limit < 1 || limit > 20) {
    return NextResponse.json(
      { error: "INVALID_LIMIT", detail: "El parámetro 'limit' debe estar entre 1 y 20." },
      { status: 400 }
    );
  }

  try {
    const artists = await getArtistsByName(q, limit, market || undefined);

    return NextResponse.json(
      {
        query: { q, limit, market },
        paging: { count: artists.length },
        items: artists,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error en /api/spotify/search:", err);

    return NextResponse.json(
      { error: "SPOTIFY_REQUEST_FAILED", detail: (err instanceof Error ? err.message : String(err)) },
      { status: 502 }
    );
  }
}
