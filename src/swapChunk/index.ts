import axios from "axios";

import { DispatchType, UpdateProgressCallback } from "../types";

export const swapChunk = async (
  file: File | any,
  endpoint: string,
  base64iv: string,
  clientsideKeySha3Hash: string,
  currentIndex: number,
  chunksLength: number,
  oneTimeToken: string,
  encryptedChunk: ArrayBuffer,
  arrayBuffer: ArrayBuffer,
  startTime: any,
  dispatch: DispatchType,
  totalProgress: { number: number },
  updateProgressCallback: UpdateProgressCallback
) => {
  const url = `${endpoint}/chunked/swap/${file.slug}`;
  const inst = axios.create({
    headers: {
      "x-iv": base64iv,
      "x-clientsideKeySha3Hash": clientsideKeySha3Hash,
      "x-last": `${currentIndex}/${chunksLength}`,
      "Content-Type": "application/octet-stream",
      "one-time-token": oneTimeToken,
    },
    onUploadProgress: (event) => {
      if (event.loaded === encryptedChunk.byteLength) {
        const prevProgress = totalProgress.number || 0;
        const progress = +prevProgress + event.loaded;
        totalProgress.number = progress;
        const elapsedTime = Date.now() - startTime;
        const remainingBytes = arrayBuffer.byteLength - progress;
        const bytesPerMillisecond = progress / elapsedTime;
        const remainingTime = remainingBytes / bytesPerMillisecond;
        const timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
        updateProgressCallback(file.upload_id, progress, timeLeft, dispatch);
      }
    },
    cancelToken: file.source?.token,
  });
  return await inst.post(url, encryptedChunk);
};
