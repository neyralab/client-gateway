import { encryptChunk } from "../encryptChunk";
import { getCrypto } from "../utils/getCrypto";

const crypto = getCrypto();

describe("encryptChunk", () => {
  beforeEach(() => {
    // @ts-ignore
    window.key = undefined;
  });
  it("should encrypt a chunk", async () => {
    const mockKey = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    // @ts-ignore
    window.key = mockKey;

    const mockChunk = new ArrayBuffer(10);
    const mockIv = new Uint8Array(16);
    const result = await encryptChunk(mockChunk, mockIv);

    expect(result.byteLength).toBe(mockChunk.byteLength + 16);
  });
  it("should handle encryption error if window.key is not set", async () => {
    const mockChunk = new ArrayBuffer(10);
    const mockIv = new Uint8Array(16);

    try {
      await encryptChunk(mockChunk, mockIv);
    } catch (error) {
      expect(error.message).toBe("Key is not of type 'CryptoKey'");
    }
  });
});
