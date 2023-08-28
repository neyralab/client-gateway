import axios from "axios";
import * as Base64 from "base64-js";

import { getFibonacciNumber } from "../utils/getFibonacciNumber";
import { convertTextToBase64 } from "../utils/convertTextToBase64";

import { MAX_TRIES } from "../config";

import { DispatchType, UpdateProgressCallback } from "../types";

export const sendChunk = async (
  chunk: ArrayBuffer,
  currentIndex: number,
  chunkLength: number,
  file: File | any,
  startTime: any,
  oneTimeToken: string,
  endpoint: string,
  iv: Uint8Array | null,
  clientsideKeySha3Hash: string | null,
  dispatch: DispatchType,
  totalProgress: { number: number },
  updateProgressCallback: UpdateProgressCallback
) => {
  const base64iv = iv ? Base64.fromByteArray(iv) : null;
  const fileName = convertTextToBase64(file.name);
  let currentTry = 1;
  const headers = iv
    ? {
        "x-clientsideKeySha3Hash": clientsideKeySha3Hash,
        "x-iv": base64iv,
      }
    : { "x-clientsideKeySha3Hash": "null", "x-iv": "null" };

  const inst = axios.create({
    headers: {
      "content-type": "application/octet-stream",
      "one-time-token": oneTimeToken,
      "x-file-name": fileName,
      "x-last": `${currentIndex}/${chunkLength}`,
      "x-chunk-index": `${currentIndex}`,
      "X-folder": file.folderId || "",
      "x-mime": file?.type,
      "X-Ai-Generated": false,
      ...headers,
    },
    onUploadProgress: (event) => {
      if (event.loaded === chunk.byteLength) {
        const prevProgress = totalProgress.number || 0;
        const progress = +prevProgress + event.loaded;
        totalProgress.number = progress;
        const elapsedTime = Date.now() - startTime;
        const remainingBytes = file.size - progress;
        const bytesPerMillisecond = progress / elapsedTime;
        const remainingTime = remainingBytes / bytesPerMillisecond;
        const timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
        updateProgressCallback(file.upload_id, progress, timeLeft, dispatch);
      }
    },
  });

  const uploadChunk: (chunk: ArrayBuffer) => Promise<any> = async (
    chunk: ArrayBuffer
  ) => {
    await new Promise<void>((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        currentTry === 1 ? 0 : getFibonacciNumber(currentTry) * 1000
      );
    });

    try {
      const response = await inst.post(
        `${endpoint}/chunked/uploadChunk`,
        chunk
      );
      if (currentTry > 1) {
        currentTry = 1;
      }
      return response;
    } catch (error: any) {
      console.error("ERROR", error);
      if (
        currentTry >= MAX_TRIES ||
        !error?.message?.includes("Network Error")
      ) {
        currentTry = 1;
        return { failed: true };
      } else {
        currentTry++;
        return uploadChunk(chunk);
      }
    }
  };

  return await uploadChunk(chunk);
};
