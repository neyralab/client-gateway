import { countChunks } from "./index";

const abortController = new AbortController();
const mockEndpoint = "https://example.com";
const mockOneTimeToken = "mockToken";
const mockSlug = "mockSlug";
const mockSignal = abortController.signal;

const result = { count: 1, end: 1024 };
// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ result }),
  })
);

describe("Test countChunks", () => {
  beforeEach(() => {
    // @ts-ignore
    fetch.mockClear();
  });
  it("should return quantity of chunks and size of the file", async () => {
    const rawData = await countChunks(
      mockEndpoint,
      mockOneTimeToken,
      mockSlug,
      mockSignal
    );
    const data = await rawData.json();

    expect(data.result).toEqual({ count: 1, end: 1024 });
  });
});
