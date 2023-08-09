import { downloadChunk } from "./index";
import fetchMock from "jest-fetch-mock";

// @ts-ignore
global.fetch = fetchMock;
const abortController = new AbortController();

const mockIndex = 0;
const mockSha3_hash = "sha3_hash";
const mockSlug = "slug";
const mockOneTimeToken = "oneTimeToken";
const mockSignal = abortController.signal;
const mockEndpoint = "https://example.com";

const expectedResponse = new ArrayBuffer(10);

describe("Test downloadChunk", () => {
  it("should return chunk of the file", async () => {
    const mockResponse = { ok: true, data: expectedResponse, status: 200 };
    // @ts-ignore
    fetch.mockResponseOnce(mockResponse);
    const data = await downloadChunk(
      mockIndex,
      mockSha3_hash,
      mockSlug,
      mockOneTimeToken,
      mockSignal,
      mockEndpoint
    );
    expect(data).toEqual(expectedResponse);
  });
});
