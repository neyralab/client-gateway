import { downloadFile } from "./index";
import { countChunks, downloadChunk } from "../index";
import { joinChunks } from "../utils/joinChunks";

jest.mock("../index");
jest.mock("../utils/joinChunks");

const abortController = new AbortController();
const mockOneTimeToken = "mock-one-time-token";
const mockEndpoint = "https://example.com";
const mockFile = { slug: "mock-slug" };
const mockSignal = abortController.signal;

const chunk = new ArrayBuffer(5);
const chunks = [chunk, chunk, chunk];

const expectedResult = new Blob(chunks);

describe("downloadFile", () => {
  it("should download and join chunks", async () => {
    //@ts-ignore
    countChunks.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ count: 3, end: 3072 }),
    });
    //@ts-ignore
    downloadChunk.mockImplementation(async () => {
      return Promise.resolve(chunk);
    });
    //@ts-ignore
    joinChunks.mockImplementation(async () => {
      return expectedResult;
    });
    const result = await downloadFile(
      mockFile,
      mockOneTimeToken,
      mockSignal,
      mockEndpoint
    );
    expect(countChunks).toHaveBeenCalledTimes(1);
    expect(downloadChunk).toHaveBeenCalledTimes(3);
    expect(result).toEqual(expectedResult);
  });
});
