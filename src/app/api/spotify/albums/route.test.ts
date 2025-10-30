import { GET } from "./route";
import { getAlbumsByArtist } from "@/lib/albums";

jest.mock("@/lib/albums", () => ({
  getAlbumsByArtist: jest.fn(),
}));

describe("GET /api/spotify/albums", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (url: string) => new Request(url);

  it("debería devolver 400 si falta el parámetro 'artistId'", async () => {
    const req = buildRequest("http://localhost/api/spotify/albums");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("INVALID_PARAMS");
    expect(data.detail).toContain("artistId");
  });

  it("debería devolver 200 con los álbumes del artista", async () => {
    (getAlbumsByArtist as jest.Mock).mockResolvedValueOnce([
      { id: "1", name: "Album Uno" },
      { id: "2", name: "Album Dos" },
    ]);

    const req = buildRequest(
      "http://localhost/api/spotify/albums?artistId=abc123&market=AR&offset=5"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.artistId).toBe("abc123");
    expect(data.market).toBe("AR");
    expect(data.count).toBe(2);
    expect(data.items[0].name).toBe("Album Uno");

    expect(getAlbumsByArtist).toHaveBeenCalledWith("abc123", "AR", 5);
  });

  it("debería usar valores por defecto cuando no se pasan 'market' ni 'offset'", async () => {
    (getAlbumsByArtist as jest.Mock).mockResolvedValueOnce([
      { id: "1", name: "Album Único" },
    ]);

    const req = buildRequest(
      "http://localhost/api/spotify/albums?artistId=xyz999"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.market).toBe("US"); // valor por defecto
    expect(getAlbumsByArtist).toHaveBeenCalledWith("xyz999", "US", 0);
  });

  it("debería devolver 502 si ocurre un error en getAlbumsByArtist", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (getAlbumsByArtist as jest.Mock).mockRejectedValueOnce(
      new Error("Spotify no disponible")
    );

    const req = buildRequest(
      "http://localhost/api/spotify/albums?artistId=123"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toBe("SPOTIFY_REQUEST_FAILED");
    expect(data.detail).toBeTruthy();

    consoleSpy.mockRestore();
  });
});
