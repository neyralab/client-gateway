import { getCrypto } from "../utils/getCrypto";

import { IEncryptChunk } from "../types";

const crypto = getCrypto();

export const encryptChunk = async ({ chunk, iv, key }: IEncryptChunk) => {
  return await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, chunk);
};
