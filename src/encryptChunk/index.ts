import { getCrypto } from "../utils/getCrypto";
import { hasWindow } from "../utils/hasWindow";

const crypto = getCrypto();

export const encryptChunk = async (
  chunk: ArrayBuffer,
  iv: Uint8Array,
  key: CryptoKey
) => {
  return await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, chunk);
};
