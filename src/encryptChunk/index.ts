import { getCrypto } from "../utils/getCrypto.js";

import { IEncryptChunk } from "../types/index.js";

const crypto = getCrypto();

export const encryptChunk = async ({ chunk, iv, key }: IEncryptChunk) => {
  return await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, chunk);
};
