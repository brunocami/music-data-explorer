import { GET } from "./route";
import { getArtistsByName } from "@/lib/artistas";

jest.mock("@/lib/artistas", () => ({
  getArtistsByName: jest.fn(),
}));

describe("GET /api/spotify/search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (url: string) => new Request(url);

  it("debería devolver 400 si falta el parámetro 'q' o tiene menos de 2 caracteres", async () => {
    const req1 = buildRequest("http://localhost/api/spotify/search?q=");
    const res1 = await GET(req1);
    const data1 = await res1.json();

    expect(res1.status).toBe(400);
    expect(data1.error).toBe("INVALID_PARAMS");

    const req2 = buildRequest("http://localhost/api/spotify/search?q=a");
    const res2 = await GET(req2);
    const data2 = await res2.json();

    expect(res2.status).toBe(400);
    expect(data2.error).toBe("INVALID_PARAMS");
  });

  it("debería devolver 400 si el límite no es válido (<1 o >20 o NaN)", async () => {
    const invalidLimits = ["0", "25", "abc"];
    for (const limit of invalidLimits) {
      const req = buildRequest(
        `http://localhost/api/spotify/search?q=beatles&limit=${limit}`
      );
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe("INVALID_LIMIT");
    }
  });

  it("debería devolver 200 y los artistas si la búsqueda es válida", async () => {
    (getArtistsByName as jest.Mock).mockResolvedValueOnce([
      { id: "1", name: "The Beatles" },
      { id: "2", name: "Queen" },
    ]);

    const req = buildRequest(
      "http://localhost/api/spotify/search?q=rock&limit=2&market=US"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.query).toEqual({ q: "rock", limit: 2, market: "US" });
    expect(data.paging.count).toBe(2);
    expect(data.items[0].name).toBe("The Beatles");
    expect(getArtistsByName).toHaveBeenCalledWith("rock", 2, "US");
  });

  it("debería devolver 502 si ocurre un error en getArtistsByName", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (getArtistsByName as jest.Mock).mockRejectedValueOnce(
      new Error("Spotify no disponible")
    );

    const req = buildRequest(
      "http://localhost/api/spotify/search?q=metallica&limit=5"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toBe("SPOTIFY_REQUEST_FAILED");
    expect(data.detail).toBeTruthy();

    consoleSpy.mockRestore();
  });
});
