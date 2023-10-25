import * as forge from "node-forge";
import { getCrypto } from "../utils/getCrypto";
import { encodeExistingFile } from "./index";
import { downloadFile, swapChunk, encryptChunk } from "../index";

jest.mock("../index");

const mockArrayBuffer = new ArrayBuffer(1024);

const mockFile = { slug: "mockSlug" };
const mockOneTimeToken = "1234567890";
const mockEndpoint = "https://example.com/api";
const mockDownloadToken = "9876543210";
const mockDownloadEndpoint = "https://example.com/download";
const mockCallback = jest.fn();
const mockHandlers = ["onStart", "onSuccess", "onError"];

const crypto = getCrypto();

describe("encodeExistingFile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should download the file and encrypt it in chunks", async () => {
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    // @ts-ignore
    downloadFile.mockResolvedValue({
      arrayBuffer: async () => mockArrayBuffer,
    });
    // @ts-ignore
    encryptChunk.mockResolvedValue(new ArrayBuffer(512));
    // @ts-ignore
    swapChunk.mockResolvedValue({
      data: {
        data: {
          slug: "my-slug",
        },
      },
    });

    await encodeExistingFile({
      file: mockFile,
      oneTimeToken: mockOneTimeToken,
      endpoint: mockEndpoint,
      downloadToken: mockDownloadToken,
      downloadEndpoint: mockDownloadEndpoint,
      callback: mockCallback,
      handlers: mockHandlers,
      key,
    });

    expect(downloadFile).toHaveBeenCalledWith({
      file: mockFile,
      oneTimeToken: mockDownloadToken,
      signal: expect.any(Object),
      endpoint: mockDownloadEndpoint,
      isEncrypted: false,
    });

    expect(encryptChunk).toHaveBeenCalledTimes(1);
    expect(swapChunk).toHaveBeenCalledTimes(1);
  });

  it("should call the callback with the response from IPFS on success", async () => {
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    const mockResponseFromIpfs = {
      data: {
        slug: "my-slug",
      },
    };
    // @ts-ignore
    downloadFile.mockResolvedValue({
      arrayBuffer: async () => mockArrayBuffer,
    });
    // @ts-ignore
    encryptChunk.mockResolvedValue(new ArrayBuffer(512));
    // @ts-ignore
    swapChunk.mockResolvedValue({
      data: mockResponseFromIpfs,
    });

    await encodeExistingFile({
      file: mockFile,
      oneTimeToken: mockOneTimeToken,
      endpoint: mockEndpoint,
      downloadToken: mockDownloadToken,
      downloadEndpoint: mockDownloadEndpoint,
      callback: mockCallback,
      handlers: mockHandlers,
      key,
    });

    expect(mockCallback).toHaveBeenCalledWith({
      type: "onSuccess",
      params: {
        isCancelModalOpen: expect.any(Object),
        response: mockResponseFromIpfs,
      },
    });
  });

  it("should call the callback with an error on failure", async () => {
    // @ts-ignore
    downloadFile.mockResolvedValue({
      arrayBuffer: async () => mockArrayBuffer,
    });
    // @ts-ignore
    encryptChunk.mockResolvedValue("Key is not of type CryptoKey");
    // @ts-ignore
    swapChunk.mockResolvedValue({
      failed: true,
    });

    await encodeExistingFile({
      file: mockFile,
      oneTimeToken: mockOneTimeToken,
      endpoint: mockEndpoint,
      downloadToken: mockDownloadToken,
      downloadEndpoint: mockDownloadEndpoint,
      callback: mockCallback,
      handlers: mockHandlers,
      //@ts-ignore
      key: "wrong key",
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      type: "onStart",
      params: {
        file: mockFile,
        size: 1024,
      },
    });
    expect(encryptChunk).toHaveBeenCalledTimes(1);
    expect(mockCallback).not.toHaveBeenCalledWith({
      type: "onSuccess",
      params: {
        isCancelModalOpen: expect.any(Object),
        response: {
          data: {
            slug: "my-slug",
          },
        },
      },
    });
  });
});
