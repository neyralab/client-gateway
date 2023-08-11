import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { sendChunk } from "./index";

const mockArrayBuffer = new ArrayBuffer(10);
const mockFile = {
  name: "test.txt",
  size: 1000,
  type: "text/plain",
  upload_id: "mock_upload_id",
  folderId: "mock_folder_id",
};

const mockUpdateProgressCallback = jest.fn();
const mockGetProgressFromLSCallback = jest.fn();
const mockSetProgressToLSCallback = jest.fn();

const mockDispatch = jest.fn();

const mockStartTime = 1234567890;
const mockOneTimeToken = "mock-one-time-token";
const mockEndpoint = "https://example.com";
const mockIv = new Uint8Array(16);
const mockClientsideKeySha3Hash = "mock-hash";
const mockAdapter = new MockAdapter(axios);

describe("Test sendChunk", () => {
  beforeEach(() => {
    mockAdapter.reset();
  });

  it("should successfully send a chunk", async () => {
    const mockResponse = { success: true };
    mockAdapter
      .onPost(`${mockEndpoint}/chunked/uploadChunk`)
      .reply(200, mockResponse);

    const { data: result } = await sendChunk(
      mockArrayBuffer,
      0,
      10,
      mockFile,
      mockStartTime,
      mockOneTimeToken,
      mockEndpoint,
      mockIv,
      mockClientsideKeySha3Hash,
      mockDispatch,
      mockUpdateProgressCallback,
      mockGetProgressFromLSCallback,
      mockSetProgressToLSCallback
    );

    expect(result).toEqual(mockResponse);
  });
  it("should throw an error", async () => {
    mockAdapter
      .onPost(`${mockEndpoint}/chunked/uploadChunk`)
      .reply(500, "Internal Server Error");

    try {
      await sendChunk(
        mockArrayBuffer,
        0,
        10,
        mockFile,
        mockStartTime,
        mockOneTimeToken,
        mockEndpoint,
        mockIv,
        mockClientsideKeySha3Hash,
        mockDispatch,
        mockUpdateProgressCallback,
        mockGetProgressFromLSCallback,
        mockSetProgressToLSCallback
      );
    } catch (error) {
      expect(error.message).toEqual("HTTP error! status:500");
    }
  });
});
