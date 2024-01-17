import * as forge from 'node-forge';

import { sendChunk } from '../sendChunk';
import { encryptChunk } from '../encryptChunk';

import { chunkFile } from '../utils/chunkFile';
import { getCrypto } from '../utils/getCrypto';

import { IUploadFile } from '../types';

const fileControllers = {};
const cancelledFiles = new Set();

const crypto = getCrypto();

export const uploadFile = async ({
  file,
  oneTimeToken,
  gateway,
  callback,
  handlers,
  key,
  progress,
  totalSize,
  startedAt,
}: IUploadFile) => {
  const startTime = startedAt || Date.now();
  const controller = new AbortController();
  let clientsideKeySha3Hash: string | undefined;
  let iv: Uint8Array | undefined;

  let totalProgress = { number: progress || 0 };
  let currentIndex = 1;
  const promises = [];

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
    iv = crypto.getRandomValues(new Uint8Array(12));
  }

  for await (const chunk of chunkFile({
    file,
    uploadChunkSize: gateway.upload_chunk_size,
  })) {
    let finalChunk = chunk;

    if (key) {
      finalChunk = await encryptChunk({
        chunk,
        iv,
        key,
      });
    }

    const promise = sendChunk({
      chunk: finalChunk,
      index: currentIndex,
      file,
      startTime,
      oneTimeToken,
      gateway,
      iv,
      clientsideKeySha3Hash,
      totalProgress,
      callback,
      handlers,
      controller,
      totalSize,
    });

    promises.push(promise);

    if (promises.length === 4) {
      await Promise.all(promises);
      promises.length = 0;
    }

    currentIndex++;
  }

  const results = await Promise.all(promises);

  for (const result of results) {
    if (result?.failed || result?.data?.data?.slug) {
      delete fileControllers[file.uploadId];
      totalProgress.number = 0;
      return result;
    }
  }
};

export const cancelingUpload = (uploadId) => {
  if (fileControllers[uploadId]) {
    fileControllers[uploadId].abort();
  } else cancelledFiles.add(uploadId);
};
