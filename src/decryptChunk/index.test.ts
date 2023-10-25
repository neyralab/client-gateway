import * as Base64 from "base64-js";

import { getCrypto } from "../utils/getCrypto";

import { decryptChunk } from "./index";
import { encryptChunk } from "../encryptChunk";

const crypto = getCrypto();

describe("decryptChunk", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should decrypt already encrypted chunk successfully", async () => {
    const mockChunk = new ArrayBuffer(16);
    const mockIv = crypto.getRandomValues(new Uint8Array(12));

    const mockKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    const encryptedChunk = await encryptChunk({
      chunk: mockChunk,
      iv: mockIv,
      key: mockKey,
    });

    const bufferKey = await crypto.subtle.exportKey("raw", mockKey);
    const base64iv = Base64.fromByteArray(mockIv);

    const decryptedChunk = await decryptChunk({
      chunk: encryptedChunk,
      iv: base64iv,
      key: bufferKey,
    });

    expect(decryptedChunk).toEqual(mockChunk);
  });
  it(
    "should make 6 retries and fail decryption if chunk was not encrypted before",
    async () => {
      const mockChunk = new ArrayBuffer(16);
      const mockIv = crypto.getRandomValues(new Uint8Array(12));
      const mockKey = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt"]
      );

      const bufferKey = await crypto.subtle.exportKey("raw", mockKey);
      const base64iv = Base64.fromByteArray(mockIv);

      const errorResult = await decryptChunk({
        chunk: mockChunk,
        iv: base64iv,
        key: bufferKey,
      });

      expect(errorResult.failed).toBe(true);
    },
    20000 + 5000
  );
});
