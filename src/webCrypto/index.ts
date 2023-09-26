import * as forge from "node-forge";
import * as Base64 from "base64-js";

import { downloadFile, encryptChunk, sendChunk, swapChunk } from "../index";

import { getCrypto } from "../utils/getCrypto";
import { chunkBuffer } from "../utils/chunkBuffer";
import { chunkFile } from "../utils/chunkFile";

import { IEncodeExistingFile, IEncodeFile } from "../types";

const crypto = getCrypto();

const fileKey = forge.random.getBytesSync(32); // 32 bytes for AES-256
const md = forge.md.sha512.create();
md.update(fileKey);

const fileControllers = {};
const cancelledFiles = new Set();

export class WebCrypto {
  readonly clientsideKeySha3Hash = md.digest().toHex();
  public iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));

  async encodeFile({
    file,
    oneTimeToken,
    endpoint,
    callback,
    handlers,
    key,
    crypto,
  }: IEncodeFile) {
    const controller = new AbortController();
    const startTime = Date.now();
    const totalProgress = { number: 0 };
    let currentIndex = 1;
    let result;

    fileControllers[file.uploadId] = controller;

    if (cancelledFiles.has(file.uploadId)) {
      fileControllers[file.uploadId].abort();
      cancelledFiles.delete(file.uploadId);
    }

    for await (const chunk of chunkFile({ file })) {
      const encryptedChunk = await encryptChunk({
        chunk,
        iv: this.iv,
        key,
        crypto,
      });

      result = await sendChunk({
        chunk: encryptedChunk,
        index: currentIndex,
        file,
        startTime,
        oneTimeToken,
        endpoint,
        iv: this.iv,
        clientsideKeySha3Hash: this.clientsideKeySha3Hash,
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
  }

  async encodeExistingFile({
    file,
    getOneTimeToken,
    getDownloadOTT,
    callback,
    handlers,
    key,
  }: IEncodeExistingFile) {
    const controller = new AbortController();
    const { signal } = controller;
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

    const startTime = Date.now();
    const base64iv = Base64.fromByteArray(this.iv);

    const totalProgress = { number: 0 };
    let result: any;
    let currentIndex = 1;
    try {
      for await (const chunk of chunkBuffer({ arrayBuffer })) {
        const encryptedChunk = await encryptChunk({ chunk, iv: this.iv, key });

        result = await swapChunk({
          file,
          endpoint,
          base64iv,
          clientsideKeySha3Hash: this.clientsideKeySha3Hash,
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
  }
}

export const cancelingEncryptAndUpload = (uploadId) => {
  if (fileControllers[uploadId]) {
    fileControllers[uploadId].abort();
  } else cancelledFiles.add(uploadId);
};
