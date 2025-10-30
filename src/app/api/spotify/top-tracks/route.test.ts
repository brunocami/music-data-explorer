import { GET } from "./route";
import { getTopTracksByArtist } from "@/lib/tracks";

jest.mock("@/lib/tracks", () => ({
  getTopTracksByArtist: jest.fn(),
}));

describe("GET /api/spotify/top-tracks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (url: string) => new Request(url);

  it("debería devolver 400 si falta el parámetro 'artistId'", async () => {
    const req = buildRequest("http://localhost/api/spotify/top-tracks");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("INVALID_PARAMS");
    expect(data.detail).toContain("artistId");
  });

  it("debería devolver 200 con los tracks del artista", async () => {
    (getTopTracksByArtist as jest.Mock).mockResolvedValueOnce([
      { id: "1", name: "Song A" },
      { id: "2", name: "Song B" },
    ]);

    const req = buildRequest(
      "http://localhost/api/spotify/top-tracks?artistId=abc123&market=AR"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.artistId).toBe("abc123");
    expect(data.market).toBe("AR");
    expect(data.count).toBe(2);
    expect(data.items[0].name).toBe("Song A");

    expect(getTopTracksByArtist).toHaveBeenCalledWith("abc123", "AR");
  });

  it("debería devolver 200 con market por defecto 'US' si no se pasa el parámetro", async () => {
    (getTopTracksByArtist as jest.Mock).mockResolvedValueOnce([
      { id: "1", name: "Track One" },
    ]);

    const req = buildRequest(
      "http://localhost/api/spotify/top-tracks?artistId=xyz999"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.market).toBe("US");
    expect(getTopTracksByArtist).toHaveBeenCalledWith("xyz999", "US");
  });

  it("debería devolver 502 si ocurre un error en getTopTracksByArtist", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (getTopTracksByArtist as jest.Mock).mockRejectedValueOnce(
      new Error("Spotify no disponible")
    );

    const req = buildRequest(
      "http://localhost/api/spotify/top-tracks?artistId=123"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toBe("SPOTIFY_REQUEST_FAILED");
    expect(data.detail).toBeTruthy();

    consoleSpy.mockRestore();
  });
});
