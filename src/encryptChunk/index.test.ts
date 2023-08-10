import { encryptChunk } from "../encryptChunk";
import { Crypto } from "@peculiar/webcrypto";

const crypto = !window || !window.crypto?.subtle ? new Crypto() : window.crypto;

describe("encryptChunk", () => {
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
});
