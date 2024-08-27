import * as forge from 'node-forge';
// @ts-ignore
const nodeForge = forge.default !== undefined ? forge.default : forge;
import { sendChunk } from '../sendChunk/index.js';
import { encryptChunk } from '../encryptChunk/index.js';

import { chunkFile } from '../utils/chunkFile.js';
import { getCrypto } from '../utils/getCrypto.js';

import { IUploadFile } from '../types/index.js';
import { LocalFileReactNativeStream } from '../types/File/index.js';

const fileControllers = {};
const cancelledFiles = new Set();

const MAX_PROMISES_LENGTH = 4;

const crypto = getCrypto();

export const uploadFile = async ({
  file,
  oneTimeToken,
  jwtOneTimeToken,
  gateway,
  callback,
  handlers,
  key,
  progress,
  totalSize,
  startedAt,
  is_telegram,
}: IUploadFile) => {
  const startTime = startedAt || Date.now();
  const controller = new AbortController();
  let clientsideKeySha3Hash: string | undefined;
  let iv: Uint8Array | undefined;

  let totalProgress = { number: progress || 0 };
  let currentIndex = 1;
  const fileSize = file instanceof LocalFileReactNativeStream ? file.convertedSize || file.size : file.size;
  const lastChunkIndex = Math.ceil(fileSize / gateway.upload_chunk_size);
  let leftChunks = lastChunkIndex;
  const restMaxPromisesLength = (lastChunkIndex - 2) % MAX_PROMISES_LENGTH;
  const promises = [];

  fileControllers[file.uploadId] = controller;

  if (cancelledFiles.has(file.uploadId)) {
    fileControllers[file.uploadId].abort();
    cancelledFiles.delete(file.uploadId);
  }

  if (key) {
    const fileKey = nodeForge.random.getBytesSync(32); // 32 bytes for AES-256
    const md = nodeForge.md.sha512.create();
    md.update(fileKey);
    clientsideKeySha3Hash = md.digest().toHex();
    iv = crypto.getRandomValues(new Uint8Array(12));
  }

  for await (const chunk of chunkFile({
    file,
    uploadChunkSize: gateway.upload_chunk_size,
  })) {
    const allowedPromisesLength =
      leftChunks > 4 ? MAX_PROMISES_LENGTH : restMaxPromisesLength;
    let finalChunk = chunk;

    if (key) {
      const chunkArrayBuffer =
        typeof chunk === 'string' ? Buffer.from(chunk).buffer : chunk;
      finalChunk = await encryptChunk({
        chunk: chunkArrayBuffer,
        iv,
        key,
      });

      const encryptionProgress = Math.round(
        (currentIndex / lastChunkIndex) * 100
      );
      handlers.includes('onEncryptProgress') &&
        callback({
          type: 'onEncryptProgress',
          params: {
            fileId: file.uploadId,
            chunk: currentIndex,
            progress: encryptionProgress,
          },
        });
    }

    const promise = sendChunk({
      chunk: finalChunk,
      index: currentIndex,
      file,
      startTime,
      oneTimeToken,
      jwtOneTimeToken,
      gateway,
      iv,
      clientsideKeySha3Hash,
      totalProgress,
      callback,
      handlers,
      controller,
      totalSize,
      is_telegram,
    });

    promises.push(promise);

    if (
      currentIndex === 1 ||
      promises.length === MAX_PROMISES_LENGTH ||
      promises.length === allowedPromisesLength ||
      currentIndex === lastChunkIndex
    ) {
      const results = await Promise.all(promises);
      leftChunks = leftChunks - promises.length;
      promises.length = 0;
      for (const result of results) {
        if (result?.failed || result?.data?.data?.slug) {
          delete fileControllers[file.uploadId];
          totalProgress.number = 0;
          return result;
        }
      }
    }

    currentIndex++;
  }
};

export const cancelingUpload = (uploadId) => {
  if (fileControllers[uploadId]) {
    fileControllers[uploadId].abort();
  } else cancelledFiles.add(uploadId);
};
