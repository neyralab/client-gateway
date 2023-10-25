import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { uploadFile } from "./index";

import { LocalFileBuffer } from "../types/File";

const mockAdapter = new MockAdapter(axios);

const file = new LocalFileBuffer(
  1000,
  "text.txt",
  "text/plain",
  "mock_folder_id",
  "mock_upload_id",
  async () => new ArrayBuffer(16)
);

const progress = 0;
const totalSize = file.size;

const oneTimeToken = "mock-one-time-token";
const endpoint = "https://example.com";
const callback = jest.fn();
const handlers = ["onProgress"];

describe("Test uploadFile", () => {
  beforeEach(() => {
    mockAdapter.reset();
    jest.clearAllMocks();
  });
  it("uploading a file successfully", async () => {
    const mockResponse = { data: { slug: "mock-slug" } };

    mockAdapter
      .onPost(`${endpoint}/chunked/uploadChunk`)
      .reply(200, mockResponse);

    const result = await uploadFile({
      file,
      oneTimeToken,
      endpoint,
      callback,
      handlers,
      progress,
      totalSize,
    });

    expect(result.data.data.slug).toBe(mockResponse.data.slug);
  });
  it("uploading a file failed", async () => {
    const mockResponse = { failed: true };

    mockAdapter
      .onPost(`${endpoint}/chunked/uploadChunk`)
      .reply(500, mockResponse);

    const result = await uploadFile({
      file,
      oneTimeToken,
      endpoint,
      callback,
      handlers,
      progress,
      totalSize,
    });

    expect(result.failed).toBe(true);
  });
});
