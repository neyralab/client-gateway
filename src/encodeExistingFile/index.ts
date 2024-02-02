import * as forge from 'node-forge';
import * as Base64 from 'base64-js';

import { downloadFile, encryptChunk, swapChunk } from '../index.js';

import { getCrypto } from '../utils/getCrypto.js';
import { chunkBuffer } from '../utils/chunkBuffer.js';

import { IEncodeExistingFile } from '../types/index.js';

const crypto = getCrypto();

const fileKey = forge.random.getBytesSync(32); // 32 bytes for AES-256
const md = forge.md.sha512.create();
md.update(fileKey);

export const encodeExistingFile = async ({
  file,
  oneTimeToken,
  gateway,
  downloadToken,
  downloadEndpoint,
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

  const fileBlob: Blob = await downloadFile({
    file,
    oneTimeToken: downloadToken,
    signal,
    endpoint: downloadEndpoint,
    isEncrypted: false,
  });

  const arrayBuffer = await fileBlob.arrayBuffer();

  handlers.includes('onStart') &&
    callback({
      type: 'onStart',
      params: { file, size: arrayBuffer.byteLength },
    });

  try {
    for await (const chunk of chunkBuffer({
      arrayBuffer,
      uploadChunkSize: gateway.upload_chunk_size,
    })) {
      const encryptedChunk = await encryptChunk({ chunk, iv, key });

      result = await swapChunk({
        file,
        gateway,
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
            '.download__modal__button__cancel'
          );
          handlers.includes('onSuccess') &&
            callback({
              type: 'onSuccess',
              params: { isCancelModalOpen, response: responseFromIpfs },
            });
          return responseFromIpfs;
        }
      }
      currentIndex++;
    }
  } catch (e) {
    handlers.includes('onError') &&
      callback({ type: 'onError', params: { slug: file.slug } });
    return;
  }
};
