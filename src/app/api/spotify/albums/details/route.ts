import { NextResponse } from "next/server";
import { getAlbumsDetailsByIds } from "@/lib/albumDetails";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json(
      { error: "INVALID_PARAMS", detail: "El parámetro 'ids' es obligatorio y debe contener IDs separados por coma." },
      { status: 400 }
    );
  }

  const ids = idsParam.split(",").map((id) => id.trim()).filter(Boolean);

  if (ids.length > 20) {
    return NextResponse.json(
      { error: "LIMIT_EXCEEDED", detail: "Solo se permiten hasta 20 IDs por request." },
      { status: 400 }
    );
  }

  try {
    const albums = await getAlbumsDetailsByIds(ids);

    return NextResponse.json(
      {
        count: albums.length,
        items: albums,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Error en /api/spotify/albums/details:", err);

    return NextResponse.json(
      { error: "SPOTIFY_REQUEST_FAILED", detail: (err as Error).message || "Error inesperado al consultar Spotify." },
      { status: 502 }
    );
  }
}
