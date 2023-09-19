import * as forge from "node-forge";
import * as Base64 from "base64-js";

import { downloadFile, encryptChunk, sendChunk, swapChunk } from "../index";

import { getCrypto } from "../utils/getCrypto";
import { chunkStream } from "../utils/chunkStream";
import { hasWindow } from "../utils/hasWindow";
import { chunkBuffer } from "../utils/chunkBuffer";

import { CHUNK_SIZE } from "../config";

import { IEncodeExistingFile, IEncodeFile } from "../types";

const crypto = getCrypto();

const fileKey = forge.random.getBytesSync(32); // 32 bytes for AES-256
const md = forge.md.sha512.create();
md.update(fileKey);

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
  }: IEncodeFile) {
    const startTime = Date.now();
    let currentIndex = 0;
    let result;

    const totalProgress = { number: 0 };
    if (file?.isStream && !hasWindow()) {
      const stream = file.stream();
      const chunksLength = Math.floor(file.size / CHUNK_SIZE);
      const lastChunkSize =
        file.size > CHUNK_SIZE
          ? file.size - chunksLength * CHUNK_SIZE
          : file.size;

      for await (const chunk of chunkStream({
        stream,
        lastChunkSize,
      })) {
        const encryptedChunk = await encryptChunk({
          chunk,
          iv: this.iv,
          key,
        });

        result = await sendChunk({
          chunk: encryptedChunk,
          index: currentIndex,
          file,
          chunksLength,
          startTime,
          oneTimeToken,
          endpoint,
          iv: this.iv,
          clientsideKeySha3Hash: this.clientsideKeySha3Hash,
          totalProgress,
          callback,
          handlers,
        });
        if (result?.failed) {
          totalProgress.number = 0;
          return;
        }
        if (result?.data?.data?.slug) {
          totalProgress.number = 0;
          return result;
        }
        currentIndex++;
      }
    } else {
      const arrayBuffer = await file.arrayBuffer();
      const chunks = chunkBuffer({ arrayBuffer });

      const totalProgress = { number: 0 };

      for (const chunk of chunks) {
        const currentIndex = chunks.findIndex((el) => el === chunk);
        const encryptedChunk = await encryptChunk({ chunk, iv: this.iv, key });

        result = await sendChunk({
          chunk: encryptedChunk,
          index: currentIndex,
          chunksLength: chunks.length - 1,
          file,
          startTime,
          oneTimeToken,
          endpoint,
          iv: this.iv,
          clientsideKeySha3Hash: this.clientsideKeySha3Hash,
          totalProgress,
          callback,
          handlers,
        });
        if (result?.failed) {
          totalProgress.number = 0;
          return;
        }
      }
      totalProgress.number = 0;

      return result;
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
    const chunks = chunkBuffer({ arrayBuffer });

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
    let data: any;
    try {
      for (const chunk of chunks) {
        const currentIndex = chunks.findIndex((el) => el === chunk);
        const encryptedChunk = await encryptChunk({ chunk, iv: this.iv, key });

        data = await swapChunk({
          file,
          endpoint,
          base64iv,
          clientsideKeySha3Hash: this.clientsideKeySha3Hash,
          index: currentIndex,
          chunksLength: chunks.length - 1,
          oneTimeToken,
          encryptedChunk,
          fileSize: arrayBuffer.byteLength,
          startTime,
          totalProgress,
          callback,
          handlers,
        });
      }
    } catch (e) {
      handlers.includes("onError") &&
        callback({ type: "onError", params: { slug: file.slug } });
      return;
    }
    const { data: responseFromIpfs } = data;
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
}
