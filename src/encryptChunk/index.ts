import { IEncryptChunk } from "../types";

export const encryptChunk = async ({
  chunk,
  iv,
  key,
  crypto,
}: IEncryptChunk) => {
  const cryptoLibrary = crypto ? crypto : window.crypto;
  return await cryptoLibrary.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    chunk
  );
};
