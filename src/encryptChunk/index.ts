import { IEncryptChunk } from "../types";
import { getCrypto } from "../utils/getCrypto";

const crypto = getCrypto();

export const encryptChunk = async ({ chunk, iv, key }: IEncryptChunk) => {
  return await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, chunk);
};
