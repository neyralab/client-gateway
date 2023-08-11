import { Crypto } from "@peculiar/webcrypto";

import { convertBase64ToArrayBuffer } from "../utils/convertBase64ToArrayBuffer";
import { getFibonacciNumber } from "../utils/getFibonacciNumber";
import { getCrypto } from "../utils/getCrypto";

import { MAX_DECRYPTION_TRIES } from "../config";

const crypto = getCrypto();

export const decryptChunk = async (
  chunk: ArrayBuffer,
  iv: string,
  activationKey: string
) => {
  const decodeKey = convertBase64ToArrayBuffer(activationKey);
  const key = await crypto.subtle.importKey(
    "raw",
    decodeKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

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
        key,
        chunk
      );
      if (currentTry > 1) {
        currentTry = 1;
      }
      return response;
    } catch (error: any) {
      console.error("ERROR", error);
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
