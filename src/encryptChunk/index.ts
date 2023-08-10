import { Crypto } from "@peculiar/webcrypto";

const crypto = !window || !window.crypto?.subtle ? new Crypto() : window.crypto;

export const encryptChunk = async (chunk: ArrayBuffer, iv: Uint8Array) => {
  return await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    window.key,
    chunk
  );
};
