import { convertBase64ToArrayBuffer } from "../utils/convertBase64ToArrayBuffer.js";
import { getFibonacciNumber } from "../utils/getFibonacciNumber.js";
import { getCrypto } from "../utils/getCrypto.js";

import { MAX_DECRYPTION_TRIES } from "../config.js";

import { IDecryptChunk } from "../types/index.js";
import { convertArrayBufferToBase64 } from "../utils/convertArrayBufferToBase64.js";

const crypto = getCrypto();

export const decryptChunk = async ({ chunk, iv, key }: IDecryptChunk) => {
  const activationKey = await crypto.subtle.importKey(
    "raw",
    key,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
  console.log({
    iv,
    chunk: convertArrayBufferToBase64(chunk),
    key: convertArrayBufferToBase64(key),
  })
  const ivBufferSource = convertBase64ToArrayBuffer(iv);
  const normalizedIv = new Uint8Array(ivBufferSource);
  let currentTry = 1;

  const decrypt: () => Promise<any> = async () => {
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000
      );
    });

    try {
      const response = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: normalizedIv,
        },
        activationKey,
        chunk
      );
      if (currentTry > 1) {
        currentTry = 1;
      }
      return response;
    } catch (error: any) {
      if (currentTry >= MAX_DECRYPTION_TRIES) {
        currentTry = 1;
        return { failed: true };
      }
      currentTry++;
      return decrypt();
    }
  };

  return await decrypt();
};
