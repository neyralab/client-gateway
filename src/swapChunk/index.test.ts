import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { swapChunk } from "./index";

describe("Test swapChunk", () => {
  const encryptedChunk = new ArrayBuffer(10);
  const mockCancelToken = {
    promise: new Promise(() => {}),
    throwIfRequested: () => {},
  };
  const file = {
    slug: "mock-slug",
    upload_id: "mock_upload_id",
    source: { token: mockCancelToken },
    size: 10000,
  };

  const startTime = 1234567890;
  const oneTimeToken = "mock-one-time-token";
  const endpoint = "https://example.com";
  const base64iv = "base64iv";
  const clientsideKeySha3Hash = "mock-hash";
  const totalProgress = { number: 0 };
  const callback = jest.fn();
  const handlers = ["onProgress"];

  it("should successfully swap a chunk", async () => {
    const mockResponse = { success: true };

    const mockAdapter = new MockAdapter(axios);

    mockAdapter
      .onPost(`${endpoint}/chunked/swap/${file.slug}`)
      .reply(200, mockResponse);

    const { data: result } = await swapChunk({
      file,
      endpoint,
      base64iv,
      clientsideKeySha3Hash,
      index: 0,
      oneTimeToken,
      encryptedChunk,
      fileSize: file.size,
      startTime,
      totalProgress,
      callback,
      handlers,
    });

    expect(result).toEqual(mockResponse);
  });
  it("should throw an error", async () => {
    const mockAdapter = new MockAdapter(axios);
    mockAdapter
      .onPost(`${endpoint}/chunked/swap/${file.slug}`)
      .reply(500, "Internal Server Error");

    try {
      await swapChunk({
        file,
        endpoint,
        base64iv,
        clientsideKeySha3Hash,
        index: 0,
        oneTimeToken,
        encryptedChunk,
        fileSize: file.size,
        startTime,
        totalProgress,
        callback,
        handlers,
      });
    } catch (error) {
      expect(error.message).toEqual("Request failed with status code 500");
    }
  });
});
