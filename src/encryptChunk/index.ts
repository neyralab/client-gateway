import { Crypto } from "@peculiar/webcrypto";

const crypto = typeof window !== "undefined" ? window.crypto : new Crypto();

export const encryptChunk = async (chunk: ArrayBuffer, iv: Uint8Array) => {
  return await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    window.key,
    chunk
  );
};
