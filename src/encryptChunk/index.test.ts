import { encryptChunk } from "../encryptChunk";
import { getCrypto } from "../utils/getCrypto";

const crypto = getCrypto();

const chunk = new ArrayBuffer(10);
const iv = new Uint8Array(16);

describe("encryptChunk", () => {
  it("should encrypt a chunk", async () => {
    const key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt"]
    );

    const result = await encryptChunk({ chunk, iv, key });

    expect(result.byteLength).toBe(chunk.byteLength + 16);
  });
  it("should handle encryption error if key is not of type CryptoKey", async () => {
    const key = "mockKey";

    try {
      // @ts-ignore
      await encryptChunk({ chunk, iv, key });
    } catch (error) {
      expect(error.message).toBe("Key is not of type 'CryptoKey'");
    }
  });
});
