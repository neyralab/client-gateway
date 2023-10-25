import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { sendChunk } from "./index";
import { LocalFileBuffer } from "../types/File";

const mockAdapter = new MockAdapter(axios);

const chunk = new ArrayBuffer(10);
const file = new LocalFileBuffer(
  1000,
  "text.txt",
  "text/plain",
  "mock_folder_id",
  "mock_upload_id",
  async () => new ArrayBuffer(16)
);
const startTime = new Date();
const oneTimeToken = "mock-one-time-token";
const endpoint = "https://example.com";
const iv = new Uint8Array(16);
const clientsideKeySha3Hash = "mock-hash";
const totalProgress = { number: 0 };
const callback = jest.fn();
const handlers = ["onProgress"];
const controller = new AbortController();

describe("Test sendChunk", () => {
  beforeEach(() => {
    mockAdapter.reset();
  });

  it("should successfully send a chunk", async () => {
    const mockResponse = { success: true };
    mockAdapter
      .onPost(`${endpoint}/chunked/uploadChunk`)
      .reply(200, mockResponse);

    const { data: result } = await sendChunk({
      chunk,
      index: 0,
      file,
      startTime,
      oneTimeToken,
      endpoint,
      iv,
      clientsideKeySha3Hash,
      totalProgress,
      callback,
      handlers,
      controller,
      totalSize: 1000,
    });

    expect(result).toEqual(mockResponse);
  });
  it("should throw an error", async () => {
    mockAdapter
      .onPost(`${endpoint}/chunked/uploadChunk`)
      .reply(500, "Internal Server Error");

    try {
      await sendChunk({
        chunk,
        index: 0,
        file,
        startTime,
        oneTimeToken,
        endpoint,
        iv,
        clientsideKeySha3Hash,
        totalProgress,
        callback,
        handlers,
        controller,
        totalSize: 1000,
      });
    } catch (error) {
      expect(error.message).toEqual("HTTP error! status:500");
    }
  });
});
