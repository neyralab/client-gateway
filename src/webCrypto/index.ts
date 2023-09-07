import axios from "axios";
import * as forge from "node-forge";
import * as Base64 from "base64-js";

import {
  chunkFile,
  downloadFile,
  encryptChunk,
  sendChunk,
  swapChunk,
} from "../index";

import { getThumbnailImage, getThumbnailVideo } from "../utils/getThumbnail";
import { convertTextToBase64 } from "../utils/convertTextToBase64";
import { convertBlobToBase64 } from "../utils/convertBlobToBase64";
import { fetchBlobFromUrl } from "../utils/fetchBlobFromUrl";
import { getCrypto } from "../utils/getCrypto";

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
    getOneTimeToken,
    callback,
    handlers,
    key,
  }: IEncodeFile) {
    const startTime = Date.now();
    const arrayBuffer = await file.arrayBuffer();
    const chunks = chunkFile({ arrayBuffer });

    let base64Image;
    switch (true) {
      case file.type.startsWith("image"):
        getThumbnailImage(file).then((result) => {
          base64Image = result;
        });
        break;
      case file.type.startsWith("video"):
        getThumbnailVideo(file).then((result) => {
          base64Image = result;
        });
        break;
    }

    let result;

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

    const {
      data: {
        user_token: { token: thumbToken },
        endpoint: thumbEndpoint,
      },
    } = await getOneTimeToken({ filename: file.name, filesize: file.size });

    const instance = axios.create({
      headers: {
        "x-file-name": file.name,
        "Content-Type": "application/octet-stream",
        "one-time-token": thumbToken,
      },
    });
    try {
      if (base64Image) {
        await instance.post(
          `${thumbEndpoint}/chunked/thumb/${result?.data?.data?.slug}`,
          base64Image
        );
      }
    } catch (e) {
      return { failed: true };
    }

    return result;
  }

  async encodeExistingFile({
    file,
    getImagePreviewEffect,
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
    const chunks = chunkFile({ arrayBuffer });

    const fileSignal = axios.CancelToken.source();
    let thumbnail;
    const hasThumbnail =
      file.mime.startsWith("image") || file.mime.startsWith("video");

    handlers.includes("onStart") &&
      callback({
        type: "onStart",
        params: { file, size: arrayBuffer.byteLength },
      });

    if (hasThumbnail) {
      thumbnail = await getImagePreviewEffect(
        file.slug,
        300,
        164,
        "crop",
        fileSignal.token,
        file.mime
      );
    }
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

      if (hasThumbnail) {
        try {
          const {
            data: {
              user_token: { token: thumbToken },
              endpoint: thumbEndpoint,
            },
          } = await getOneTimeToken({
            filename: file.name,
            filesize: file.size,
          });
          const fileName = convertTextToBase64(file.name);
          fetchBlobFromUrl(thumbnail)
            .then((blob) => {
              return convertBlobToBase64(blob);
            })
            .then((base64Data) => {
              axios
                .create({
                  headers: {
                    "x-file-name": fileName,
                    "Content-Type": "application/octet-stream",
                    "one-time-token": thumbToken,
                  },
                })
                .post(
                  `${thumbEndpoint}/chunked/thumb/${responseFromIpfs?.data?.slug}`,
                  base64Data
                );
            })
            .catch((e) => {
              console.error("ERROR", e);
            });
        } catch (e) {
          console.error("ERROR", e);
        }
      }
      return responseFromIpfs;
    }
  }
}
