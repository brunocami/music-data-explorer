import { GET } from "./route";
import { getAlbumsDetailsByIds } from "@/lib/albumDetails";

jest.mock("@/lib/albumDetails", () => ({
  getAlbumsDetailsByIds: jest.fn(),
}));

describe("GET /api/spotify/albums/details", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const buildRequest = (url: string) => new Request(url);

  it("debería devolver 400 si falta el parámetro 'ids'", async () => {
    const req = buildRequest("http://localhost/api/spotify/albums/details");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("INVALID_PARAMS");
    expect(data.detail).toMatch(/ids/i);
  });

  it("debería devolver 400 si se envían más de 20 IDs", async () => {
    const ids = Array.from({ length: 21 }, (_, i) => `id${i}`).join(",");
    const req = buildRequest(
      `http://localhost/api/spotify/albums/details?ids=${ids}`
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("LIMIT_EXCEEDED");
  });

  it("debería devolver 200 con los detalles de los álbumes", async () => {
    (getAlbumsDetailsByIds as jest.Mock).mockResolvedValueOnce([
      { id: "1", name: "Album A" },
      { id: "2", name: "Album B" },
    ]);

    const req = buildRequest(
      "http://localhost/api/spotify/albums/details?ids=1,2"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(2);
    expect(data.items[0].name).toBe("Album A");

    expect(getAlbumsDetailsByIds).toHaveBeenCalledWith(["1", "2"]);
  });

  it("debería eliminar espacios en blanco en los IDs", async () => {
    (getAlbumsDetailsByIds as jest.Mock).mockResolvedValueOnce([
      { id: "1", name: "Album Clean" },
    ]);

    const req = buildRequest(
      "http://localhost/api/spotify/albums/details?ids= 1 , , "
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.count).toBe(1);
    expect(data.items[0].name).toBe("Album Clean");

    expect(getAlbumsDetailsByIds).toHaveBeenCalledWith(["1"]);
  });

  it("debería devolver 502 si ocurre un error en getAlbumsDetailsByIds", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (getAlbumsDetailsByIds as jest.Mock).mockRejectedValueOnce(
      new Error("Spotify no disponible")
    );

    const req = buildRequest(
      "http://localhost/api/spotify/albums/details?ids=123"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toBe("SPOTIFY_REQUEST_FAILED");
    expect(data.detail).toMatch(/Spotify/);

    consoleSpy.mockRestore();
  });
});
