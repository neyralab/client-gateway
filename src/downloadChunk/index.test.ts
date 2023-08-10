import { downloadChunk } from "./index";

const abortController = new AbortController();

const mockIndex = 0;
const mockSha3_hash = "sha3_hash";
const mockSlug = "slug";
const mockOneTimeToken = "oneTimeToken";
const mockSignal = abortController.signal;
const mockEndpoint = "https://example.com";

const mockData = new Uint8Array([0x41, 0x42, 0x43, 0x44]).buffer;
// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    arrayBuffer: () => Promise.resolve(mockData),
  })
);

describe("Test downloadChunk", () => {
  beforeEach(() => {
    // @ts-ignore
    fetch.mockClear();
  });
  it("should return chunk of the file", async () => {
    const data = await downloadChunk(
      mockIndex,
      mockSha3_hash,
      mockSlug,
      mockOneTimeToken,
      mockSignal,
      mockEndpoint
    );

    expect(data).toEqual(mockData);
  });
});
