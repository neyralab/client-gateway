import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { countChunks } from "./index";

const mockAdapter = new MockAdapter(axios);
const controller = new AbortController();
const signal = controller.signal;
const endpoint = "https://example.com";
const oneTimeToken = "mockToken";
const slug = "mockSlug";

const mockResponseData = { count: 1, end: 1024 };

describe("Test countChunks", () => {
  afterEach(() => {
    mockAdapter.reset();
  });
  it("should return quantity of chunks and size of the file", async () => {
    mockAdapter
      .onGet(`${endpoint}/chunked/chunkCount`)
      .reply(200, mockResponseData);

    const response = await countChunks({
      endpoint,
      oneTimeToken,
      slug,
      signal,
    });
    expect(response.data).toEqual(mockResponseData);
  });

  it("should return failed status if other error", async () => {
    mockAdapter.onGet(endpoint).reply(500, { error: "Other Error" });
    let rawData;
    try {
      rawData = await countChunks({
        endpoint,
        oneTimeToken,
        slug,
        signal,
      });
    } catch (error) {
      expect(rawData.failed).toEqual(true);
      expect(error.message).toBe("Other Error");
    }
  });
});
