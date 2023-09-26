import * as forge from "node-forge";
import * as Base64 from "base64-js";

import { downloadFile, encryptChunk, swapChunk } from "../index";

import { getCrypto } from "../utils/getCrypto";
import { chunkBuffer } from "../utils/chunkBuffer";

import { IEncodeExistingFile } from "../types";

const crypto = getCrypto();

const fileKey = forge.random.getBytesSync(32); // 32 bytes for AES-256
const md = forge.md.sha512.create();
md.update(fileKey);

export const encodeExistingFile = async ({
  file,
  getOneTimeToken,
  getDownloadOTT,
  callback,
  handlers,
  key,
}: IEncodeExistingFile) => {
  const clientsideKeySha3Hash: string = md.digest().toHex();
  const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));
  const startTime = Date.now();
  const base64iv = Base64.fromByteArray(iv);
  const totalProgress = { number: 0 };
  const controller = new AbortController();
  const { signal } = controller;

  let result: any;
  let currentIndex = 1;

  const {
    data: {
      user_tokens: { token: downloadToken },
      endpoint: downloadEndpoint,
    },
  } = await getDownloadOTT([{ slug: file.slug }]);

  const fileBlob: Blob = await downloadFile({
    file,
    oneTimeToken: downloadToken,
    signal,
    endpoint: downloadEndpoint,
    isEncrypted: false,
  });

  const arrayBuffer = await fileBlob.arrayBuffer();

  handlers.includes("onStart") &&
    callback({
      type: "onStart",
      params: { file, size: arrayBuffer.byteLength },
    });

  const {
    data: {
      user_token: { token: oneTimeToken },
      endpoint,
    },
  } = await getOneTimeToken({ filename: file.name, filesize: file.size });

  try {
    for await (const chunk of chunkBuffer({ arrayBuffer })) {
      const encryptedChunk = await encryptChunk({ chunk, iv, key });

      result = await swapChunk({
        file,
        endpoint,
        base64iv,
        clientsideKeySha3Hash,
        index: currentIndex,
        oneTimeToken,
        encryptedChunk,
        fileSize: arrayBuffer.byteLength,
        startTime,
        totalProgress,
        callback,
        handlers,
      });

      if (result?.data?.data?.slug) {
        totalProgress.number = 0;
        const { data: responseFromIpfs } = result;
        if (responseFromIpfs) {
          const isCancelModalOpen = document.body.querySelector(
            ".download__modal__button__cancel"
          );
          handlers.includes("onSuccess") &&
            callback({
              type: "onSuccess",
              params: { isCancelModalOpen, response: responseFromIpfs },
            });
          return responseFromIpfs;
        }
      }
      currentIndex++;
    }
  } catch (e) {
    handlers.includes("onError") &&
      callback({ type: "onError", params: { slug: file.slug } });
    return;
  }
};
