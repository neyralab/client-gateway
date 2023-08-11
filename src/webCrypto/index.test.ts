import { AxiosResponse } from "axios";
import { WebCrypto } from "./index";
import { countChunks, downloadChunk, sendChunk } from "../index";
import { joinChunks } from "../utils/joinChunks";

jest.mock("../index");
jest.mock("../utils/joinChunks");

jest.mock("../chunkFile", () => ({
  chunkFile: jest.fn(() => [new ArrayBuffer(8)]),
}));
jest.mock("../sendChunk", () => ({
  sendChunk: jest.fn().mockResolvedValue({ isCliensideEncrypted: true }),
}));
jest.mock("../swapChunk", () => ({
  sendChunk: jest.fn().mockResolvedValue({ isCliensideEncrypted: true }),
}));

const mockFile = {
  name: "mockFile.txt",
  size: 1024,
  type: "text/plain",
  mime: "text/plain",
  arrayBuffer: jest.fn(),
  slug: "mock-slug",
  entry_clientside_key: {
    sha3_hash: "mock-sha3_hash",
    iv: "mock-iv",
    clientsideKeySha3Hash: "mock-clientsideKeySha3Hash",
  },
};
const abortController = new AbortController();
const mockSignal = abortController.signal;
const mockActivationKey = "7DXSM/5esCF6PEzS3ruPr2THiLqznyel7gUQmhpjlZY=";
const chunk = new ArrayBuffer(5);
const chunks = [chunk, chunk, chunk];
const mockOneTimeToken = "mockOneTimeToken";
const mockStartTime = new Date();
const mockEndpoint = "https://example.com/api";
const mockData = new Uint8Array([0x41, 0x42, 0x43, 0x44]).buffer;

const expectedResult = new Blob(chunks);
const mockDispatch = jest.fn();
const mockKeysByWorkspace = jest.fn(
  () => ({ data: { keys: [] } } as AxiosResponse)
);
const mockUpdateProgressCallback = jest.fn();
const mockGetProgressFromLSCallback = jest.fn();
const mockSetProgressToLSCallback = jest.fn();
const mockSaveEncryptedFileKeys = jest.fn();
const mockGetOneTimeToken = jest.fn().mockResolvedValue({
  data: {
    user_token: { token: "mockToken" },
    endpoint: "https://example.com/endpoint",
  },
});
const mockGetFileContent = jest.fn().mockResolvedValue(
  Promise.resolve({
    ok: true,
    arrayBuffer: () => Promise.resolve(mockData),
  })
);
const mockFirstEncodeExistingCallback = jest.fn();
const mockSecondEncodeExistingCallback = jest.fn();
const mockThirdEncodeExistingCallback = jest.fn();
const mockImagePreviewEffect = jest.fn().mockResolvedValue("base64Thumbnail");

describe("WebCrypto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("encodeFile: should encode a file successfully", async () => {
    const webCrypto = new WebCrypto();

    const result = await webCrypto.encodeFile(
      mockFile,
      mockOneTimeToken,
      mockDispatch,
      mockStartTime,
      mockEndpoint,
      mockKeysByWorkspace,
      mockUpdateProgressCallback,
      mockGetProgressFromLSCallback,
      mockSetProgressToLSCallback,
      mockSaveEncryptedFileKeys,
      mockGetOneTimeToken
    );
    expect(result.isCliensideEncrypted).toBe(true);
  });
  it("encodeFile: should fail to encode a file", async () => {
    (sendChunk as jest.Mock).mockRejectedValue({
      failed: true,
    });

    const webCrypto = new WebCrypto();
    try {
      await webCrypto.encodeFile(
        mockFile,
        mockOneTimeToken,
        mockDispatch,
        mockStartTime,
        mockEndpoint,
        mockKeysByWorkspace,
        mockUpdateProgressCallback,
        mockGetProgressFromLSCallback,
        mockSetProgressToLSCallback,
        mockSaveEncryptedFileKeys,
        mockGetOneTimeToken
      );
    } catch (error) {
      expect(error.failed).toBe(true);
    }
  });
  it("downloadFile: should download and join chunks", async () => {
    const webCrypto = new WebCrypto();
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
    const result = await webCrypto.downloadFile(
      mockFile,
      mockOneTimeToken,
      mockActivationKey,
      mockSignal,
      mockEndpoint
    );
    expect(countChunks).toHaveBeenCalledTimes(1);
    expect(downloadChunk).toHaveBeenCalledTimes(3);
    expect(result).toEqual(expectedResult);
  });
  it("downloadFile: should throw an error if chunkCountResponse is not okay", async () => {
    const webCrypto = new WebCrypto();
    //@ts-ignore
    countChunks.mockResolvedValue({
      ok: false,
      status: 404,
    });

    try {
      await webCrypto.downloadFile(
        mockFile,
        mockOneTimeToken,
        mockActivationKey,
        mockSignal,
        mockEndpoint
      );
    } catch (error) {
      expect(error.message).toEqual("HTTP error! status:404");
    }
  });
  it("encodeExistingFile: should swap a file successfully", async () => {
    const webCrypto = new WebCrypto();

    await webCrypto.encodeExistingFile(
      mockFile,
      mockDispatch,
      mockGetFileContent,
      mockFirstEncodeExistingCallback,
      mockSecondEncodeExistingCallback,
      mockThirdEncodeExistingCallback,
      mockImagePreviewEffect,
      mockKeysByWorkspace,
      mockUpdateProgressCallback,
      mockGetProgressFromLSCallback,
      mockSetProgressToLSCallback,
      mockSaveEncryptedFileKeys,
      mockGetOneTimeToken
    );

    expect(mockGetFileContent).toBeCalled();
    expect(mockGetFileContent).toBeCalledTimes(1);
    expect(mockSecondEncodeExistingCallback).toHaveBeenCalledWith(
      mockFile.slug,
      mockDispatch
    );
  });
  it("encodeExistingFile: should handle swapChunk error without one time token", async () => {
    const webCrypto = new WebCrypto();
    const mockGetOneTimeTokenError = jest.fn().mockResolvedValue({
      data: undefined,
    });
    try {
      await webCrypto.encodeExistingFile(
        mockFile,
        mockDispatch,
        mockGetFileContent,
        mockFirstEncodeExistingCallback,
        mockSecondEncodeExistingCallback,
        mockThirdEncodeExistingCallback,
        mockImagePreviewEffect,
        mockKeysByWorkspace,
        mockUpdateProgressCallback,
        mockGetProgressFromLSCallback,
        mockSetProgressToLSCallback,
        mockSaveEncryptedFileKeys,
        mockGetOneTimeTokenError
      );
    } catch (error) {
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(error.message).toBe(
        "Cannot read properties of undefined (reading 'user_token')"
      );
    }
  });
});
