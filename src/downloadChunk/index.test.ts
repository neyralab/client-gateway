import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { downloadChunk } from "./index";

const mockAdapter = new MockAdapter(axios);
const abortController = new AbortController();

const index = 1;
const sha3_hash = "hash123";
const oneTimeToken = "token123";
const signal = abortController.signal;
const endpoint = "https://example.com";
const file = { slug: "some-slug", size: 1024 };
const startTime = Date.now();
const totalProgress = { number: 0 };
const callback = jest.fn();
const handlers = ["onProgress"];

const mockResponseData = new ArrayBuffer(1024);
const customError = new Error("Internal Server Error");

describe("Test downloadChunk", () => {
  afterEach(() => {
    mockAdapter.reset();
  });
  it("should return chunk of the file", async () => {
    mockAdapter
      .onGet(`${endpoint}/chunked/downloadChunk/some-slug`)
      .reply(200, mockResponseData);

    const result = await downloadChunk({
      index,
      sha3_hash,
      oneTimeToken,
      signal,
      endpoint,
      file,
      startTime,
      totalProgress,
      callback,
      handlers,
    });

    expect(result).toEqual(mockResponseData);
  });

  it("should simulate a failed download", async () => {
    mockAdapter
      .onGet(`${endpoint}/chunked/downloadChunk/some-slug`)
      .reply(500, customError);
    let result;
    try {
      result = await downloadChunk({
        index,
        sha3_hash,
        oneTimeToken,
        signal,
        endpoint,
        file,
        startTime,
        totalProgress,
        callback,
        handlers,
      });
    } catch (error) {
      expect(error.message).toEqual("HTTP error! status: undefined");
    }
  });
});
