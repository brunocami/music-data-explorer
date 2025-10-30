import { GET } from "./route";
import { getSpotifyAccessToken } from "@/lib/spotify";
import { getTopTracksByArtist } from "@/lib/tracks";
import { getAlbumsByArtist } from "@/lib/albums";
import { getAlbumsDetailsByIds } from "@/lib/albumDetails";

// 🔹 Mock de dependencias
jest.mock("@/lib/spotify", () => ({
  getSpotifyAccessToken: jest.fn(),
}));
jest.mock("@/lib/tracks", () => ({
  getTopTracksByArtist: jest.fn(),
}));
jest.mock("@/lib/albums", () => ({
  getAlbumsByArtist: jest.fn(),
}));
jest.mock("@/lib/albumDetails", () => ({
  getAlbumsDetailsByIds: jest.fn(),
}));

// 🔹 Mock global de fetch
global.fetch = jest.fn();

describe("GET /api/spotify/artist-insights", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (url: string) => new Request(url);

  it("debería devolver 400 si falta el parámetro 'artistId'", async () => {
    const req = buildRequest("http://localhost/api/spotify/artist-insights");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("INVALID_PARAMS");
    expect(data.detail).toContain("artistId");
  });

  it("debería devolver 200 con los datos consolidados del artista", async () => {
    // 🔹 Mock de token
    (getSpotifyAccessToken as jest.Mock).mockResolvedValue("fake_token");

    // 🔹 Mock de fetch del artista
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: "a1",
        name: "Mock Artist",
        genres: ["rock"],
        followers: { total: 1000 },
        popularity: 80,
        images: [{ url: "image.jpg" }],
        external_urls: { spotify: "https://spotify.com/artist/a1" },
      }),
    });

    // 🔹 Mock de top tracks
    (getTopTracksByArtist as jest.Mock).mockResolvedValue([
      { name: "Hit Song", popularity: 90, duration_ms: 200000 },
      { name: "Other Song", popularity: 70, duration_ms: 180000 },
    ]);

    // 🔹 Mock de álbumes básicos
    (getAlbumsByArtist as jest.Mock).mockResolvedValue([
      { id: "alb1", name: "Album 1", popularity_avg: 60 },
      { id: "alb2", name: "Album 2", popularity_avg: 50 },
    ]);

    // 🔹 Mock de detalles de álbumes
    (getAlbumsDetailsByIds as jest.Mock).mockResolvedValue([
      { id: "alb1", label: "Label A", popularity: 65, copyrights: ["© 2024"] },
      { id: "alb2", label: "Label B", popularity: 55, copyrights: ["© 2023"] },
    ]);

    const req = buildRequest(
      "http://localhost/api/spotify/artist-insights?artistId=a1&market=AR"
    );
    const res = await GET(req);
    const data = await res.json();

    // 🔹 Validaciones principales
    expect(res.status).toBe(200);
    expect(data.artist.name).toBe("Mock Artist");
    expect(data.artist.image).toBe("image.jpg");

    expect(data.insights.albumsCount).toBe(2);
    expect(data.insights.topTrack).toBe("Hit Song");
    expect(data.albums[0].label).toBe("Label A");
    expect(data.albums[1].popularity).toBe(55);

    // 🔹 Verificar llamadas
    expect(fetch).toHaveBeenCalledWith(
      "https://api.spotify.com/v1/artists/a1",
      expect.objectContaining({
        headers: { Authorization: "Bearer fake_token" },
      })
    );
    expect(getTopTracksByArtist).toHaveBeenCalledWith("a1", "AR");
    expect(getAlbumsByArtist).toHaveBeenCalledWith("a1", "AR");
    expect(getAlbumsDetailsByIds).toHaveBeenCalledWith(["alb1", "alb2"]);
  });

  it("debería devolver 502 si fetch devuelve error del artista", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (getSpotifyAccessToken as jest.Mock).mockResolvedValue("fake_token");

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => "Not found",
    });

    const req = buildRequest(
      "http://localhost/api/spotify/artist-insights?artistId=badid"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toBe("SPOTIFY_REQUEST_FAILED");
    expect(data.detail).toMatch(/Error obteniendo datos/);

    consoleSpy.mockRestore();
  });
});
