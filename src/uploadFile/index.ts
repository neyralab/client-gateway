import * as forge from "node-forge";

import { sendChunk } from "../sendChunk";
import { encryptChunk } from "../encryptChunk";

import { chunkFile } from "../utils/chunkFile";
import { getCrypto } from "../utils/getCrypto";

import { IUploadFile } from "../types";

const fileControllers = {};
const cancelledFiles = new Set();

const cryptoLibrary = getCrypto();

export const uploadFile = async ({
  file,
  oneTimeToken,
  endpoint,
  callback,
  handlers,
  key,
  crypto,
}: IUploadFile) => {
  const startTime = Date.now();
  const controller = new AbortController();
  let clientsideKeySha3Hash: string | undefined;
  let iv: Uint8Array | undefined;

  let totalProgress = { number: 0 };
  let currentIndex = 1;
  let result: any;

  fileControllers[file.uploadId] = controller;

  if (cancelledFiles.has(file.uploadId)) {
    fileControllers[file.uploadId].abort();
    cancelledFiles.delete(file.uploadId);
  }

  if (key) {
    const fileKey = forge.random.getBytesSync(32); // 32 bytes for AES-256
    const md = forge.md.sha512.create();
    md.update(fileKey);
    clientsideKeySha3Hash = md.digest().toHex();
    iv = cryptoLibrary.getRandomValues(new Uint8Array(12));
  }

  for await (const chunk of chunkFile({ file })) {
    let finalChunk = chunk;

    if (key) {
      finalChunk = await encryptChunk({
        chunk,
        iv,
        key,
        crypto,
      });
    }

    result = await sendChunk({
      chunk: finalChunk,
      index: currentIndex,
      file,
      startTime,
      oneTimeToken,
      endpoint,
      iv,
      clientsideKeySha3Hash,
      totalProgress,
      callback,
      handlers,
      controller,
    });

    if (result?.failed) {
      delete fileControllers[file.uploadId];
      totalProgress.number = 0;
      return;
    }
    if (result?.data?.data?.slug) {
      delete fileControllers[file.uploadId];
      totalProgress.number = 0;
      return result;
    }
    currentIndex++;
  }
};

export const cancelingUpload = (uploadId) => {
  if (fileControllers[uploadId]) {
    fileControllers[uploadId].abort();
  } else cancelledFiles.add(uploadId);
};
