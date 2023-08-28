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
global.fetch = jest.fn();

describe("Test downloadChunk", () => {
  beforeEach(() => {
    // @ts-ignore
    fetch.mockClear();
  });
  it("should return chunk of the file", async () => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(mockData),
      })
    );
    const data = await downloadChunk(
      mockIndex,
      mockSha3_hash,
      mockSlug,
      mockOneTimeToken,
      mockSignal,
      mockEndpoint,
      true
    );

    expect(data).toEqual(mockData);
  });
  it("should return error", async () => {
    // @ts-ignore
    global.fetch = jest.fn(() => {
      throw new Error("Other Error");
    });

    try {
      const test = await downloadChunk(
        mockIndex,
        mockSha3_hash,
        mockSlug,
        mockOneTimeToken,
        mockSignal,
        mockEndpoint,
        false
      );
    } catch (error) {
      expect(error.message).toEqual("HTTP error! status: undefined");
    }
  });
});
