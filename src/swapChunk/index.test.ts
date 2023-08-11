import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { swapChunk } from "./index";

describe("Test swapChunk", () => {
  const mockArrayBuffer = new ArrayBuffer(10);
  const mockEncryptedChunk = new ArrayBuffer(10);
  const mockCancelToken = {
    promise: new Promise(() => {}),
    throwIfRequested: () => {},
  };
  const mockFile = {
    slug: "mock-slug",
    upload_id: "mock_upload_id",
    source: { token: mockCancelToken },
  };

  const mockUpdateProgressCallback = jest.fn();
  const mockGetProgressFromLSCallback = jest.fn();
  const mockSetProgressToLSCallback = jest.fn();

  const mockDispatch = jest.fn();

  const mockStartTime = 1234567890;
  const mockOneTimeToken = "mock-one-time-token";
  const mockEndpoint = "https://example.com";
  const mockIv = "base64iv";
  const mockClientsideKeySha3Hash = "mock-hash";

  it("should successfully swap a chunk", async () => {
    const mockResponse = { success: true };

    const mockAdapter = new MockAdapter(axios);

    mockAdapter
      .onPost(`${mockEndpoint}/chunked/swap/${mockFile.slug}`)
      .reply(200, mockResponse);

    const { data: result } = await swapChunk(
      mockFile,
      mockEndpoint,
      mockIv,
      mockClientsideKeySha3Hash,
      0,
      10,
      mockOneTimeToken,
      mockEncryptedChunk,
      mockArrayBuffer,
      mockStartTime,
      mockDispatch,
      mockUpdateProgressCallback,
      mockGetProgressFromLSCallback,
      mockSetProgressToLSCallback
    );

    expect(result).toEqual(mockResponse);
  });
  it("should throw an error", async () => {
    const mockAdapter = new MockAdapter(axios);
    mockAdapter
      .onPost(`${mockEndpoint}/chunked/swap/${mockFile.slug}`)
      .reply(500, "Internal Server Error");

    try {
      await swapChunk(
        mockFile,
        mockEndpoint,
        mockIv,
        mockClientsideKeySha3Hash,
        0,
        10,
        mockOneTimeToken,
        mockEncryptedChunk,
        mockArrayBuffer,
        mockStartTime,
        mockDispatch,
        mockUpdateProgressCallback,
        mockGetProgressFromLSCallback,
        mockSetProgressToLSCallback
      );
    } catch (error) {
      expect(error.message).toEqual("Request failed with status code 500");
    }
  });
});
