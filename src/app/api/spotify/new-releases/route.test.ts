import { GET } from "./route";
import { getSpotifyAccessToken } from "@/lib/spotify";

jest.mock("@/lib/spotify", () => ({
  getSpotifyAccessToken: jest.fn(),
}));

global.fetch = jest.fn();

describe("GET /api/spotify", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería retornar data correctamente cuando Spotify responde 200", async () => {
    (getSpotifyAccessToken as jest.Mock).mockResolvedValue("fake_token");

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ albums: { items: [{ id: 1, name: "Album 1" }] } }),
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.albums.items[0].name).toBe("Album 1");
    expect(getSpotifyAccessToken).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.spotify.com/v1/browse/new-releases?limit=10",
      expect.objectContaining({
        headers: { Authorization: "Bearer fake_token" },
      })
    );
  });

  it("debería manejar errores de respuesta de Spotify", async () => {
    (getSpotifyAccessToken as jest.Mock).mockResolvedValue("fake_token");

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Error desde Spotify");
    expect(data.detail).toBe("Bad Request");
  });

  it("debería manejar excepciones en el try/catch", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})

    ;(getSpotifyAccessToken as jest.Mock).mockRejectedValue(new Error("Token error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Fallo en el servidor al consultar Spotify");
    expect(data.detail).toBe("Token error");

    consoleSpy.mockRestore();
  });
});
